import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/use-auth-store";

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  name?: string;
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: async ({ phone }: SendOtpPayload) => {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: `Kode OTP 6-digit berhasil dikirim via WhatsApp ke ${phone}. (Gunakan kode demo: 888888)`,
        mockOtp: "888888",
      };
    },
  });
}

export function useVerifyOtpMutation() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async ({ phone, otp, name }: VerifyOtpPayload) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (otp !== "888888" && otp.length !== 6) {
        throw new Error(
          "Kode OTP tidak valid atau telah kedaluwarsa. Gunakan 888888",
        );
      }
      login(phone, name || "Sobat FLYPICK");
      return {
        success: true,
        userPhone: phone,
      };
    },
  });
}
