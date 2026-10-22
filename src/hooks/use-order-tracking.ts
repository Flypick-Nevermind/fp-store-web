"use client";

import { useMemo, useState } from "react";
import { useUserOrdersQuery } from "@/hooks/use-order-api";
import { mapBackendOrderToOrderRecord } from "@/lib/api/order";
import { useAuthStore } from "@/store/use-auth-store";
import { useCheckoutStore } from "@/store/use-checkout-store";
import type { OrderRecord } from "@/types";

const DUMMY_ORDER_IDS = new Set(["FP-ORD-882190"]);

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

  // When authenticated, real database orders from GET /api/v1/orders/user/:user_id
  // are the single source of truth.
  // Sort by checkout date descending (latest checkout first)
  const orders: OrderRecord[] = useMemo(() => {
    const getTime = (dateStr?: string) => {
      if (!dateStr) return 0;
      const t = new Date(dateStr).getTime();
      return isNaN(t) ? 0 : t;
    };

    if (isAuthenticated && user) {
      return [...mappedServerOrders].sort(
        (a, b) => getTime(b.createdAt) - getTime(a.createdAt),
      );
    }

    // Guest / unauthenticated fallback
    const cleanLocal = localOrders.filter(
      (lo) => lo && !DUMMY_ORDER_IDS.has(lo.id),
    );
    return [...cleanLocal].sort(
      (a, b) => getTime(b.createdAt) - getTime(a.createdAt),
    );
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

