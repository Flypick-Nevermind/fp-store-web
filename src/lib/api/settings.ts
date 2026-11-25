import { BRANDING } from "@/config/branding";
import { apiClient } from "@/lib/api-client";

export interface ExchangeRateSetting {
  id?: number;
  cny_to_idr: number;
  notes?: string | null;
  updated_at?: string;
  updated_by?: string;
}

export interface RateActiveResponse {
  active: boolean;
  checked_rate: number;
  active_rate: number;
  rate_updated_at: string;
  history_id: number;
}

export interface UpdateExchangeRatePayload {
  cny_to_idr: number;
  notes?: string;
}

/**
 * Fetch the active CNY -> IDR exchange rate configured by Admin.
 * Calls GET /api-admin/v1/settings/exchange-rate first, then falls back to
 * GET /api/v1/settings/exchange-rate/active?history_id=1, and finally BRANDING default.
 */
export async function getExchangeRateApi(): Promise<{
  historyId?: number;
  rate: number;
  updatedAt?: string;
  updatedBy?: string;
  isSyncedFromServer: boolean;
}> {
  try {
    const res = await apiClient<ExchangeRateSetting>(
      "/api-admin/v1/settings/exchange-rate",
      { method: "GET" },
    );

    const parsedRate = Number(res?.cny_to_idr);
    if (Number.isFinite(parsedRate) && parsedRate > 0) {
      return {
        historyId: typeof res?.id === "number" ? res.id : undefined,
        rate: Math.round(parsedRate),
        updatedAt: res.updated_at,
        updatedBy: res.updated_by,
        isSyncedFromServer: true,
      };
    }
  } catch {
    // Primary endpoint unavailable; try /active fallback below
  }

  try {
    const activeRes = await checkExchangeRateActiveApi(1);
    const activeRate = Number(activeRes?.active_rate);
    if (Number.isFinite(activeRate) && activeRate > 0) {
      return {
        historyId: activeRes.active ? activeRes.history_id : undefined,
        rate: Math.round(activeRate),
        updatedAt: activeRes.rate_updated_at,
        isSyncedFromServer: true,
      };
    }
  } catch {
    // Fallback endpoint also unreachable — fall back to configured default
  }

  return {
    rate: BRANDING.exchangeRate.cnyToIdr,
    isSyncedFromServer: false,
  };
}

/**
 * Check whether the exchange rate recorded under `historyId` is still active.
 * Calls GET /api/v1/settings/exchange-rate/active?history_id=<id>
 */
export async function checkExchangeRateActiveApi(
  historyId: number,
): Promise<RateActiveResponse> {
  return apiClient<RateActiveResponse>(
    `/api/v1/settings/exchange-rate/active?history_id=${encodeURIComponent(historyId)}`,
    { method: "GET" },
  );
}

/**
 * Admin: Update the global CNY -> IDR exchange rate.
 * Calls PUT /api-admin/v1/settings/exchange-rate
 */
export async function updateExchangeRateAdminApi(
  payload: UpdateExchangeRatePayload,
  token?: string,
): Promise<ExchangeRateSetting> {
  return apiClient<ExchangeRateSetting>(
    "/api-admin/v1/settings/exchange-rate",
    {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    },
  );
}
