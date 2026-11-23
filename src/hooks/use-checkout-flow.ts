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
  const setAddOns = useCheckoutStore((s) => s.setAddOns);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Total quantity across all links
  const totalItemCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  // Subtotals & Fee calculations (Add-ons disabled for end-to-end focus)
  const subtotalIdr = getSubtotalIdr();
  const serviceFeeIdr = getServiceFeeIdr();
  const addOns = { photoQc: false, extraBubbleWrap: false };
  const photoQcFee = 0;
  const bubbleWrapFee = 0;
  const addOnsTotal = 0;

  // Shipping Fee reference (Cargo vs Handcarry)
  const isHandcarry = shippingMethod === "HANDCARRY";
  const handcarryRatePerItem = BRANDING.shippingRates.handcarry.ratePerItem;
  const handcarryShippingFee = totalItemCount * handcarryRatePerItem;

  // Cargo estimated freight (indicative only, billed at Stage 2 upon arrival in Indonesia)
  const cargoRatePerKg = BRANDING.shippingRates.cargo.ratePerKg;
  const estimatedWeightKg = 1.5;
  const cargoEstimatedStage2 = Math.round(cargoRatePerKg * estimatedWeightKg);

  // Flow 2 Tahap:
  // Tahap 1 (Saat Checkout): Customer membayar harga barang + service fee + add-ons agar barang dibelikan.
  // Tahap 2 (Saat Tiba di Indonesia): Biaya ongkir aktual ditagihkan terpisah ke customer.
  const stage1ShippingFee = 0;
  const grandTotalStage1 = subtotalIdr + serviceFeeIdr + addOnsTotal;
  const estimatedStage2 = isHandcarry
    ? handcarryShippingFee
    : cargoEstimatedStage2;

  return {
    items,
    totalItemCount,
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
    isHandcarry,
    handcarryShippingFee,
    cargoEstimatedStage2,
    shippingFee: stage1ShippingFee,
    stage1ShippingFee,
    grandTotalStage1,
    grandTotalAllIn: grandTotalStage1,
    estimatedStage2,
    isPaymentModalOpen,
    openPaymentModal: () => setIsPaymentModalOpen(true),
    closePaymentModal: () => setIsPaymentModalOpen(false),
  };
}
