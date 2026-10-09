import { BRANDING } from "@/config/branding";
import { apiClient } from "@/lib/api-client";
import type { BuyForMeItem } from "@/types";
import type {
  CartImageItem,
  CartLookupPayload,
  CartLookupResponseData,
  CartWithImagesItem,
} from "@/types/api";

export function extractCartImageUrl(
  images?: (CartImageItem | string)[],
): string {
  if (!images || images.length === 0) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  }
  const first = images[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && first.cart_image_value) {
    return first.cart_image_value;
  }
  return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
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
