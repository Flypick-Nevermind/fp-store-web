import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type { BuyForMeItem, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  dismissedItemIds: string[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  updatePackagingOption: (
    id: string,
    packagingOption: "WITH_BOX" | "NO_BOX",
  ) => void;
  clearCart: () => void;
  isItemDismissed: (id: string) => boolean;

  // Selectors / calculation getters
  getSubtotalIdr: () => number;
  getServiceFeeIdr: () => number;
  getItemCount: () => number;
  getBuyForMeTotalCny: () => number;
}

// Legacy mock item IDs used during early prototype development
const DUMMY_SEED_IDS = new Set(["FP-ITEM-01", "FP-FWD-02"]);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      dismissedItemIds: [],

      addItem: (item) => {
        set((state) => {
          const remainingDismissed = state.dismissedItemIds.filter(
            (id) => id !== item.id,
          );
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex > -1) {
            const nextItems = [...state.items];
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              quantity:
                nextItems[existingIndex].quantity + (item.quantity || 1),
            };
            return { items: nextItems, dismissedItemIds: remainingDismissed };
          }
          return {
            items: [item, ...state.items],
            dismissedItemIds: remainingDismissed,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          dismissedItemIds: state.dismissedItemIds.includes(id)
            ? state.dismissedItemIds
            : [...state.dismissedItemIds, id],
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

      updatePackagingOption: (id, packagingOption) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, packagingOption } : item,
          ),
        }));
      },

      clearCart: () => {
        set((state) => ({
          items: [],
          dismissedItemIds: [
            ...state.dismissedItemIds,
            ...state.items.map((i) => i.id),
          ],
        }));
      },

      isItemDismissed: (id: string) => {
        return get().dismissedItemIds.includes(id);
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
      version: 2,
      migrate: (_persistedState: unknown, version: number) => {
        // Reset legacy unversioned / v1 store to clean empty state
        if (version < 2) {
          return {
            items: [],
            dismissedItemIds: [],
          };
        }
        return _persistedState as CartState;
      },
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as
          | { items?: CartItem[]; dismissedItemIds?: string[] }
          | undefined;
        if (!persisted) {
          return currentState;
        }
        const cleanItems = Array.isArray(persisted.items)
          ? persisted.items.filter((item) => !DUMMY_SEED_IDS.has(item.id))
          : [];
        const cleanDismissed = Array.isArray(persisted.dismissedItemIds)
          ? persisted.dismissedItemIds
          : [];

        return {
          ...currentState,
          items: cleanItems,
          dismissedItemIds: cleanDismissed,
        };
      },
    },
  ),
);
