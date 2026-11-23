"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";

interface ExchangeRateState {
  cnyToIdr: number;
  updatedAt: string | null;
  updatedBy: string | null;
  isSyncedFromServer: boolean;
  setExchangeRate: (
    rate: number,
    meta?: {
      updatedAt?: string;
      updatedBy?: string;
      isSyncedFromServer?: boolean;
    },
  ) => void;
}

export const useExchangeRateStore = create<ExchangeRateState>()(
  persist(
    (set) => ({
      cnyToIdr: BRANDING.exchangeRate.cnyToIdr,
      updatedAt: null,
      updatedBy: null,
      isSyncedFromServer: false,
      setExchangeRate: (rate, meta) => {
        if (!Number.isFinite(rate) || rate <= 0) return;
        set({
          cnyToIdr: Math.round(rate),
          updatedAt: meta?.updatedAt ?? new Date().toISOString(),
          updatedBy: meta?.updatedBy ?? null,
          isSyncedFromServer: meta?.isSyncedFromServer ?? false,
        });
      },
    }),
    {
      name: "flypick-exchange-rate-storage",
    },
  ),
);

/**
 * Returns the active CNY -> IDR exchange rate for non-React helpers and stores.
 */
export function getActiveCnyToIdrRate(): number {
  const rate = useExchangeRateStore.getState().cnyToIdr;
  return Number.isFinite(rate) && rate > 0
    ? rate
    : BRANDING.exchangeRate.cnyToIdr;
}
