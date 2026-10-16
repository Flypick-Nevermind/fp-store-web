"use client";

import confetti from "canvas-confetti";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Loader2,
  Plane,
  QrCode,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/atoms";
import { useCheckoutMutation } from "@/hooks/use-order-api";
import { formatApiErrorMessage } from "@/lib/api-client";
import { formatIdr } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useCheckoutStore } from "@/store/use-checkout-store";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage1TotalIdr: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  stage1TotalIdr,
}: PaymentModalProps) {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useCheckoutStore((s) => s.createOrder);
  const deliveryAddress = useCheckoutStore((s) => s.deliveryAddress);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);

  const checkoutMutation = useCheckoutMutation();

  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "VA">("QRIS");
  const [isPaid, setIsPaid] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string>("");
  const [paymentInstructions, setPaymentInstructions] = useState<string>("");
  const [copiedVa, setCopiedVa] = useState(false);

  if (!isOpen) return null;

  const vaNumber = "8801 9821 7712 9001";

  const handleCopyVa = () => {
    navigator.clipboard?.writeText(vaNumber.replace(/\s+/g, ""));
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleExecutePayment = async () => {
    if (!isAuthenticated || !user) {
      info(
        "Harap Masuk Akun",
        "Silakan masuk ke akun Anda terlebih dahulu agar pesanan tercatat di manifes.",
      );
      openLoginModal();
      return;
    }

    if (items.length === 0) {
      toastError(
        "Keranjang Kosong",
        "Tidak ada produk dalam keranjang untuk dicheckout.",
      );
      return;
    }

    // Check if any items don't have valid price yet
    const unpricedItems = items.filter(
      (it) => it.serviceType === "BUY_FOR_ME" && (it.priceIdr || 0) <= 0,
    );
    if (unpricedItems.length > 0) {
      toastError(
        "Item Belum Divalidasi",
        "Beberapa item di keranjang belum memiliki harga valid dari admin. Harap tunggu verifikasi selesai.",
      );
      return;
    }

    try {
      const backendPaymentMethod =
        paymentMethod === "VA" ? "BANK_TRANSFER" : "QRIS";

      const response = await checkoutMutation.mutateAsync({
        items,
        deliveryAddress,
        paymentMethod: backendPaymentMethod,
        userId: user.id,
      });

      const orderNumber =
        response.order?.order_number ||
        response.order?.order_id ||
        `FP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      setCreatedOrderCode(orderNumber);
      if (response.payment_instructions) {
        setPaymentInstructions(response.payment_instructions);
      }

      // Record in local store for instant local cache
      createOrder(items, stage1TotalIdr);

      // Clear the cart
      clearCart();

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#1035D0", "#00F0FF", "#3B82F6"],
        });
      } catch (_e) {
        // fallback
      }

      setIsPaid(true);

      success(
        "Pesanan Berhasil Dibuat!",
        `Nomor Pesanan ${orderNumber} telah diterbitkan dan tersimpan di database Flypick.`,
      );
    } catch (err: unknown) {
      const errorMsg = formatApiErrorMessage(err);
      toastError("Checkout Gagal", errorMsg);
    }
  };

  const handleGoToTracking = () => {
    onClose();
    router.push("/profile");
  };

  const isPending = checkoutMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#DCE4EC] shadow-[0_24px_60px_-12px_rgba(16,53,208,0.25)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1035D0] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00F0FF]">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm tracking-tight text-white uppercase">
                Menu Pembayaran Tagihan
              </h3>
              <p className="text-[11px] text-[#93C5FD]">
                Gate Keberangkatan &amp; Pembayaran Resmi Flypick
              </p>
            </div>
          </div>
          {!isPaid && !isPending && (
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {!isPaid ? (
            <>
              {/* Invoice Pill */}
              <div className="p-4 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] text-[#1E40AF] font-bold uppercase block">
                    TOTAL YANG HARUS DIBAYAR:
                  </span>
                  <p className="font-mono text-2xl font-black text-[#1035D0] mt-0.5">
                    {formatIdr(stage1TotalIdr)}
                  </p>
                </div>
                <Badge variant="electric" className="text-[11px] font-mono">
                  VERIFIKASI OTOMATIS
                </Badge>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("QRIS")}
                  disabled={isPending}
                  className={`p-3 rounded-xl font-sans text-xs font-bold border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === "QRIS"
                      ? "bg-[#1035D0] text-white border-[#1035D0] shadow-sm"
                      : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#00F0FF]" />
                  QRIS (GoPay/BCA/Dana)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("VA")}
                  disabled={isPending}
                  className={`p-3 rounded-xl font-sans text-xs font-bold border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === "VA"
                      ? "bg-[#1035D0] text-white border-[#1035D0] shadow-sm"
                      : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#00F0FF]" />
                  Virtual Account
                </button>
              </div>

              {/* QRIS / VA Display Box */}
              {paymentMethod === "QRIS" ? (
                <div className="p-5 bg-white rounded-2xl border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-md">
                    {/* Stylized QR Code Illustration */}
                    <div className="w-44 h-44 bg-[#0F172A] rounded-lg p-2.5 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 border-4 border-white bg-transparent rounded-xs" />
                        <div className="w-10 h-10 border-4 border-white bg-transparent rounded-xs" />
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="bg-[#1035D0] text-[#00F0FF] font-sans font-black text-[10px] px-2 py-0.5 rounded border border-white/50 tracking-wider">
                          FLYPICK QRIS
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 border-4 border-white bg-transparent rounded-xs" />
                        <div className="w-7 h-7 bg-[#00F0FF] rounded-xs" />
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-[#64748B]">
                    Scan via BCA Mobile, GoPay, OVO, ShopeePay, atau DANA
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
                  <span className="font-sans text-xs text-[#64748B] block">
                    Nomor Virtual Account BCA:
                  </span>
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#CBD5E1]">
                    <p className="font-mono text-lg sm:text-xl font-black text-[#1035D0] tracking-wider">
                      {vaNumber}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyVa}
                      className="p-1.5 text-xs font-bold text-[#1035D0] hover:bg-[#EFF6FF] rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedVa ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Nama Akun: <strong>FLYPICK INDONESIA REKSA</strong>
                  </p>
                </div>
              )}

              {/* Delivery recipient preview */}
              <div className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1E293B] block">
                    Kirim ke: {deliveryAddress.recipientName} ({deliveryAddress.phone})
                  </span>
                  <span className="text-[#64748B] block truncate max-w-xs">
                    {deliveryAddress.city}, {deliveryAddress.streetAddress}
                  </span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
              </div>

              {/* Payment button connecting to backend */}
              <button
                type="button"
                disabled={isPending}
                onClick={handleExecutePayment}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#1035D0] hover:bg-[#0D2BAA] disabled:opacity-70 text-white font-sans font-bold text-sm rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
                    <span>Menerbitkan Order &amp; Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>Bayar &amp; Terbitkan Tiket Order</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Post-payment Success Card */
            <div className="text-center space-y-5 animate-in zoom-in-95 py-2">
              <div className="w-16 h-16 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full mx-auto flex items-center justify-center text-[#1035D0] shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <Badge variant="electric">TIKET ORDER TERBIT</Badge>
                <h2 className="font-sans font-black text-xl text-[#0F172A] uppercase">
                  Pesanan Berhasil Masuk Manifest!
                </h2>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl inline-block my-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Nomor Pesanan Resmi
                  </span>
                  <p className="font-mono text-base text-[#1035D0] font-black tracking-wider">
                    {createdOrderCode}
                  </p>
                </div>

                {paymentInstructions && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl max-w-sm mx-auto font-medium">
                    {paymentInstructions}
                  </p>
                )}

                <p className="text-xs text-[#64748B] max-w-sm mx-auto pt-1 leading-relaxed">
                  Pesanan Anda telah resmi tercatat di database Flypick dan
                  dimasukkan ke dalam antrean manifest penerbangan kargo. Anda
                  dapat memantau update status dan Photo QC di menu pelacakan.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoToTracking}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#1035D0] hover:bg-[#0D2BAA] text-white font-sans font-bold text-sm rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
                >
                  <span>Lihat Timeline &amp; Lacak di Profil</span>
                  <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

