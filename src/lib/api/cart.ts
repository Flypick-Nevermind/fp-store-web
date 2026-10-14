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
export function resolveCartImageUrl(image?: string): string {
  if (!image) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }

  // Already an absolute URL or data URI
  if (/^(?:https?:\/\/|data:image\/)/i.test(image)) {
    return image;
  }

  // Strip leading slashes
  const cleanKey = image.replace(/^\/+/, "");

  if (cleanKey.startsWith("api/v1/images/media/")) {
    return `${API_BASE_URL}/${cleanKey}`;
  }

  if (cleanKey.startsWith("images/media/")) {
    return `${API_BASE_URL}/api/v1/${cleanKey}`;
  }

  return `${API_BASE_URL}/api/v1/images/media/${encodeURIComponent(cleanKey)}`;
}

export function extractCartImageUrl(
  images?: (CartImageItem | string)[],
): string {
  if (!images || images.length === 0) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }
  const first = images[0];
  let raw = "";
  if (typeof first === "string") {
    raw = first;
  } else if (first && typeof first === "object") {
    raw = first.cart_image_value || "";
  }
  return resolveCartImageUrl(raw);
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
