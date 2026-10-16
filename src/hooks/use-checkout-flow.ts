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

  // Total quantity across all links
  const totalItemCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  // Subtotals & Fee calculations
  const subtotalIdr = getSubtotalIdr();
  const serviceFeeIdr = getServiceFeeIdr();
  const photoQcFee = addOns.photoQc ? BRANDING.serviceFees.photoQcIdr : 0;
  const bubbleWrapFee = addOns.extraBubbleWrap
    ? BRANDING.serviceFees.extraBubbleWrapIdr
    : 0;
  const addOnsTotal = photoQcFee + bubbleWrapFee;

  // Shipping Fee calculation (Cargo vs Handcarry)
  const isHandcarry = shippingMethod === "HANDCARRY";
  const handcarryRatePerItem = BRANDING.shippingRates.handcarry.ratePerItem;
  const handcarryShippingFee = totalItemCount * handcarryRatePerItem;

  // Cargo estimated freight
  const cargoRatePerKg = BRANDING.shippingRates.cargo.ratePerKg;
  const estimatedWeightKg = 1.5;
  const cargoEstimatedStage2 = Math.round(cargoRatePerKg * estimatedWeightKg);

  // 1x Pembayaran Saja (All-In):
  // Seluruh biaya (harga barang, fee talangan, proteksi, & ongkir kargo/handcarry)
  // dibayarkan 1 kali di awal (Single Payment).
  const shippingFee = isHandcarry ? handcarryShippingFee : cargoEstimatedStage2;
  const grandTotalAllIn =
    subtotalIdr + serviceFeeIdr + addOnsTotal + shippingFee;

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
    shippingFee,
    stage1ShippingFee: shippingFee,
    grandTotalStage1: grandTotalAllIn,
    grandTotalAllIn,
    estimatedStage2: 0,
    isPaymentModalOpen,
    openPaymentModal: () => setIsPaymentModalOpen(true),
    closePaymentModal: () => setIsPaymentModalOpen(false),
  };
}
