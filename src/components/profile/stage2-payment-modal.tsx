"use client";

import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Plane,
  QrCode,
  Scale,
  ShieldCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/lib/utils";
import type { OrderRecord } from "@/types";

interface Stage2PaymentModalProps {
  isOpen: boolean;
  order: OrderRecord | null;
  paymentMethod: "QRIS" | "VA";
  setPaymentMethod: (method: "QRIS" | "VA") => void;
  isProcessing: boolean;
  isPaid: boolean;
  onClose: () => void;
  onConfirmPay: () => void;
}

export function Stage2PaymentModal({
  isOpen,
  order,
  paymentMethod,
  setPaymentMethod,
  isProcessing,
  isPaid,
  onClose,
  onConfirmPay,
}: Stage2PaymentModalProps) {
  if (!isOpen || !order) return null;

  const actualWeight = order.qcData?.weightKg || 1.15;
  const freightRatePerKg =
    order.shippingMethod === "AIR_EXPRESS" ? 165000 : 45000;
  const freightTotal = Math.round(actualWeight * freightRatePerKg);
  const totalAmount = order.stage2ActualAmount || freightTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A24]/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1A1A24] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#2323FF]">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#00F0FF]" />
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                TERMINAL PELUNASAN TAHAP 2
              </h3>
              <p className="font-mono text-[10px] text-[#00F0FF]">
                RESI: {order.trackingCode} • ORDER {order.id}
              </p>
            </div>
          </div>
          {!isPaid && (
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-[#00F0FF] p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {isPaid ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#00F0FF] border-2 border-[#1A1A24] rounded-full flex items-center justify-center mx-auto text-[#1A1A24] animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="rubber-stamp text-[#2323FF] border-[#2323FF] text-sm bg-white mb-2 inline-block">
                  LUNAS - CARGO RELEASED
                </span>
                <h4 className="font-mono text-base font-black text-[#1A1A24] uppercase mt-2">
                  PELUNASAN KARGO DITERIMA!
                </h4>
                <p className="text-xs text-[#1A1A24]/70 mt-1 max-w-sm mx-auto">
                  Paket Anda telah dilepaskan dari penahanan kargo. Dokumen
                  impor SPPB langsung diproses untuk pengantaran kurir domestik
                  ke alamat Anda.
                </p>
              </div>

              <div className="bg-[#FFF8E1] border border-[#1A1A24] p-3 font-mono text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#1A1A24]/70">Nomor Resi:</span>
                  <span className="font-bold text-[#2323FF]">
                    {order.trackingCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A24]/70">Total Pelunasan:</span>
                  <span className="font-bold text-[#1A1A24]">
                    {formatIdr(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A24]/70">Status Kargo:</span>
                  <span className="font-bold text-emerald-600">
                    CLEARED FOR DISPATCH
                  </span>
                </div>
              </div>

              <Button
                variant="electric"
                onClick={onClose}
                className="w-full mt-4"
              >
                KEMBALI KE TIMELINE PELACAKAN
              </Button>
            </div>
          ) : (
            /* Payment Selection & Invoice Breakdown */
            <div className="space-y-5">
              {/* Manifest Scale Breakdown */}
              <div className="bg-[#FFF8E1] border-2 border-[#1A1A24] p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A1A24]/20">
                  <span className="text-[#1A1A24]/80 flex items-center gap-1.5 font-bold uppercase">
                    <Scale className="w-4 h-4 text-[#2323FF]" /> Rincian
                    Timbangan Shanghai:
                  </span>
                  <Badge variant="electric">PVG-01 VERIFIED</Badge>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A24]/70">
                      Berat Riil Timbangan:
                    </span>
                    <span className="font-black text-[#2323FF]">
                      {actualWeight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A24]/70">
                      Layanan Pengiriman:
                    </span>
                    <span className="font-bold text-[#1A1A24]">
                      {order.shippingMethod === "AIR_EXPRESS"
                        ? "Air Express (7-10H)"
                        : "Sea Economy (20-28H)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A24]/70">Tarif per Kg:</span>
                    <span className="text-[#1A1A24]">
                      {formatIdr(freightRatePerKg)} / kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A24]/70">
                      Pajak &amp; Bea Cukai Impor:
                    </span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> ALL-IN TERMASUK
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1A1A24]/20 flex justify-between items-center text-sm font-black">
                  <span className="text-[#1A1A24]">TOTAL TAGIHAN TAHAP 2:</span>
                  <span className="text-[#2323FF] text-base">
                    {formatIdr(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <p className="font-mono text-xs font-bold uppercase text-[#1A1A24] block mb-2">
                  PILIH METODE PELUNASAN:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`p-3 border-2 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "QRIS"
                        ? "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24] shadow-[3px_3px_0px_0px_#00F0FF]"
                        : "bg-white text-[#1A1A24] border-[#1A1A24]/30 hover:border-[#1A1A24]"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QRIS (INSTAN)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("VA")}
                    className={`p-3 border-2 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "VA"
                        ? "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24] shadow-[3px_3px_0px_0px_#00F0FF]"
                        : "bg-white text-[#1A1A24] border-[#1A1A24]/30 hover:border-[#1A1A24]"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>VIRTUAL ACCOUNT</span>
                  </button>
                </div>
              </div>

              {/* QRIS / VA Display Box */}
              <div className="p-4 bg-[#F9F7F1] border-2 border-dashed border-[#1A1A24]/30 text-center">
                {paymentMethod === "QRIS" ? (
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] text-[#1A1A24]/70">
                      Scan QRIS via BCA Mobile, GoPay, OVO, ShopeePay, atau Bank
                      Lainnya:
                    </p>
                    <div className="w-36 h-36 bg-white border-2 border-[#1A1A24] p-2 mx-auto flex items-center justify-center shadow-[3px_3px_0px_0px_#1A1A24]">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FLYPICK-STAGE2-${order.id}-${totalAmount}`}
                        alt="QRIS Pelunasan FLYPICK"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-mono text-[10px] text-[#2323FF] font-bold">
                      EXPIRES IN 23:59:00 • VERIFIKASI OTOMATIS
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-left font-mono">
                    <p className="text-[11px] text-[#1A1A24]/70">
                      Transfer ke Rekening Virtual Account Mandiri / BCA:
                    </p>
                    <div className="p-3 bg-white border border-[#1A1A24] flex items-center justify-between">
                      <span className="font-bold text-sm text-[#2323FF]">
                        8821 0812 9988 7766
                      </span>
                      <Badge variant="yellow">MANDIRI VA</Badge>
                    </div>
                    <p className="text-[10px] text-[#1A1A24]/60">
                      Nama Rekening: FLYPICK CARGO INDONESIA
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="electric"
                  disabled={isProcessing}
                  onClick={onConfirmPay}
                  className="w-full py-3 text-sm cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      MEMVERIFIKASI PELUNASAN DENGAN GATEWAY...
                    </span>
                  ) : (
                    <span>
                      SIMULASI BAYAR PELUNASAN ({formatIdr(totalAmount)})
                    </span>
                  )}
                </Button>

                <p className="font-mono text-[10px] text-center text-[#1A1A24]/60">
                  Pelunasan langsung memperbarui status manifest kargo rute
                  PVG➔CGK secara realtime.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Barcode Footer */}
        <div className="bg-[#FFF8E1] px-5 py-2.5 border-t border-[#1A1A24]/20 flex items-center justify-between">
          <span className="font-mono text-[9px] text-[#1A1A24]/60">
            OFFICIAL STAGE 2 FREIGHT CLEARANCE SYSTEM
          </span>
          <Barcode value={`STAGE2-${order.id}`} height={16} />
        </div>
      </div>
    </div>
  );
}
