"use client";

import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Info,
  Luggage,
  ShieldAlert,
  Sparkles,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/atoms";
import { BRANDING } from "@/config/branding";
import { cn, formatIdr } from "@/lib/utils";
import type { CartItem, ShippingMethod } from "@/types";

interface ResultBiayaCardProps {
  items: CartItem[];
  totalItemCount: number;
  shippingMethod?: ShippingMethod;
  subtotalIdr: number;
  serviceFeeIdr: number;
  photoQcFee: number;
  bubbleWrapFee: number;
  isHandcarry: boolean;
  handcarryShippingFee: number;
  cargoEstimatedStage2: number;
  grandTotalStage1: number;
  hasPhotoQc: boolean;
  hasBubbleWrap: boolean;
  onProceedPayment: () => void;
}

export function ResultBiayaCard({
  items,
  totalItemCount,
  subtotalIdr,
  serviceFeeIdr,
  photoQcFee,
  bubbleWrapFee,
  isHandcarry,
  handcarryShippingFee,
  cargoEstimatedStage2,
  grandTotalStage1,
  hasPhotoQc,
  hasBubbleWrap,
  onProceedPayment,
}: ResultBiayaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-[0_16px_36px_-8px_rgba(16,53,208,0.12)] overflow-hidden sticky top-24">
      {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="bg-[#1035D0] text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#00F0FF]" />
          <div>
            <h3 className="font-sans font-bold text-sm tracking-tight text-white uppercase">
              Result Biaya Pesanan
            </h3>
            <p className="text-[11px] text-[#93C5FD]">
              Kalkulasi instan berdasarkan opsi pengiriman
            </p>
          </div>
        </div>

        <Badge
          variant={isHandcarry ? "electric" : "neon"}
          className="text-[10px] font-mono px-2 py-0.5"
        >
          {isHandcarry ? "VIP HANDCARRY" : "CARGO FREIGHT"}
        </Badge>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* ── Item Manifest Mini Preview ───────────────────────── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Produk Terpilih ({items.length} Link / Variant)</span>
            <span>Total {totalItemCount} pcs</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => {
              const isBfm = item.serviceType === "BUY_FOR_ME";
              const bfm = isBfm
                ? (item as import("@/types").BuyForMeItem)
                : null;
              const title = isBfm
                ? bfm?.productName
                : (item as import("@/types").ForwardingItem).description;
              const imgUrl = isBfm ? bfm?.imageUrl : null;
              const variantDesc = isBfm
                ? bfm?.selectedVariant?.color || "Default"
                : "Forwarding Resi";
              const linePrice = isBfm
                ? (bfm?.priceIdr || 0) * item.quantity
                : 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={title || "Product"}
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#E2E8F0]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#E2E8F0] flex items-center justify-center shrink-0 text-[#64748B] text-xs font-bold">
                        FP
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-[#0F172A] truncate max-w-[190px]">
                        {title}
                      </p>
                      <p className="text-[11px] text-[#64748B] font-mono truncate">
                        {variantDesc} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-[#0F172A] shrink-0 text-right">
                    {formatIdr(linePrice)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Cost Breakdown List ────────────────────────────────── */}
        <div className="space-y-2.5 pt-3 border-t border-[#E2E8F0] text-xs font-sans">
          {/* Subtotal Barang */}
          <div className="flex justify-between items-center text-[#475569]">
            <span>Subtotal Nilai Barang:</span>
            <span className="font-mono font-bold text-[#0F172A]">
              {formatIdr(subtotalIdr)}
            </span>
          </div>

          {/* Fee Handling Konsolidasi */}
          <div className="flex justify-between items-center text-[#475569]">
            <span>Handling &amp; Konsolidasi Shanghai:</span>
            <span className="font-mono font-bold text-[#0F172A]">
              {formatIdr(serviceFeeIdr)}
            </span>
          </div>

          {/* Selected Shipping Method Line */}
          <div
            className={cn(
              "flex justify-between items-center p-2 rounded-xl border transition-all",
              isHandcarry
                ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#1035D0]"
                : "bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]",
            )}
          >
            <div className="flex items-center gap-1.5">
              {isHandcarry ? (
                <Luggage className="w-3.5 h-3.5 text-[#1035D0]" />
              ) : (
                <Truck className="w-3.5 h-3.5 text-[#64748B]" />
              )}
              <span className="font-semibold text-xs">
                {isHandcarry
                  ? `Tiket Handcarry (${totalItemCount} pcs @Rp 95k)`
                  : "Tiket Jasa Kargo (Tahap 1)"}
              </span>
            </div>
            <span className="font-mono font-bold text-xs">
              {isHandcarry ? formatIdr(handcarryShippingFee) : "Rp 0 (Tahap 1)"}
            </span>
          </div>

          {/* Add-ons if chosen */}
          {hasPhotoQc && (
            <div className="flex justify-between items-center text-[#1035D0]">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Photo QC Inspeksi
                Unboxing:
              </span>
              <span className="font-mono font-bold">
                {formatIdr(photoQcFee)}
              </span>
            </div>
          )}

          {hasBubbleWrap && (
            <div className="flex justify-between items-center text-[#1035D0]">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Extra Bubble Wrap 3
                Lapis:
              </span>
              <span className="font-mono font-bold">
                {formatIdr(bubbleWrapFee)}
              </span>
            </div>
          )}
        </div>

        {/* ── Grand Total Result ─────────────────────────────────── */}
        <div className="pt-3 border-t-2 border-dashed border-[#E2E8F0]">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="font-sans font-black text-xs text-[#0F172A] uppercase tracking-tight">
                TOTAL RESULT BIAYA
              </p>
              <p className="text-[11px] text-[#64748B]">
                {isHandcarry
                  ? "Pembayaran All-in (Siap Terbang)"
                  : "Invoice Tahap 1 (Talangan & Handling)"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-black text-[#1035D0]">
                {formatIdr(grandTotalStage1)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stage 2 Info Notice (if Cargo) ─────────────────────── */}
        {!isHandcarry ? (
          <div className="p-3 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] text-[11px] text-[#92400E] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Ongkir Kargo Ditimbang di Gudang Shanghai:</span>
            </div>
            <p className="leading-relaxed">
              Biaya kargo diestimasi{" "}
              <strong className="font-mono font-bold text-[#B45309]">
                {formatIdr(cargoEstimatedStage2)}
              </strong>{" "}
              (est. 1.5kg). Ditagihkan saat barang tiba di Shanghai Hub lengkap
              dengan foto unboxing QC.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[11px] text-[#065F46] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Bebas Tagihan Tambahan (All-In):</span>
            </div>
            <p className="leading-relaxed">
              Tiket Handcarry sudah mencakup bagasi kabin traveler VIP &amp; bea
              cukai personal. Tidak ada biaya siluman saat barang mendarat.
            </p>
          </div>
        )}

        {/* ── Main CTA Button: Lanjut ke Menu Pembayaran ─────────── */}
        <button
          type="button"
          onClick={onProceedPayment}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#1035D0] hover:bg-[#0D2BAA] active:scale-[0.99] text-white font-sans font-bold text-sm rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
        >
          <span>Lanjut ke Menu Pembayaran</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-center text-[#94A3B8] font-mono">
          🔒 TRANSAKSI RESMI DILINDUNGI SISTEM ESCROW FLYPICK
        </p>
      </div>
    </div>
  );
}
