"use client";

import { useState } from "react";
import { BRANDING } from "@/config/branding";
import { useCartStore } from "@/store/use-cart-store";
import { useCheckoutStore } from "@/store/use-checkout-store";

export function useCheckoutFlow() {
  const items = useCartStore((s) => s.items);
  const getSubtotalIdr = useCartStore((s) => s.getSubtotalIdr);
  const getServiceFeeIdr = useCartStore((s) => s.getServiceFeeIdr);

  const deliveryAddress = useCheckoutStore((s) => s.deliveryAddress);
  const setDeliveryAddress = useCheckoutStore((s) => s.setDeliveryAddress);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
  const addOns = useCheckoutStore((s) => s.addOns);
  const setAddOns = useCheckoutStore((s) => s.setAddOns);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Subtotals & Fee calculations
  const subtotalIdr = getSubtotalIdr();
  const serviceFeeIdr = getServiceFeeIdr();
  const photoQcFee = addOns.photoQc ? BRANDING.serviceFees.photoQcIdr : 0;
  const bubbleWrapFee = addOns.extraBubbleWrap
    ? BRANDING.serviceFees.extraBubbleWrapIdr
    : 0;
  const addOnsTotal = photoQcFee + bubbleWrapFee;
  const grandTotalStage1 = subtotalIdr + serviceFeeIdr + addOnsTotal;

  // Estimated Stage 2 freight
  const freightRate =
    shippingMethod === "AIR_EXPRESS"
      ? BRANDING.shippingRates.airExpress.ratePerKg
      : BRANDING.shippingRates.seaEconomy.ratePerKg;
  const estimatedWeight = 1.5; // Est. 1.5kg
  const estimatedStage2 = Math.round(freightRate * estimatedWeight);

  return {
    items,
    deliveryAddress,
    setDeliveryAddress,
    shippingMethod,
    setShippingMethod,
    addOns,
    setAddOns,
    subtotalIdr,
    serviceFeeIdr,
    photoQcFee,
    bubbleWrapFee,
    addOnsTotal,
    grandTotalStage1,
    estimatedStage2,
    isPaymentModalOpen,
    openPaymentModal: () => setIsPaymentModalOpen(true),
    closePaymentModal: () => setIsPaymentModalOpen(false),
  };
}
