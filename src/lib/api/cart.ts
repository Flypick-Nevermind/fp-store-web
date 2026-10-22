import { BRANDING } from "@/config/branding";
import { apiClient } from "@/lib/api-client";
import type { BuyForMeItem } from "@/types";
import type {
  CartCheckPayload,
  CartCreationResponseData,
  CartImageItem,
  CartLookupPayload,
  CartLookupResponseData,
  CartWithImagesItem,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://service-flypick-production.up.railway.app";

/**
 * Resolve an image value into a fully qualified image URL.
 * Supports absolute URLs, base64 data URIs, and backend S3 Wasabi object keys via /api/v1/images/media/{key}.
 */
export function resolveCartImageUrl(image?: unknown): string {
  if (!image) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
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
      (typeof obj.object_key === "string" && obj.object_key) ||
      "";
  }

  if (!raw) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }

  // Already an absolute URL or data URI
  if (/^(?:https?:\/\/|data:image\/)/i.test(raw)) {
    return raw;
  }

  // Strip leading slashes
  const cleanKey = raw.replace(/^\/+/, "");

  if (cleanKey.startsWith("api/v1/images/media/")) {
    return `${API_BASE_URL}/${cleanKey}`;
  }

  if (cleanKey.startsWith("api-admin/v1/images/media/")) {
    return `${API_BASE_URL}/${cleanKey}`;
  }

  if (cleanKey.startsWith("images/media/")) {
    return `${API_BASE_URL}/api/v1/${cleanKey}`;
  }

  return `${API_BASE_URL}/api/v1/images/media/${encodeURIComponent(cleanKey)}`;
}

export function extractCartImageUrl(
  images?: (CartImageItem | string)[] | unknown,
): string {
  if (!images) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
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

  if (list.length === 0) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }

  return resolveCartImageUrl(list[0]);
}

export function parsePrice(priceString?: string): {
  priceIdr: number;
  priceCny: number;
} {
  const raw = parseFloat(priceString || "0") || 0;
  const rate = BRANDING.exchangeRate.cnyToIdr;

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

  return {
    id: lookup.cart_id || `FP-ITEM-${Date.now().toString().slice(-6)}`,
    serviceType: "BUY_FOR_ME",
    sourceUrl: lookup.cart_url,
    productName: lookup.cart_title || "Produk Import Marketplace China",
    priceCny,
    exchangeRate: BRANDING.exchangeRate.cnyToIdr,
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

  return {
    id: apiCart.cart_id,
    serviceType: "BUY_FOR_ME",
    sourceUrl: apiCart.cart_url,
    productName: apiCart.cart_title || "Produk Import Marketplace China",
    priceCny,
    exchangeRate: BRANDING.exchangeRate.cnyToIdr,
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

export async function cartLookupApi(
  payload: CartLookupPayload,
): Promise<CartLookupResponseData> {
  return apiClient<CartLookupResponseData>("/api/v1/lookup", {
    method: "POST",
    body: JSON.stringify(payload),
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
    body: JSON.stringify(payload),
    token,
  });
}
