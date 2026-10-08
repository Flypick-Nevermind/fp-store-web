"use client";

import {
  ArrowRight,
  Clock,
  CreditCard,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/lib/utils";
import type { OrderRecord } from "@/types";

interface Stage2PaymentCardProps {
  order: OrderRecord;
  onOpenPaymentModal: () => void;
}

export function Stage2PaymentCard({
  order,
  onOpenPaymentModal,
}: Stage2PaymentCardProps) {
  const isHandcarry = order.shippingMethod === "HANDCARRY";
  const isPending = order.stage2PaymentStatus === "PENDING";
  const actualWeight = order.qcData?.weightKg || 1.15;
  const freightRatePerKg =
    order.shippingMethod === "AIR_EXPRESS" ? 165000 : 45000;
  const totalAmount =
    order.stage2ActualAmount || Math.round(actualWeight * freightRatePerKg);

  if (isHandcarry) {
    return (
      <div className="bg-[#E6FFFA] border-2 border-[#1A1A24] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#00F0FF] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-[#047857]">
                STATUS BIAYA: VIP HANDCARRY (LUNAS ALL-IN)
              </span>
              <Badge variant="electric">BEBAS BIAYA TAHAP 2</Badge>
            </div>
            <p className="text-xs text-[#1A1A24]/80">
              Paket ini menggunakan layanan{" "}
              <strong>VIP Handcarry (Dibawa Traveler Kabin)</strong>. Seluruh
              biaya jasa, penerbangan bagasi kabin, dan penanganan cukai telah
              dilunasi di awal saat checkout. Anda{" "}
              <strong>tidak dikenakan tagihan Tahap 2</strong> lagi.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="rubber-stamp text-emerald-600 border-emerald-600 text-xs bg-white">
              ALL-IN PAID
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isPending) {
    // Already Paid State
    return (
      <div className="bg-[#FFF8E1] border-2 border-[#1A1A24] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#2323FF] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-[#2323FF]">
                TAGIHAN TAHAP 2 (ONGKIR &amp; BEA CUKAI)
              </span>
              <Badge variant="electric">LUNAS / VERIFIED</Badge>
            </div>
            <p className="text-xs text-[#1A1A24]/80">
              Pelunasan kargo berdasarkan timbangan riil{" "}
              <strong>{actualWeight} kg</strong> telah diselesaikan pada{" "}
              <span className="font-mono font-bold text-[#2323FF]">
                {order.stage2PaidAt || "06 Okt 2026, 13:10 WIB"}
              </span>
              . Kargo bebas hambatan dan siap diantar kurir lokal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="rubber-stamp text-emerald-600 border-emerald-600 text-xs bg-white">
              STAGE 2 PAID
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Pending State
  return (
    <div className="bg-gradient-to-r from-[#FFF8E1] to-white border-2 border-[#2323FF] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#1A1A24] relative overflow-hidden">
      {/* Top Banner Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#1A1A24]/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#FFDE00] border-2 border-[#1A1A24] text-[#1A1A24] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#1A1A24]">
            <Clock className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-mono text-xs font-black uppercase text-[#1A1A24] tracking-wide">
                INVOICE PELUNASAN TAHAP 2 MENUNGGU PEMBAYARAN
              </h4>
              <Badge variant="yellow">PENDING PAYMENT</Badge>
            </div>
            <p className="text-xs text-[#1A1A24]/75 mt-0.5">
              Barang telah ditimbang &amp; lolos QC di Gudang Shanghai. Silakan
              melunasi ongkir kargo internasional sebelum paket sampai di tahap
              Bea Cukai &amp; Dispatched kurir.
            </p>
          </div>
        </div>

        {/* Amount Pill */}
        <div className="text-right shrink-0">
          <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase block">
            Total Pelunasan:
          </span>
          <span className="font-mono text-lg font-black text-[#2323FF]">
            {formatIdr(totalAmount)}
          </span>
        </div>
      </div>

      {/* Breakdown Details & CTA */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2 bg-white border border-[#1A1A24]/30">
            <span className="text-[10px] text-[#1A1A24]/60 block">
              Berat Timbang PVG:
            </span>
            <span className="font-bold text-[#1A1A24] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#2323FF]" /> {actualWeight} kg
            </span>
          </div>

          <div className="p-2 bg-white border border-[#1A1A24]/30">
            <span className="text-[10px] text-[#1A1A24]/60 block">
              Tarif Kargo:
            </span>
            <span className="font-bold text-[#1A1A24]">
              {order.shippingMethod === "AIR_EXPRESS"
                ? "Air @ 165k/kg"
                : "Sea @ 45k/kg"}
            </span>
          </div>

          <div className="p-2 bg-white border border-[#1A1A24]/30 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#1A1A24]/60 block">
              Pajak Impor &amp; PPN:
            </span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> All-in Termasuk
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          variant="electric"
          onClick={onOpenPaymentModal}
          className="py-3 px-5 text-xs font-mono font-black uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#1A1A24] shrink-0"
        >
          <CreditCard className="w-4 h-4 text-[#00F0FF]" />
          <span>BAYAR PELUNASAN TAHAP 2</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
