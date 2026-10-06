import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type { BuyForMeItem, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  // Selectors / calculation getters
  getSubtotalIdr: () => number;
  getServiceFeeIdr: () => number;
  getItemCount: () => number;
  getBuyForMeTotalCny: () => number;
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "FP-ITEM-01",
    serviceType: "BUY_FOR_ME",
    sourceUrl: "https://item.taobao.com/item.htm?id=726194812301",
    productName: "Retro Vintage Cargo Jacket Unisex Oversized",
    priceCny: 189.0,
    exchangeRate: BRANDING.exchangeRate.cnyToIdr,
    priceIdr: 189.0 * BRANDING.exchangeRate.cnyToIdr,
    selectedVariant: {
      color: "Washed Olive Green",
      size: "XL (Loose Fit)",
      skuId: "SKU-7721-OLV",
    },
    quantity: 1,
    notes: "Mohon dicek jahitan resleting & kancing cadangan.",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "FP-FWD-02",
    serviceType: "FORWARDING",
    chinaTrackingNumber: "SF148902819001",
    itemCategory: "ELECTRONICS",
    quantity: 2,
    declaredValueIdr: 750000,
    description: "Mechanical Keyboard Switches & Custom Keycap Set (2 Boxes)",
    courierName: "SF Express (顺丰速运)",
  },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: INITIAL_ITEMS,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex > -1) {
            const nextItems = [...state.items];
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              quantity:
                nextItems[existingIndex].quantity + (item.quantity || 1),
            };
            return { items: nextItems };
          }
          return { items: [item, ...state.items] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotalIdr: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          if (item.serviceType === "BUY_FOR_ME") {
            const unitPrice =
              item.priceIdr || item.priceCny * item.exchangeRate;
            return acc + unitPrice * item.quantity;
          }
          // For forwarding, product is already bought by user, so product invoice stage 1 is 0
          return acc;
        }, 0);
      },

      getServiceFeeIdr: () => {
        const { items } = get();
        // Handling fee per item line
        const buyForMeCount = items.filter(
          (i) => i.serviceType === "BUY_FOR_ME",
        ).length;
        const forwardingCount = items.filter(
          (i) => i.serviceType === "FORWARDING",
        ).length;
        return (
          buyForMeCount * BRANDING.serviceFees.handlingFeeIdr +
          forwardingCount * 10000
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getBuyForMeTotalCny: () => {
        const { items } = get();
        return items
          .filter(
            (item): item is BuyForMeItem => item.serviceType === "BUY_FOR_ME",
          )
          .reduce((acc, item) => acc + item.priceCny * item.quantity, 0);
      },
    }),
    {
      name: "flypick-cart-storage",
    },
  ),
);
