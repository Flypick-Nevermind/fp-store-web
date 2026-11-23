import { BRANDING } from "@/config/branding";
import { apiClient } from "@/lib/api-client";

export interface ExchangeRateSetting {
  cny_to_idr: number;
  updated_at?: string;
  updated_by?: string;
}

export interface UpdateExchangeRatePayload {
  cny_to_idr: number;
  notes?: string;
}

/**
 * Fetch the active CNY -> IDR exchange rate configured by Admin.
 * Calls GET /api/v1/settings/exchange-rate and falls back to BRANDING default
 * if the backend endpoint is not yet available.
 */
export async function getExchangeRateApi(): Promise<{
  rate: number;
  updatedAt?: string;
  updatedBy?: string;
  isSyncedFromServer: boolean;
}> {
  try {
    const res = await apiClient<ExchangeRateSetting>(
      "/api/v1/settings/exchange-rate",
      { method: "GET" },
    );

    const parsedRate = Number(res?.cny_to_idr);
    if (Number.isFinite(parsedRate) && parsedRate > 0) {
      return {
        rate: Math.round(parsedRate),
        updatedAt: res.updated_at,
        updatedBy: res.updated_by,
        isSyncedFromServer: true,
      };
    }
  } catch {
    // Endpoint not yet deployed or unreachable — fall back to configured default
  }

  return {
    rate: BRANDING.exchangeRate.cnyToIdr,
    isSyncedFromServer: false,
  };
}

/**
 * Admin: Update the global CNY -> IDR exchange rate.
 * Calls PUT /api/v1/admin/settings/exchange-rate
 */
export async function updateExchangeRateAdminApi(
  payload: UpdateExchangeRatePayload,
  token?: string,
): Promise<ExchangeRateSetting> {
  return apiClient<ExchangeRateSetting>(
    "/api/v1/admin/settings/exchange-rate",
    {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    },
  );
}
