import { apiClient } from "@/lib/api-client";
import { getActiveCnyToIdrRate } from "@/store/use-exchange-rate-store";
import type { BuyForMeItem } from "@/types";
import type {
  CartCheckPayload,
  CartCreationResponseData,
  CartImageItem,
  CartLookupPayload,
  CartLookupResponseData,
  CartWithImagesItem,
} from "@/types/api";

export const DEFAULT_PRODUCT_IMAGE = "/images/default-product.svg";

/**
 * Resolve an image value into a loadable image URL.
 * Supports external URLs, base64 data URIs, and backend S3 Wasabi object keys
 * routed via Next.js `/api/v1/images/media/{key}` rewrite.
 */
export function resolveCartImageUrl(image?: unknown): string {
  if (!image) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  let raw = "";
  if (typeof image === "string") {
    raw = image.trim();
  } else if (typeof image === "object" && image !== null) {
    const obj = image as Record<string, unknown>;
    raw =
      (typeof obj.cart_image_value === "string" && obj.cart_image_value) ||
      (typeof obj.url === "string" && obj.url) ||
      (typeof obj.file_url === "string" && obj.file_url) ||
      (typeof obj.image_url === "string" && obj.image_url) ||
      (typeof obj.object_key === "string" && obj.object_key) ||
      (typeof obj.media_key === "string" && obj.media_key) ||
      (typeof obj.key === "string" && obj.key) ||
      (typeof obj.path === "string" && obj.path) ||
      (typeof obj.value === "string" && obj.value) ||
      "";
    raw = raw.trim();
  }

  if (!raw) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  if (/^data:image\//i.test(raw)) {
    return raw;
  }

  // If backend/admin stored an absolute URL pointing to our own media endpoint
  // (or /api-admin/v1/images/media/...), normalize to relative `/api/v1/images/media/...`
  // so it goes through Next.js rewrites without CORP/CORS or admin-auth issues.
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const mediaMatch = parsed.pathname.match(
        /^\/(?:api|api-admin)\/v1\/images\/media\/(.+)$/,
      );
      if (mediaMatch) {
        return `/api/v1/images/media/${mediaMatch[1]}`;
      }
    } catch {
      // Fall through to return raw URL
    }
    return raw;
  }

  // Strip leading slashes
  const cleanKey = raw.replace(/^\/+/, "");

  if (cleanKey.startsWith("api/v1/images/media/")) {
    return `/${cleanKey}`;
  }

  if (cleanKey.startsWith("api-admin/v1/images/media/")) {
    return `/${cleanKey.replace(/^api-admin\//, "api/")}`;
  }

  if (cleanKey.startsWith("images/media/")) {
    return `/api/v1/${cleanKey}`;
  }

  const encodedKey = cleanKey.includes("%")
    ? cleanKey
    : encodeURIComponent(cleanKey);
  return `/api/v1/images/media/${encodedKey}`;
}

export function extractCartImageUrl(
  images?: (CartImageItem | string)[] | unknown,
): string {
  if (!images) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  let list: unknown[] = [];
  if (Array.isArray(images)) {
    list = images;
  } else if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) list = parsed;
      else list = [images];
    } catch {
      list = [images];
    }
  } else if (typeof images === "object") {
    list = [images];
  }

  for (const item of list) {
    const resolved = resolveCartImageUrl(item);
    if (resolved !== DEFAULT_PRODUCT_IMAGE) {
      return resolved;
    }
  }

  return DEFAULT_PRODUCT_IMAGE;
}

export function parsePrice(priceString?: string): {
  priceIdr: number;
  priceCny: number;
} {
  const raw = parseFloat(priceString || "0") || 0;
  const rate = getActiveCnyToIdrRate();

  // If >= 1000, consider as IDR, otherwise CNY
  if (raw >= 1000) {
    return {
      priceIdr: Math.round(raw),
      priceCny: Math.round((raw / rate) * 10) / 10 || 1,
    };
  }

  const cny = raw > 0 ? raw : 50;
  return {
    priceCny: cny,
    priceIdr: Math.round(cny * rate),
  };
}

export function mapLookupResponseToCartItem(
  lookup: CartLookupResponseData,
): BuyForMeItem {
  const { priceIdr, priceCny } = parsePrice(lookup.cart_price);
  const imageUrl = extractCartImageUrl(lookup.cart_images);
  const exchangeRate = getActiveCnyToIdrRate();

  return {
    id: lookup.cart_id || `FP-ITEM-${Date.now().toString().slice(-6)}`,
    serviceType: "BUY_FOR_ME",
    sourceUrl: lookup.cart_url,
    productName: lookup.cart_title || "Produk Import Marketplace China",
    priceCny,
    exchangeRate,
    priceIdr,
    selectedVariant: {
      color: "Default Color",
      size: "Standard Size",
      skuId: `SKU-${lookup.cart_id ? lookup.cart_id.slice(0, 8).toUpperCase() : "DEF"}`,
    },
    quantity: 1,
    notes: "Otomatis diimpor via Flypick Cart Lookup API",
    imageUrl,
  };
}

export function mapCartWithImagesToCartItem(
  apiCart: CartWithImagesItem,
): BuyForMeItem {
  const { priceIdr, priceCny } = parsePrice(apiCart.cart_price);
  const imageUrl = extractCartImageUrl(apiCart.cart_images);
  const exchangeRate = getActiveCnyToIdrRate();

  return {
    id: apiCart.cart_id,
    serviceType: "BUY_FOR_ME",
    sourceUrl: apiCart.cart_url,
    productName: apiCart.cart_title || "Produk Import Marketplace China",
    priceCny,
    exchangeRate,
    priceIdr,
    selectedVariant: {
      color: "Default Color",
      size: "Standard Size",
      skuId: `SKU-${apiCart.cart_id.slice(0, 8).toUpperCase()}`,
    },
    quantity: 1,
    notes: "Tersimpan di Akun Virtual Gudang Flypick",
    imageUrl,
  };
}

const MAX_BACKEND_URL_LENGTH = 500;

const TRACKING_QUERY_PARAMS = new Set([
  "spm",
  "utparam",
  "abbucket",
  "pvid",
  "scm",
  "xxc",
  "ali_trackid",
  "ali_refid",
  "clk1",
  "upsid",
  "sourcetype",
  "from",
  "share_token",
  "wx_header",
  "fbclid",
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
]);

const ESSENTIAL_PRODUCT_PARAMS = new Set([
  "id",
  "offerid",
  "goods_id",
  "itemid",
  "skuid",
  "sku_id",
  "productid",
]);

/**
 * Strips bloated marketplace tracking query parameters when a URL exceeds the
 * backend's 500-character validation limit while preserving essential product IDs.
 */
export function sanitizeMarketplaceUrl(
  rawUrl: string,
  maxLength = MAX_BACKEND_URL_LENGTH,
): string {
  const trimmed = rawUrl.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);

    for (const key of Array.from(parsed.searchParams.keys())) {
      if (TRACKING_QUERY_PARAMS.has(key.toLowerCase())) {
        parsed.searchParams.delete(key);
      }
    }

    if (parsed.toString().length <= maxLength) {
      return parsed.toString();
    }

    // Still too long: strip hash and keep only essential product-identifying params
    parsed.hash = "";
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (!ESSENTIAL_PRODUCT_PARAMS.has(key.toLowerCase())) {
        parsed.searchParams.delete(key);
      }
    }

    return parsed.toString();
  } catch {
    return trimmed;
  }
}

export async function cartLookupApi(
  payload: CartLookupPayload,
): Promise<CartLookupResponseData> {
  return apiClient<CartLookupResponseData>("/api/v1/lookup", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      cart_url: sanitizeMarketplaceUrl(payload.cart_url),
    }),
  });
}

export async function getUserCartsApi(
  userId: string,
): Promise<CartWithImagesItem[]> {
  return apiClient<CartWithImagesItem[]>(`/api/v1/carts/${userId}`, {
    method: "GET",
  });
}

export async function cartCheckApi(
  payload: CartCheckPayload,
  token?: string,
): Promise<CartCreationResponseData> {
  return apiClient<CartCreationResponseData>("/api/v1/cart/check", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      items: payload.items.map((item) => ({
        ...item,
        url: sanitizeMarketplaceUrl(item.url),
      })),
    }),
    token,
  });
}
