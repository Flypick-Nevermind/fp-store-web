"use client";

import confetti from "canvas-confetti";
import { useState } from "react";
import { useToast } from "@/providers/toast-provider";
import { useCheckoutStore } from "@/store/use-checkout-store";
import type { OrderRecord } from "@/types";

export function useStage2Payment() {
  const { success } = useToast();
  const payStage2 = useCheckoutStore((s) => s.payStage2);

  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "VA">("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const openPaymentModal = (order: OrderRecord) => {
    setActiveOrder(order);
    setIsPaid(order.stage2PaymentStatus === "PAID");
    setIsModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsModalOpen(false);
    setIsProcessing(false);
    setIsPaid(false);
    setActiveOrder(null);
  };

  const handleSimulatePayment = () => {
    if (!activeOrder) return;
    setIsProcessing(true);

    setTimeout(() => {
      payStage2(activeOrder.id);
      setIsProcessing(false);
      setIsPaid(true);

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2323FF", "#00F0FF", "#FFDE00"],
        });
      } catch (_e) {
        // fallback
      }

      success(
        "Pelunasan Tahap 2 Berhasil!",
        `Kargo ${activeOrder.trackingCode} telah dirilis untuk proses bea cukai dan pengantaran domestik.`,
      );
    }, 1200);
  };

  return {
    activeOrder,
    isModalOpen,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    isPaid,
    openPaymentModal,
    closePaymentModal,
    handleSimulatePayment,
  };
}
