"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getExchangeRateApi,
  type UpdateExchangeRatePayload,
  updateExchangeRateAdminApi,
} from "@/lib/api/settings";
import { useAuthStore } from "@/store/use-auth-store";
import { useExchangeRateStore } from "@/store/use-exchange-rate-store";

/**
 * Fetches the dynamic CNY -> IDR exchange rate from backend and keeps the
 * Zustand store in sync for both React components and non-React mappers.
 */
export function useExchangeRateQuery() {
  const historyId = useExchangeRateStore((s) => s.historyId);
  const cnyToIdr = useExchangeRateStore((s) => s.cnyToIdr);
  const updatedAt = useExchangeRateStore((s) => s.updatedAt);
  const isSyncedFromServer = useExchangeRateStore((s) => s.isSyncedFromServer);
  const setExchangeRate = useExchangeRateStore((s) => s.setExchangeRate);

  const query = useQuery({
    queryKey: ["exchange-rate"],
    queryFn: getExchangeRateApi,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data?.isSyncedFromServer) {
      setExchangeRate(query.data.rate, {
        historyId: query.data.historyId ?? null,
        updatedAt: query.data.updatedAt,
        updatedBy: query.data.updatedBy,
        isSyncedFromServer: true,
      });
    }
  }, [query.data, setExchangeRate]);

  return {
    historyId: query.data?.isSyncedFromServer
      ? (query.data.historyId ?? historyId)
      : historyId,
    cnyToIdr: query.data?.isSyncedFromServer ? query.data.rate : cnyToIdr,
    updatedAt: query.data?.updatedAt ?? updatedAt,
    isSyncedFromServer: query.data?.isSyncedFromServer ?? isSyncedFromServer,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Admin mutation to update the global CNY -> IDR exchange rate.
 */
export function useUpdateExchangeRateMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const setExchangeRate = useExchangeRateStore((s) => s.setExchangeRate);

  return useMutation({
    mutationFn: (payload: UpdateExchangeRatePayload) =>
      updateExchangeRateAdminApi(payload, token || undefined),
    onSuccess: (data, vars) => {
      const nextRate = Number(data?.cny_to_idr) || vars.cny_to_idr;
      setExchangeRate(nextRate, {
        updatedAt: data?.updated_at,
        updatedBy: data?.updated_by,
        isSyncedFromServer: true,
      });
      queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
    },
  });
}
