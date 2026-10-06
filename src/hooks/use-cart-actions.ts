"use client";

import { useCartStore } from "@/store/use-cart-store";

export function useCartActions() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const getSubtotalIdr = useCartStore((s) => s.getSubtotalIdr);
  const getServiceFeeIdr = useCartStore((s) => s.getServiceFeeIdr);
  const getItemCount = useCartStore((s) => s.getItemCount());
  const getBuyForMeTotalCny = useCartStore((s) => s.getBuyForMeTotalCny);

  const buyForMeItems = items.filter((i) => i.serviceType === "BUY_FOR_ME");
  const forwardingItems = items.filter((i) => i.serviceType === "FORWARDING");

  const subtotalIdr = getSubtotalIdr();
  const serviceFeeIdr = getServiceFeeIdr();
  const totalStage1Idr = subtotalIdr + serviceFeeIdr;
  const buyForMeCny = getBuyForMeTotalCny();

  return {
    items,
    buyForMeItems,
    forwardingItems,
    itemCount: getItemCount,
    subtotalIdr,
    serviceFeeIdr,
    totalStage1Idr,
    buyForMeCny,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  };
}
