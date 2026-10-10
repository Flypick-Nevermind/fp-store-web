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

// Backend API schemas
export const LoginSchema = z.object({
  user_email: z.string().email("Format email tidak valid"),
  user_password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  user_name: z.string().min(2, "Nama minimal 2 karakter"),
  user_email: z.string().email("Format email tidak valid"),
  user_password: z.string().min(6, "Password minimal 6 karakter"),
  user_phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const VerifyOtpSchema = z.object({
  user_email: z.string().email("Format email tidak valid"),
  otp: z
    .string()
    .min(4, "Kode OTP minimal 4 digit")
    .max(8, "Kode OTP maksimal 8 digit"),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const ResetPasswordSchema = z.object({
  user_email: z.string().email("Format email tidak valid"),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const ConfirmResetPasswordSchema = z
  .object({
    user_email: z.string().email("Format email tidak valid"),
    otp: z
      .string()
      .min(3, "Kode reset minimal 3 karakter")
      .max(10, "Kode reset maksimal 10 karakter"),
    new_password: z
      .string()
      .min(6, "Password baru minimal 6 karakter")
      .max(50, "Password baru maksimal 50 karakter"),
    confirm_password: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
  });

export type ConfirmResetPasswordInput = z.infer<
  typeof ConfirmResetPasswordSchema
>;

export const ResetOtpSchema = z.object({
  otp: z
    .string()
    .min(3, "Kode OTP minimal 3 karakter")
    .max(10, "Kode OTP maksimal 10 karakter"),
});

export type ResetOtpInput = z.infer<typeof ResetOtpSchema>;

export const NewPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, "Password baru minimal 6 karakter")
      .max(50, "Password baru maksimal 50 karakter"),
    confirm_password: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
  });

export type NewPasswordInput = z.infer<typeof NewPasswordSchema>;
