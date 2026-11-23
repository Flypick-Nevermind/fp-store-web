"use client";

import { CheckCircle2, Luggage, Plane, Truck } from "lucide-react";
import { Badge } from "@/components/atoms";
import { BRANDING } from "@/config/branding";
import { cn } from "@/lib/utils";
import type { ShippingMethod } from "@/types";

interface ShippingTicketsSelectorProps {
  selectedMethod: ShippingMethod;
  onSelectMethod: (method: ShippingMethod) => void;
  totalItemCount?: number;
}

export function ShippingTicketsSelector({
  selectedMethod,
  onSelectMethod,
}: ShippingTicketsSelectorProps) {
  const cargoInfo = BRANDING.shippingRates.cargo;
  const handcarryInfo = BRANDING.shippingRates.handcarry;

  const isCargoSelected =
    selectedMethod === "CARGO" || selectedMethod === "AIR_EXPRESS";
  const isHandcarrySelected = selectedMethod === "HANDCARRY";

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1035D0]">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-sans font-bold text-sm sm:text-base text-[#0F172A] tracking-tight">
              Pilih Jalur Pengiriman (China ➔ Indonesia)
            </h2>
            <p className="text-xs text-[#64748B]">
              Pilih pengiriman via Cargo atau Handcarry. Ongkir ditagihkan di
              Tahap 2 setelah barang tiba di Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Boarding Pass Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── TIKET 1: TIKET JASA CARGO ──────────────────────────── */}
        <button
          type="button"
          onClick={() => onSelectMethod("CARGO")}
          className={cn(
            "relative bg-white rounded-2xl border-2 transition-all cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col justify-between select-none text-left",
            isCargoSelected
              ? "border-[#1035D0] shadow-[0_12px_28px_-6px_rgba(16,53,208,0.22)] ring-2 ring-[#1035D0]/20 bg-gradient-to-b from-[#F8FAFC] to-white"
              : "border-[#E2E8F0] hover:border-[#94A3B8] shadow-xs hover:shadow-md",
          )}
        >
          {/* Top Boarding Pass Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                  isCargoSelected
                    ? "bg-[#1035D0] text-white border-[#1035D0]"
                    : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
                )}
              >
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-sans font-black text-sm text-[#0F172A]">
                  TIKET JASA CARGO
                </span>
                <Badge variant="neon" className="text-[10px] py-0 px-1.5">
                  AIR/SEA
                </Badge>
              </div>
            </div>

            {/* Selection Checkmark */}
            <div className="shrink-0">
              {isCargoSelected ? (
                <div className="w-6 h-6 rounded-full bg-[#1035D0] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1] hover:border-[#1035D0]" />
              )}
            </div>
          </div>

          {/* Features & Billing Info */}
          <div className="space-y-2 py-3 border-y border-dashed border-[#E2E8F0] my-2 text-xs">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[#64748B]">Estimasi Tiba:</span>
              <span className="font-bold text-[#0F172A]">{cargoInfo.eta}</span>
            </div>
            <div className="flex justify-between items-baseline font-mono text-[11px]">
              <span className="text-[#64748B]">Penagihan Ongkir:</span>
              <span className="font-bold text-[#1035D0] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                Tahap 2 (Saat tiba di ID)
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed pt-1">
              Cocok untuk barang volume besar atau banyak paket. Ongkir dihitung
              &amp; ditagihkan setelah barang tiba di Indonesia.
            </p>
          </div>

          {/* Ticket Footer Barcode & Tag */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-[2px] h-3.5 opacity-60">
              <span className="w-1 h-full bg-[#0F172A]" />
              <span className="w-0.5 h-full bg-[#0F172A]" />
              <span className="w-1.5 h-full bg-[#0F172A]" />
              <span className="w-0.5 h-full bg-[#0F172A]" />
              <span className="w-1 h-full bg-[#0F172A]" />
              <span className="w-2 h-full bg-[#0F172A]" />
              <span className="w-0.5 h-full bg-[#0F172A]" />
              <span className="w-1.5 h-full bg-[#0F172A]" />
            </div>
            <span className="font-mono text-[10px] text-[#64748B] tracking-wider uppercase">
              BOARDING: CARGO-REGULAR
            </span>
          </div>
        </button>

        {/* ── TIKET 2: TIKET JASA HANDCARRY ──────────────────────── */}
        <button
          type="button"
          onClick={() => onSelectMethod("HANDCARRY")}
          className={cn(
            "relative bg-white rounded-2xl border-2 transition-all cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col justify-between select-none text-left",
            isHandcarrySelected
              ? "border-[#1035D0] shadow-[0_12px_28px_-6px_rgba(16,53,208,0.22)] ring-2 ring-[#1035D0]/20 bg-gradient-to-b from-[#F8FAFC] to-white"
              : "border-[#E2E8F0] hover:border-[#94A3B8] shadow-xs hover:shadow-md",
          )}
        >
          {/* Top Boarding Pass Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                  isHandcarrySelected
                    ? "bg-[#1035D0] text-white border-[#1035D0]"
                    : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
                )}
              >
                <Luggage className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-sans font-black text-sm text-[#0F172A]">
                  TIKET HANDCARRY
                </span>
                <Badge variant="neon" className="text-[10px] py-0 px-1.5">
                  VIP CABIN
                </Badge>
              </div>
            </div>

            {/* Selection Checkmark */}
            <div className="shrink-0">
              {isHandcarrySelected ? (
                <div className="w-6 h-6 rounded-full bg-[#1035D0] text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1] hover:border-[#1035D0]" />
              )}
            </div>
          </div>

          {/* Features & Billing Info */}
          <div className="space-y-2 py-3 border-y border-dashed border-[#E2E8F0] my-2 text-xs">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-[#64748B]">Estimasi Tiba:</span>
              <span className="font-bold text-[#0F172A]">
                {handcarryInfo.eta}
              </span>
            </div>
            <div className="flex justify-between items-baseline font-mono text-[11px]">
              <span className="text-[#64748B]">Penagihan Ongkir:</span>
              <span className="font-bold text-[#1035D0] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                Tahap 2 (Saat tiba di ID)
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed pt-1">
              Dibawa langsung dalam koper kabin kurir traveler sehingga lebih
              cepat sampai. Ongkir dihitung &amp; ditagihkan setelah tiba di
              Indonesia.
            </p>
          </div>

          {/* Ticket Footer Barcode & Tag */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-[2px] h-3.5 opacity-60">
              <span className="w-1 h-full bg-[#0F172A]" />
              <span className="w-0.5 h-full bg-[#0F172A]" />
              <span className="w-1.5 h-full bg-[#0F172A]" />
              <span className="w-0.5 h-full bg-[#0F172A]" />
              <span className="w-1 h-full bg-[#0F172A]" />
              <span className="w-2 h-full bg-[#0F172A]" />
              <span className="w-0.5 h-full bg-[#0F172A]" />
              <span className="w-1.5 h-full bg-[#0F172A]" />
            </div>
            <span className="font-mono text-[10px] text-[#64748B] tracking-wider uppercase">
              BOARDING: CABIN-EXPRESS
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
