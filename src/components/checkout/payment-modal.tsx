"use client";

import confetti from "canvas-confetti";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Plane,
  QrCode,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
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
  const { success } = useToast();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useCheckoutStore((s) => s.createOrder);

  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "VA">("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string>("");

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create official order
      const newOrder = createOrder(items, stage1TotalIdr);
      setCreatedOrderCode(newOrder.id);
      clearCart();
      setIsProcessing(false);
      setIsPaid(true);

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2323FF", "#00F0FF", "#FFDE00"],
        });
      } catch (_e) {
        // fallback
      }

      success(
        "Pembayaran Tahap 1 Sukses!",
        `Tiket Order ${newOrder.id} telah diterbitkan dan masuk antrean Shanghai.`,
      );
    }, 1200);
  };

  const handleGoToTracking = () => {
    onClose();
    router.push("/profile");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A24]/65 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2323FF] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#1A1A24]">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              TERMINAL PEMBAYARAN TAHAP 1
            </h3>
          </div>
          {!isPaid && (
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-[#00F0FF] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!isPaid ? (
            <>
              {/* Invoice Pill */}
              <div className="p-4 bg-[#FFF8E1] border-2 border-[#1A1A24] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#1A1A24]/70 uppercase block">
                    TOTAL TAGIHAN TAHAP 1:
                  </span>
                  <p className="font-mono text-2xl font-black text-[#2323FF]">
                    {formatIdr(stage1TotalIdr)}
                  </p>
                </div>
                <Badge variant="electric">INSTANT VERIFIED</Badge>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("QRIS")}
                  className={`p-2.5 font-mono text-xs font-bold uppercase border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === "QRIS"
                      ? "bg-[#2323FF] text-white border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
                      : "bg-white text-[#1A1A24] border-[#1A1A24]/30"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#00F0FF]" />
                  QRIS (SEMUA E-WALLET)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("VA")}
                  className={`p-2.5 font-mono text-xs font-bold uppercase border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === "VA"
                      ? "bg-[#2323FF] text-white border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
                      : "bg-white text-[#1A1A24] border-[#1A1A24]/30"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#00F0FF]" />
                  VIRTUAL ACCOUNT BCA
                </button>
              </div>

              {/* QRIS / VA Display Box */}
              {paymentMethod === "QRIS" ? (
                <div className="p-4 bg-white border-2 border-dashed border-[#1A1A24] flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="p-3 bg-white border-2 border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24]">
                    {/* Simulated SVG QR Code */}
                    <div className="w-44 h-44 bg-[#1A1A24] p-2 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 border-4 border-white bg-transparent" />
                        <div className="w-10 h-10 border-4 border-white bg-transparent" />
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="bg-[#00F0FF] text-[#1A1A24] font-mono font-black text-[10px] px-1 py-0.5 border border-white">
                          FLYPICK
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 border-4 border-white bg-transparent" />
                        <div className="w-6 h-6 bg-white" />
                      </div>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] text-[#1A1A24]/80">
                    Scan via BCA Mobile, GoPay, OVO, ShopeePay, atau DANA
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-white border-2 border-dashed border-[#1A1A24] space-y-2">
                  <span className="font-mono text-xs text-[#1A1A24]/70">
                    Nomor Virtual Account:
                  </span>
                  <p className="font-mono text-xl font-black text-[#2323FF] tracking-wider select-all">
                    8801 9821 7712 9001
                  </p>
                  <p className="font-mono text-[11px] text-[#1A1A24]/60">
                    Nama Penerima: <strong>FLYPICK INDONESIA REKSA</strong>
                  </p>
                </div>
              )}

              {/* Trigger mock simulation button */}
              <Button
                type="button"
                variant="neon"
                size="lg"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
                    MEMPROSES PEMBAYARAN...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                    SIMULASI BAYAR BERHASIL (MOCK GATEWAY)
                  </>
                )}
              </Button>
            </>
          ) : (
            /* Post-payment Success Card */
            <div className="text-center space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-[#FFF8E1] border-2 border-[#2323FF] rounded-full mx-auto flex items-center justify-center text-[#2323FF]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <Badge variant="electric">PEMBAYARAN DIVERIFIKASI</Badge>
                <h2 className="font-mono text-xl font-black text-[#1A1A24] uppercase">
                  Tiket Order Diterbitkan!
                </h2>
                <p className="font-mono text-xs text-[#2323FF] font-bold">
                  Kode Referensi: {createdOrderCode}
                </p>
                <p className="text-xs text-[#1A1A24]/75 max-w-sm mx-auto">
                  Paket Anda telah dimasukkan ke manifest kedatangan Gudang
                  Shanghai. Pantau status penimbangan & foto barang di timeline
                  pelacakan.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="neon"
                  size="lg"
                  onClick={handleGoToTracking}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>LIHAT TIMELINE & STATUS GUDANG</span>
                  <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
                </Button>
              </div>

              <Barcode value={createdOrderCode} height={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
