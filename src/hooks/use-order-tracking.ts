"use client";

import { useMemo, useState } from "react";
import { useUserOrdersQuery } from "@/hooks/use-order-api";
import { mapBackendOrderToOrderRecord } from "@/lib/api/order";
import { useAuthStore } from "@/store/use-auth-store";
import { useCheckoutStore } from "@/store/use-checkout-store";
import type { OrderRecord } from "@/types";

export function useOrderTracking() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const isLoginModalOpen = useAuthStore((s) => s.isLoginModalOpen);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);
  const localOrders = useCheckoutStore((s) => s.orders);

  // Fetch real orders from backend
  const {
    data: serverOrders,
    isLoading: isServerOrdersLoading,
    refetch: refetchServerOrders,
  } = useUserOrdersQuery(user?.id);

  // Map backend order models to front-end OrderRecord
  const mappedServerOrders = useMemo(() => {
    if (!serverOrders || serverOrders.length === 0) return [];
    return serverOrders.map(mapBackendOrderToOrderRecord);
  }, [serverOrders]);

  // Combine orders prioritizing backend orders, followed by non-duplicate local orders
  const orders: OrderRecord[] = useMemo(() => {
    if (!isAuthenticated || !user) {
      return localOrders;
    }
    if (mappedServerOrders.length === 0) {
      return localOrders;
    }

    const serverOrderNumbers = new Set(
      mappedServerOrders.map((o) => o.trackingCode || o.id),
    );
    const nonDuplicatedLocal = localOrders.filter(
      (lo) =>
        !serverOrderNumbers.has(lo.id) &&
        !serverOrderNumbers.has(lo.trackingCode),
    );

    return [...mappedServerOrders, ...nonDuplicatedLocal];
  }, [isAuthenticated, user, mappedServerOrders, localOrders]);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null,
  );

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return {
    user,
    isAuthenticated,
    orders,
    isLoadingOrders: isServerOrdersLoading,
    refetchOrders: refetchServerOrders,
    logout,
    expandedOrderId,
    toggleExpandOrder,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };
}

