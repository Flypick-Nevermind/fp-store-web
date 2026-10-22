"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCartCreationsApi,
  updateAdminCartCreationStatusApi,
  updateAdminCartItemApi,
  verifyOrderPaymentAdminApi,
} from "@/lib/api/admin";
import { useAuthStore } from "@/store/use-auth-store";
import type {
  AdminUpdateCartPayload,
  VerifyOrderPaymentPayload,
} from "@/types/api";

/**
 * Hook to fetch all pending cart creations for Admin
 */
export function useAdminCartCreationsQuery() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["admin-cart-creations"],
    queryFn: () => getAdminCartCreationsApi(token || undefined),
    staleTime: 1000 * 30, // 30s
  });
}

/**
 * Hook for admin to update a cart item (set price CNY, title, images, rejection status)
 */
export function useUpdateAdminCartItemMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: ({
      cartId,
      payload,
    }: {
      cartId: string;
      payload: AdminUpdateCartPayload;
    }) => updateAdminCartItemApi(cartId, payload, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cart-creations"] });
      queryClient.invalidateQueries({ queryKey: ["user-carts"] });
    },
  });
}

/**
 * Hook for admin to update status of a cart creation batch
 */
export function useUpdateAdminCartCreationStatusMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: ({
      creationId,
      status,
    }: {
      creationId: string;
      status: string;
    }) =>
      updateAdminCartCreationStatusApi(creationId, status, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cart-creations"] });
    },
  });
}

/**
 * Hook for finance admin to approve or reject order payment
 */
export function useAdminVerifyPaymentMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: VerifyOrderPaymentPayload;
    }) => verifyOrderPaymentAdminApi(orderId, payload, token || undefined),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["order-detail", vars.orderId],
      });
    },
  });
}
