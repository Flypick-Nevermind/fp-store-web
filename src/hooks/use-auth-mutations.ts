import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  decodeJwtUserId,
  getUserProfileApi,
  loginApi,
  mapApiUserToProfile,
  registerApi,
  resendOtpApi,
  verifyOtpApi,
} from "@/lib/api/auth";
import { useAuthStore } from "@/store/use-auth-store";

import type {
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from "@/types/api";

export interface SendOtpPayload {
  phone: string;
}

export interface LegacyVerifyOtpPayload {
  phone: string;
  otp: string;
  name?: string;
}

/**
 * Mutation for logging into backend API with email & password
 */
export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { access_token } = await loginApi(payload);
      const userId = decodeJwtUserId(access_token);

      if (!userId) {
        throw new Error("Gagal membaca payload autentikasi dari token.");
      }

      // Fetch user profile from API using bearer token
      const apiUser = await getUserProfileApi(userId, access_token);
      const profile = mapApiUserToProfile(apiUser);

      // Store in auth state
      setAuth(access_token, profile);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      return {
        accessToken: access_token,
        user: profile,
      };
    },
  });
}

/**
 * Mutation for registering a new user
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      return registerApi(payload);
    },
  });
}

/**
 * Mutation for verifying user email OTP
 */
export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      return verifyOtpApi(payload);
    },
  });
}

/**
 * Mutation for requesting a new OTP verification code (Resend Code)
 */
export function useResendOtpMutation() {
  return useMutation({
    mutationFn: async (payload: { user_email: string }) => {
      return resendOtpApi(payload);
    },
  });
}

/**
 * Legacy mutation for WhatsApp OTP simulation (backward compatibility)
 */
export function useSendOtpMutation() {
  return useMutation({
    mutationFn: async ({ phone }: SendOtpPayload) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: `Kode OTP 6-digit berhasil dikirim via WhatsApp ke ${phone}. (Gunakan kode demo: 888888)`,
        mockOtp: "888888",
      };
    },
  });
}
