"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Phone, Shield, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/hooks/use-auth-mutations";
import { useToast } from "@/providers/toast-provider";
import { type AuthPhoneInput, AuthPhoneSchema } from "@/schemas/auth";
import { useAuthStore } from "@/store/use-auth-store";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { success, error } = useToast();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [targetPhone, setTargetPhone] = useState("");

  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuthPhoneInput>({
    resolver: zodResolver(AuthPhoneSchema),
    defaultValues: {
      phone: "+6281299887766",
      otp: "",
    },
  });

  if (!isOpen) return null;

  const onSendOtp = async (data: AuthPhoneInput) => {
    try {
      setTargetPhone(data.phone);
      const res = await sendOtpMutation.mutateAsync({ phone: data.phone });
      setStep("OTP");
      setValue("otp", res.mockOtp); // Auto-fill for convenience
      success("OTP Terkirim!", res.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim OTP";
      error("Kesalahan", msg);
    }
  };

  const onVerifyOtp = async (data: AuthPhoneInput) => {
    if (!data.otp) {
      error("Masukkan 6-digit kode OTP");
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        phone: targetPhone,
        otp: data.otp,
        name: "Sobat FLYPICK",
      });
      success("Login Berhasil!", "Selamat datang di FLYPICK Virtual Hub.");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OTP tidak sesuai";
      error("Verifikasi Gagal", msg);
    }
  };

  const handleGoogleMock = () => {
    loginWithGoogle("fikri.user@gmail.com", "Ahmad Fikri");
    success("Login Google Berhasil!", "Akun Google terhubung.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A24]/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-[#2323FF] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#1A1A24]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-white">
              OTORISASI LUGGAGE PASS & LOGIN
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-[#00F0FF] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <Badge variant="electric">VERIFIKASI INSTAN WHATSAPP</Badge>
            <h2 className="font-mono text-lg font-black text-[#1A1A24] uppercase pt-1">
              Buka Akses Gudang Shanghai
            </h2>
            <p className="text-xs text-[#1A1A24]/70">
              Dapatkan ID Unik Gudang Tiongkok & lacak status penerbangan paket
              Anda.
            </p>
          </div>

          {step === "PHONE" ? (
            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="authPhoneInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  Nomor WhatsApp (+62)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
                    <Phone className="w-4 h-4 text-[#2323FF]" />
                  </div>
                  <input
                    id="authPhoneInput"
                    type="text"
                    placeholder="+6281234567890"
                    {...register("phone")}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm font-bold focus:outline-none focus:border-[#2323FF]"
                  />
                </div>
                {errors.phone && (
                  <p className="font-mono text-[11px] text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="neon"
                size="lg"
                disabled={sendOtpMutation.isPending}
                className="w-full"
              >
                {sendOtpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    MENGIRIM KODE OTP...
                  </>
                ) : (
                  <>
                    <span>KIRIM KODE OTP VIA WHATSAPP</span>
                    <ArrowRight className="w-4 h-4 ml-2 text-[#00F0FF]" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
              <div className="p-3 bg-[#FFF8E1] border-2 border-[#1A1A24] text-xs font-mono space-y-1">
                <p className="text-[#1A1A24]/70">
                  Kode OTP dikirim ke: <strong>{targetPhone}</strong>
                </p>
                <p className="text-[#2323FF] font-bold">
                  *Gunakan kode demo cepat: <strong>888888</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="authOtpInput"
                  className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
                >
                  6-Digit Kode Verifikasi
                </label>
                <input
                  id="authOtpInput"
                  type="text"
                  maxLength={6}
                  placeholder="888888"
                  {...register("otp")}
                  className="w-full px-3 py-3 text-center tracking-[0.5em] bg-white border-2 border-[#1A1A24] font-mono text-xl font-black focus:outline-none focus:border-[#2323FF]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="paper"
                  size="lg"
                  onClick={() => setStep("PHONE")}
                >
                  UBAH NOMOR
                </Button>
                <Button
                  type="submit"
                  variant="neon"
                  size="lg"
                  disabled={verifyOtpMutation.isPending}
                  className="flex-1"
                >
                  {verifyOtpMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      MEMVERIFIKASI...
                    </>
                  ) : (
                    "VERIFIKASI & MASUK"
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative border-t-2 border-dashed border-[#1A1A24]/20 my-4">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 font-mono text-[10px] text-[#1A1A24]/60 uppercase">
              ATAU
            </span>
          </div>

          {/* Google Single Sign-on Alternative */}
          <Button
            type="button"
            variant="paper"
            size="md"
            onClick={handleGoogleMock}
            className="w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#2323FF]" />
            MASUK DENGAN GOOGLE OAUTH
          </Button>

          <div className="pt-2 flex justify-center">
            <Barcode value="FP-AUTH-SYSTEM" height={20} showText={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
