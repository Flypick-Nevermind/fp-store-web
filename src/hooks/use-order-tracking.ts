"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useCheckoutStore } from "@/store/use-checkout-store";

export function useOrderTracking() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const orders = useCheckoutStore((s) => s.orders);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null,
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return {
    user,
    isAuthenticated,
    orders,
    logout,
    expandedOrderId,
    toggleExpandOrder,
    isLoginModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false),
  };
}
