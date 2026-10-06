import { z } from "zod";

export const phoneRegex = /^\+62[0-9]{8,13}$/;

export const AuthPhoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(16, "Nomor WhatsApp maksimal 16 digit")
    .regex(
      phoneRegex,
      "Format nomor harus diawali +62 (contoh: +6281234567890)",
    ),
  otp: z.string().length(6, "Kode OTP harus 6 digit angka").optional(),
});

export const GoogleAuthCallbackSchema = z.object({
  token: z.string().min(1, "Token autentikasi Google wajib ada"),
  email: z.string().email("Format email tidak valid"),
  name: z.string().min(1, "Nama pengguna wajib ada"),
});

export const AuthSchema = z.union([AuthPhoneSchema, GoogleAuthCallbackSchema]);

export type AuthPhoneInput = z.infer<typeof AuthPhoneSchema>;
export type GoogleAuthCallbackInput = z.infer<typeof GoogleAuthCallbackSchema>;
export type AuthInput = z.infer<typeof AuthSchema>;
