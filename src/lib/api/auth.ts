import { BRANDING } from "@/config/branding";
import { apiClient } from "@/lib/api-client";
import type { ChinaWarehouseAddress, UserProfile } from "@/types";
import type {
  ApiUserData,
  LoginPayload,
  LoginResponseData,
  RegisterPayload,
  RegisterResponseData,
  ResendOtpPayload,
  ResendOtpResponseData,
  VerifyOtpPayload,
  VerifyOtpResponseData,
} from "@/types/api";

export function decodeJwtUserId(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.user_id || null;
  } catch {
    return null;
  }
}

export function buildDefaultWarehouseAddress(
  code: string,
  name: string,
): ChinaWarehouseAddress {
  return {
    recipientName: `${name} [${code}]`,
    phone: BRANDING.warehouse.shanghai.phone,
    province: BRANDING.warehouse.shanghai.province,
    city: BRANDING.warehouse.shanghai.city,
    district: BRANDING.warehouse.shanghai.district,
    streetAddress: `${BRANDING.warehouse.shanghai.streetAddress} (User ID: ${code})`,
    postalCode: BRANDING.warehouse.shanghai.postalCode,
    hubCode: BRANDING.warehouse.shanghai.hubCode,
  };
}

export function mapApiUserToProfile(apiUser: ApiUserData): UserProfile {
  // Generate deterministic warehouse code based on UUID (e.g. FP-4A6D)
  const hexPart = apiUser.user_id.replace(/-/g, "").slice(0, 4).toUpperCase();
  const warehouseCode = `FP-${hexPart || "8821"}`;

  return {
    id: apiUser.user_id,
    name: apiUser.user_name,
    phone: apiUser.user_phone,
    email: apiUser.user_email,
    warehouseCode,
    addressChina: buildDefaultWarehouseAddress(
      warehouseCode,
      apiUser.user_name,
    ),
    createdAt: apiUser.created_at,
  };
}

export async function loginApi(
  payload: LoginPayload,
): Promise<LoginResponseData> {
  return apiClient<LoginResponseData>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterResponseData> {
  return apiClient<RegisterResponseData>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyOtpApi(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponseData> {
  return apiClient<VerifyOtpResponseData>("/api/v1/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUserProfileApi(
  userId: string,
  token?: string,
): Promise<ApiUserData> {
  return apiClient<ApiUserData>(`/api/v1/users/${userId}`, {
    method: "GET",
    token,
  });
}

export async function resendOtpApi(
  payload: ResendOtpPayload,
): Promise<ResendOtpResponseData> {
  return apiClient<ResendOtpResponseData>("/api/v1/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
