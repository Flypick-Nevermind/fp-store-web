"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import {
  useConfirmResetPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/hooks/use-auth-mutations";
import { useToast } from "@/providers/toast-provider";
import {
  type ConfirmResetPasswordInput,
  ConfirmResetPasswordSchema,
  type LoginInput,
  LoginSchema,
  type RegisterInput,
  RegisterSchema,
  type ResetPasswordInput,
  ResetPasswordSchema,
  type VerifyOtpInput,
  VerifyOtpSchema,
} from "@/schemas/auth";
import { useAuthStore } from "@/store/use-auth-store";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode =
  | "LOGIN"
  | "REGISTER"
  | "OTP"
  | "RESET_REQUEST"
  | "RESET_CONFIRM";

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { success, error } = useToast();
  const [mode, setMode] = useState<AuthMode>("LOGIN");

  const [activeEmail, setActiveEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Reset password states
  const [resetEmail, setResetEmail] = useState("");
  const [resetCountdown, setResetCountdown] = useState(60);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] =
    useState(false);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const confirmResetPasswordMutation = useConfirmResetPasswordMutation();

  // Resend OTP countdown timer
  useEffect(() => {
    if (mode !== "OTP" || resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, resendCountdown]);

  // Reset Password OTP countdown timer
  useEffect(() => {
    if (mode !== "RESET_CONFIRM" || resetCountdown <= 0) return;
    const timer = setInterval(() => {
      setResetCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, resetCountdown]);

  // Form for Login
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_email: "",
      user_password: "",
    },
  });

  // Form for Register
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_password: "",
      user_phone: "",
    },
  });

  // Form for OTP Verification
  const otpForm = useForm<VerifyOtpInput>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: {
      user_email: "",
      otp: "",
    },
  });

  // Form for Reset Password (Step 1: Request Email)
  const resetRequestForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      user_email: "",
    },
  });

  // Form for Reset Password (Step 2: Confirm OTP & New Password)
  const resetConfirmForm = useForm<ConfirmResetPasswordInput>({
    resolver: zodResolver(ConfirmResetPasswordSchema),
    defaultValues: {
      user_email: "",
      otp: "",
      new_password: "",
      confirm_password: "",
    },
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (data: LoginInput) => {
    try {
      const res = await loginMutation.mutateAsync({
        user_email: data.user_email,
        user_password: data.user_password,
      });
      success(
        "Login Berhasil!",
        `Selamat datang kembali, ${res.user.name}. Sesi aktif 24 jam.`,
      );
      loginForm.reset();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal masuk";
      error("Autentikasi Gagal", msg);
    }
  };

  const handleRegisterSubmit = async (data: RegisterInput) => {
    try {
      await registerMutation.mutateAsync({
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: data.user_password,
        user_phone: data.user_phone,
      });

      setActiveEmail(data.user_email);
      setTempPassword(data.user_password);
      otpForm.setValue("user_email", data.user_email);
      otpForm.setValue("otp", "");
      loginForm.setValue("user_email", data.user_email);
      setResendCountdown(60);
      setMode("OTP");

      success(
        "Pendaftaran Berhasil!",
        "Silakan masukkan 6-digit kode OTP yang telah dikirimkan ke email Anda.",
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Pendaftaran gagal";
      error("Registrasi Gagal", msg);
    }
  };

  const handleVerifyOtpSubmit = async (data: VerifyOtpInput) => {
    try {
      await verifyOtpMutation.mutateAsync({
        user_email: data.user_email,
        otp: data.otp,
      });

      // Attempt auto-login with stored registration password
      if (tempPassword) {
        try {
          const res = await loginMutation.mutateAsync({
            user_email: data.user_email,
            user_password: tempPassword,
          });
          success(
            "Akun Berhasil Aktif!",
            `Selamat datang, ${res.user.name}. Sesi Anda telah aktif.`,
          );
          loginForm.reset();
          registerForm.reset();
          otpForm.reset();
          setTempPassword("");
          onClose();
          return;
        } catch {
          // Fallback to manual login if auto-login encounters an issue
        }
      }

      success(
        "Aktivasi Berhasil!",
        "Akun Anda telah aktif. Silakan masuk menggunakan password Anda.",
      );
      loginForm.setValue("user_email", data.user_email);
      setTempPassword("");
      setMode("LOGIN");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kode OTP tidak valid";
      error("Verifikasi Gagal", msg);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || resendOtpMutation.isPending) return;
    const targetEmail = activeEmail || otpForm.getValues("user_email");
    if (!targetEmail) {
      error(
        "Email Tidak Ditemukan",
        "Silakan masukkan email pendaftaran Anda terlebih dahulu.",
      );
      return;
    }

    try {
      const res = await resendOtpMutation.mutateAsync({
        user_email: targetEmail,
      });
      setResendCountdown(60);
      success(
        "Kode OTP Dikirim Ulang!",
        `Kode verifikasi baru telah dikirimkan ke email ${targetEmail}.${
          res?.user_name ? ` (Halo, ${res.user_name})` : ""
        }`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim ulang kode OTP";
      error("Pengiriman Gagal", msg);
    }
  };

  const handleSwitchAccount = () => {
    logout();
    success("Sesi Diakhiri", "Silakan masuk dengan akun lain.");
    setMode("LOGIN");
  };

  const handleResetRequestSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPasswordMutation.mutateAsync({
        user_email: data.user_email,
      });
      setResetEmail(data.user_email);
      resetConfirmForm.setValue("user_email", data.user_email);
      resetConfirmForm.setValue("otp", "");
      resetConfirmForm.setValue("new_password", "");
      resetConfirmForm.setValue("confirm_password", "");
      setResetCountdown(60);
      setMode("RESET_CONFIRM");
      success(
        "Kode Reset Dikirim!",
        `Kode verifikasi reset password telah dikirimkan ke email ${data.user_email}.`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal meminta reset password";
      error("Permintaan Gagal", msg);
    }
  };

  const handleResendResetCode = async () => {
    if (resetCountdown > 0 || resetPasswordMutation.isPending) return;
    const targetEmail = resetEmail || resetConfirmForm.getValues("user_email");
    if (!targetEmail) {
      error("Email Diperlukan", "Silakan masukkan email Anda terlebih dahulu.");
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync({
        user_email: targetEmail,
      });
      setResetCountdown(60);
      success(
        "Kode Reset Baru Dikirim!",
        `Kode verifikasi baru telah dikirimkan ke email ${targetEmail}.`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim ulang kode reset";
      error("Pengiriman Gagal", msg);
    }
  };

  const handleResetConfirmSubmit = async (data: ConfirmResetPasswordInput) => {
    try {
      await confirmResetPasswordMutation.mutateAsync({
        user_email: data.user_email,
        otp: data.otp,
        new_password: data.new_password,
      });
      success(
        "Kata Sandi Berhasil Direset!",
        "Kata sandi baru Anda telah tersimpan. Silakan masuk dengan kata sandi baru.",
      );
      loginForm.setValue("user_email", data.user_email);
      loginForm.setValue("user_password", "");
      setResetEmail("");
      resetRequestForm.reset();
      resetConfirmForm.reset();
      setMode("LOGIN");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Kode reset tidak valid atau telah kedaluwarsa";
      error("Reset Password Gagal", msg);
    }
  };

  // If already logged in, show active user panel instead of empty login form
  if (isAuthenticated && user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A24]/70 backdrop-blur-xs animate-in fade-in">
        <div className="relative w-full max-w-md bg-white border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] overflow-hidden">
          {/* Header */}
          <div className="bg-[#2323FF] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#1A1A24]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00F0FF]" />
              <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-white">
                STATUS OTORISASI AKUN
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-[#00F0FF] p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-600 text-emerald-800 font-mono text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                SESI LOGIN ANDA SEDANG AKTIF
              </div>
              <h2 className="font-mono text-xl font-black text-[#1A1A24] uppercase pt-1">
                {user.name}
              </h2>
              <p className="font-mono text-xs text-[#64748B]">
                {user.email || user.phone}
              </p>
            </div>

            {/* Warehouse ID Ticket Box */}
            <div className="p-4 bg-[#FFF8E1] border-2 border-[#1A1A24] space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[#64748B]">ID GUDANG SHANGHAI:</span>
                <span className="px-2 py-0.5 bg-[#00F0FF] text-[#1A1A24] font-black border border-[#1A1A24]">
                  {user.warehouseCode}
                </span>
              </div>
              <p className="text-[11px] text-[#1A1A24]/75 font-sans leading-relaxed">
                Akun Anda sudah terhubung ke sistem logistik FLYPICK. Anda dapat
                melihat alamat gudang lengkap dan melacak pergerakan resi Anda.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                href="/profile"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2323FF] text-white font-mono text-xs font-black uppercase border-2 border-[#1A1A24] shadow-[4px_4px_0px_0px_#1A1A24] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
              >
                <Warehouse className="w-4 h-4 text-[#00F0FF]" />
                BUKA KARTU GUDANG &amp; TRACKING
              </Link>

              <button
                type="button"
                onClick={handleSwitchAccount}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 font-mono text-xs font-bold border-2 border-red-200 hover:border-red-600 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                KELUAR / GANTI AKUN
              </button>
            </div>

            <div className="pt-1 flex justify-center">
              <Barcode value="FP-AUTH-ACTIVE" height={16} showText={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A24]/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Ticket Header */}
        <div className="bg-[#2323FF] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#1A1A24] shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-white">
              OTORISASI PORTAL &amp; AKUN FLYPICK
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-[#00F0FF] p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Top Mode Tabs: Only 2 tabs (Masuk & Daftar Baru). OTP and Reset are direct modal flows */}
          {mode !== "OTP" &&
            mode !== "RESET_REQUEST" &&
            mode !== "RESET_CONFIRM" && (
              <div className="flex border-2 border-[#1A1A24] bg-[#F1F5F9] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setMode("LOGIN")}
                  className={`flex-1 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                    mode === "LOGIN"
                      ? "bg-[#2323FF] text-white shadow-xs"
                      : "text-[#1A1A24] hover:bg-white"
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setMode("REGISTER")}
                  className={`flex-1 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                    mode === "REGISTER"
                      ? "bg-[#2323FF] text-white shadow-xs"
                      : "text-[#1A1A24] hover:bg-white"
                  }`}
                >
                  Daftar Baru
                </button>
              </div>
            )}

          <div className="text-center space-y-1">
            <Badge
              variant={
                mode === "RESET_REQUEST" || mode === "RESET_CONFIRM"
                  ? "orange"
                  : mode === "OTP"
                    ? "neon"
                    : "electric"
              }
            >
              {mode === "LOGIN"
                ? "AKSES MEMBER RESMI"
                : mode === "REGISTER"
                  ? "PENDAFTARAN BARU"
                  : mode === "OTP"
                    ? "LANGKAH 2: VERIFIKASI EMAIL"
                    : mode === "RESET_REQUEST"
                      ? "PEMULIHAN KATA SANDI (LANGKAH 1)"
                      : "KATA SANDI BARU (LANGKAH 2)"}
            </Badge>
            <h2 className="font-mono text-lg font-black text-[#1A1A24] uppercase pt-1">
              {mode === "LOGIN"
                ? "Buka Akses Terminal Gudang"
                : mode === "REGISTER"
                  ? "Buat ID Pengguna Virtual"
                  : mode === "OTP"
                    ? "Masukkan Kode OTP"
                    : mode === "RESET_REQUEST"
                      ? "Reset Kata Sandi"
                      : "Buat Kata Sandi Baru"}
            </h2>
            <p className="text-xs text-[#1A1A24]/70">
              {mode === "LOGIN"
                ? "Masuk dengan email & password terdaftar untuk melihat kartu gudang & resi."
                : mode === "REGISTER"
                  ? "Dapatkan alamat gudang Shanghai & kode pelacakan kargo Anda."
                  : mode === "OTP"
                    ? "Satu langkah lagi untuk menyelesaikan pendaftaran dan mengaktifkan akun Anda."
                    : mode === "RESET_REQUEST"
                      ? "Masukkan email akun Anda. Kami akan mengirimkan kode verifikasi reset password."
                      : "Masukkan kode OTP dari email dan tentukan kata sandi baru Anda."}
            </p>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE: LOGIN                                               */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === "LOGIN" && (
            <form
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="loginEmailInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  Email Terdaftar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Mail className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="loginEmailInput"
                    type="email"
                    placeholder="nama@email.com"
                    {...loginForm.register("user_email")}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {loginForm.formState.errors.user_email && (
                  <p className="font-mono text-[11px] text-red-600">
                    {loginForm.formState.errors.user_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="loginPasswordInput"
                    className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const email = loginForm.getValues("user_email");
                      if (email) resetRequestForm.setValue("user_email", email);
                      setMode("RESET_REQUEST");
                    }}
                    className="font-mono text-[11px] text-[#2323FF] hover:underline cursor-pointer font-bold"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Lock className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="loginPasswordInput"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...loginForm.register("user_password")}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm focus:outline-none focus:border-[#2323FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#1A1A24]/50 hover:text-[#2323FF] transition-colors cursor-pointer"
                    aria-label={
                      showLoginPassword
                        ? "Sembunyikan password"
                        : "Lihat password"
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.user_password && (
                  <p className="font-mono text-[11px] text-red-600">
                    {loginForm.formState.errors.user_password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="neon"
                size="lg"
                disabled={loginMutation.isPending}
                className="w-full"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    MEMPROSES LOGIN...
                  </>
                ) : (
                  <>
                    <span>MASUK SEKARANG</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-[#00F0FF]" />
                  </>
                )}
              </Button>

              <div className="text-center text-[11px] font-mono pt-1 text-[#1A1A24]/80">
                <button
                  type="button"
                  onClick={() => setMode("REGISTER")}
                  className="hover:text-[#2323FF] underline cursor-pointer"
                >
                  Belum punya akun? Daftar akun baru di sini
                </button>
              </div>
            </form>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE: REGISTER                                            */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === "REGISTER" && (
            <form
              onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label
                  htmlFor="registerNameInput"
                  className="block font-mono text-[11px] font-bold uppercase text-[#1A1A24]"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <User className="w-3.5 h-3.5 text-[#2323FF]" />
                  </div>
                  <input
                    id="registerNameInput"
                    type="text"
                    placeholder="Nama sesuai KTP"
                    {...registerForm.register("user_name")}
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {registerForm.formState.errors.user_name && (
                  <p className="font-mono text-[10px] text-red-600">
                    {registerForm.formState.errors.user_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="registerEmailInput"
                  className="block font-mono text-[11px] font-bold uppercase text-[#1A1A24]"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Mail className="w-3.5 h-3.5 text-[#2323FF]" />
                  </div>
                  <input
                    id="registerEmailInput"
                    type="email"
                    placeholder="nama@email.com"
                    {...registerForm.register("user_email")}
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {registerForm.formState.errors.user_email && (
                  <p className="font-mono text-[10px] text-red-600">
                    {registerForm.formState.errors.user_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="registerPhoneInput"
                  className="block font-mono text-[11px] font-bold uppercase text-[#1A1A24]"
                >
                  Nomor Telepon / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Phone className="w-3.5 h-3.5 text-[#2323FF]" />
                  </div>
                  <input
                    id="registerPhoneInput"
                    type="text"
                    placeholder="081234567890"
                    {...registerForm.register("user_phone")}
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {registerForm.formState.errors.user_phone && (
                  <p className="font-mono text-[10px] text-red-600">
                    {registerForm.formState.errors.user_phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="registerPasswordInput"
                  className="block font-mono text-[11px] font-bold uppercase text-[#1A1A24]"
                >
                  Password (min. 6 karakter)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Lock className="w-3.5 h-3.5 text-[#2323FF]" />
                  </div>
                  <input
                    id="registerPasswordInput"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerForm.register("user_password")}
                    className="w-full pl-9 pr-10 py-2 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#1A1A24]/50 hover:text-[#2323FF] transition-colors cursor-pointer"
                    aria-label={
                      showRegisterPassword
                        ? "Sembunyikan password"
                        : "Lihat password"
                    }
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {registerForm.formState.errors.user_password && (
                  <p className="font-mono text-[10px] text-red-600">
                    {registerForm.formState.errors.user_password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="neon"
                size="lg"
                disabled={registerMutation.isPending}
                className="w-full mt-2"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    MENDAFTARKAN AKUN...
                  </>
                ) : (
                  <>
                    <span>DAFTAR SEKARANG</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-[#00F0FF]" />
                  </>
                )}
              </Button>

              <div className="text-center text-[11px] font-mono pt-1 text-[#1A1A24]/80">
                <button
                  type="button"
                  onClick={() => setMode("LOGIN")}
                  className="hover:text-[#2323FF] underline cursor-pointer"
                >
                  Sudah punya akun? Masuk di sini
                </button>
              </div>
            </form>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE: OTP VERIFICATION (DIRECT MODAL STEP SETELAH REGISTER)*/}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === "OTP" && (
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOtpSubmit)}
              className="space-y-4 animate-in fade-in"
            >
              {/* Destination Email Info Card */}
              <div className="p-3.5 bg-[#FFF8E1] border-2 border-[#1A1A24] space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">KODE DIKIRIM KE:</span>
                  <span className="font-bold text-[#1035D0] truncate max-w-[200px]">
                    {activeEmail || otpForm.getValues("user_email")}
                  </span>
                </div>
                <p className="text-[11px] text-[#1A1A24]/75 font-sans leading-relaxed">
                  Masukkan 6-digit kode OTP dari email untuk memverifikasi dan
                  mengaktifkan akun Anda.
                </p>
              </div>

              {/* Hidden Email Form Field */}
              <input type="hidden" {...otpForm.register("user_email")} />

              <div className="space-y-2">
                <label
                  htmlFor="otpCodeInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  6-Digit Kode Verifikasi (OTP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <KeyRound className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="otpCodeInput"
                    type="text"
                    maxLength={8}
                    placeholder="123456"
                    {...otpForm.register("otp")}
                    className="w-full pl-9 pr-3 py-3 text-center tracking-[0.35em] bg-white border-2 border-[#1A1A24] font-mono text-xl font-black focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {otpForm.formState.errors.otp && (
                  <p className="font-mono text-[11px] text-red-600">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              {/* Resend Code Section */}
              <div className="flex items-center justify-between text-xs font-mono px-0.5">
                <span className="text-[#64748B]">Tidak menerima kode?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || resendOtpMutation.isPending}
                  className={`font-bold transition-colors cursor-pointer ${
                    resendCountdown > 0 || resendOtpMutation.isPending
                      ? "text-[#94A3B8] cursor-not-allowed"
                      : "text-[#2323FF] hover:underline"
                  }`}
                >
                  {resendOtpMutation.isPending
                    ? "Mengirim ulang..."
                    : resendCountdown > 0
                      ? `Kirim ulang (${resendCountdown}s)`
                      : "Kirim Ulang Kode (Resend)"}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="paper"
                  size="lg"
                  onClick={() => setMode("REGISTER")}
                >
                  KEMBALI
                </Button>
                <Button
                  type="submit"
                  variant="neon"
                  size="lg"
                  disabled={
                    verifyOtpMutation.isPending || loginMutation.isPending
                  }
                  className="flex-1"
                >
                  {verifyOtpMutation.isPending || loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      MEMPROSES...
                    </>
                  ) : (
                    "VERIFIKASI & MASUK"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE: RESET PASSWORD STEP 1 (REQUEST EMAIL)                */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === "RESET_REQUEST" && (
            <form
              onSubmit={resetRequestForm.handleSubmit(handleResetRequestSubmit)}
              className="space-y-4 animate-in fade-in"
            >
              <div className="space-y-2">
                <label
                  htmlFor="resetEmailInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  Email Akun Terdaftar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Mail className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="resetEmailInput"
                    type="email"
                    placeholder="nama@email.com"
                    {...resetRequestForm.register("user_email")}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {resetRequestForm.formState.errors.user_email && (
                  <p className="font-mono text-[11px] text-red-600">
                    {resetRequestForm.formState.errors.user_email.message}
                  </p>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  variant="neon"
                  size="lg"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full"
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      MENGIRIM KODE...
                    </>
                  ) : (
                    <>
                      <span>KIRIM KODE RESET PASSWORD</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="paper"
                  size="md"
                  onClick={() => setMode("LOGIN")}
                  className="w-full"
                >
                  BATAL &amp; KEMBALI KE FORM MASUK
                </Button>
              </div>
            </form>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE: RESET PASSWORD STEP 2 (CONFIRM OTP & NEW PASSWORD)   */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === "RESET_CONFIRM" && (
            <form
              onSubmit={resetConfirmForm.handleSubmit(handleResetConfirmSubmit)}
              className="space-y-4 animate-in fade-in"
            >
              {/* Destination Email Info Card */}
              <div className="p-3 bg-[#EFF6FF] border border-blue-200 text-xs text-[#1E3A8A] flex items-center justify-between">
                <span>
                  Kode dikirim ke: <strong>{resetEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setMode("RESET_REQUEST")}
                  className="text-[#1035D0] underline font-bold text-[11px] cursor-pointer"
                >
                  Ubah Email
                </button>
              </div>

              {/* Hidden Email Form Field */}
              <input
                type="hidden"
                {...resetConfirmForm.register("user_email")}
              />

              {/* Input OTP Code */}
              <div className="space-y-2">
                <label
                  htmlFor="resetOtpInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  Kode Reset OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <KeyRound className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="resetOtpInput"
                    type="text"
                    maxLength={10}
                    placeholder="Contoh: 123456"
                    {...resetConfirmForm.register("otp")}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {resetConfirmForm.formState.errors.otp && (
                  <p className="font-mono text-[11px] text-red-600">
                    {resetConfirmForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              {/* Input New Password */}
              <div className="space-y-2">
                <label
                  htmlFor="resetNewPasswordInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  Kata Sandi Baru (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Lock className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="resetNewPasswordInput"
                    type={showResetNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...resetConfirmForm.register("new_password")}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm focus:outline-none focus:border-[#2323FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#1A1A24]/60 hover:text-[#1A1A24] cursor-pointer"
                    aria-label={
                      showResetNewPassword
                        ? "Sembunyikan kata sandi baru"
                        : "Lihat kata sandi baru"
                    }
                  >
                    {showResetNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {resetConfirmForm.formState.errors.new_password && (
                  <p className="font-mono text-[11px] text-red-600">
                    {resetConfirmForm.formState.errors.new_password.message}
                  </p>
                )}
              </div>

              {/* Input Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="resetConfirmPasswordInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Lock className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="resetConfirmPasswordInput"
                    type={showResetConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...resetConfirmForm.register("confirm_password")}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm focus:outline-none focus:border-[#2323FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#1A1A24]/60 hover:text-[#1A1A24] cursor-pointer"
                    aria-label={
                      showResetConfirmPassword
                        ? "Sembunyikan konfirmasi kata sandi"
                        : "Lihat konfirmasi kata sandi"
                    }
                  >
                    {showResetConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {resetConfirmForm.formState.errors.confirm_password && (
                  <p className="font-mono text-[11px] text-red-600">
                    {resetConfirmForm.formState.errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Resend Code Button & Countdown */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#1A1A24]/60">Tidak menerima email?</span>
                {resetCountdown > 0 ? (
                  <span className="font-mono text-[11px] text-[#1A1A24]/60 font-bold">
                    Kirim ulang ({resetCountdown}s)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendResetCode}
                    disabled={resetPasswordMutation.isPending}
                    className="font-mono text-xs text-[#2323FF] font-bold hover:underline cursor-pointer"
                  >
                    Kirim Ulang Kode
                  </button>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  variant="neon"
                  size="lg"
                  disabled={confirmResetPasswordMutation.isPending}
                  className="w-full"
                >
                  {confirmResetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      MENYIMPAN PASSWORD...
                    </>
                  ) : (
                    "SIMPAN KATA SANDI BARU & MASUK"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="paper"
                  size="md"
                  onClick={() => setMode("LOGIN")}
                  className="w-full"
                >
                  BATAL &amp; KEMBALI KE FORM MASUK
                </Button>
              </div>
            </form>
          )}

          <div className="pt-2 flex justify-center">
            <Barcode value="FP-AUTH-SYSTEM" height={18} showText={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
