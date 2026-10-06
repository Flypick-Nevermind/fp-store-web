"use client";

import { ArrowRight, Info, Plane } from "lucide-react";
import Link from "next/link";
import { Badge, Barcode, Button } from "@/components/atoms";
import { useCartActions } from "@/hooks/use-cart-actions";
import { formatCny, formatIdr } from "@/lib/utils";

export function CartSummary() {
  const {
    items,
    buyForMeItems,
    forwardingItems,
    itemCount,
    subtotalIdr,
    serviceFeeIdr,
    totalStage1Idr,
    buyForMeCny,
  } = useCartActions();

  return (
    <div className="bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] sticky top-24">
      {/* Header */}
      <div className="bg-[#1A1A24] text-white p-4 border-b-2 border-[#2323FF] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            RINGKASAN KONSOLIDASI
          </h3>
        </div>
        <Badge variant="electric">{itemCount} ITEM TERPILIH</Badge>
      </div>

      <div className="p-5 space-y-5">
        {/* Stage 1 Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1A1A24]/10">
            <span className="font-mono text-[#1A1A24]/70">Layanan Aktif:</span>
            <div className="flex gap-1.5 font-mono text-[11px]">
              {buyForMeItems.length > 0 && (
                <span className="bg-[#2323FF]/10 text-[#2323FF] font-bold px-1.5 py-0.5 border border-[#2323FF]/30">
                  {buyForMeItems.length} Titip Beli
                </span>
              )}
              {forwardingItems.length > 0 && (
                <span className="bg-[#FF5E1E]/10 text-[#FF5E1E] font-bold px-1.5 py-0.5 border border-[#FF5E1E]/30">
                  {forwardingItems.length} Forwarding
                </span>
              )}
            </div>
          </div>

          {buyForMeCny > 0 && (
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#1A1A24]/70">Total Talangan CNY:</span>
              <span className="font-bold">{formatCny(buyForMeCny)}</span>
            </div>
          )}

          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#1A1A24]/70">Subtotal Barang (IDR):</span>
            <span className="font-bold text-[#1A1A24]">
              {formatIdr(subtotalIdr)}
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#1A1A24]/70 flex items-center gap-1">
              Handling &amp; Admin Konsolidasi:
            </span>
            <span className="font-bold text-[#1A1A24]">
              {formatIdr(serviceFeeIdr)}
            </span>
          </div>

          {/* Grand Total Stage 1 */}
          <div className="pt-3 border-t-2 border-dashed border-[#1A1A24]/20 flex items-baseline justify-between">
            <div>
              <p className="font-mono text-xs font-bold text-[#1A1A24] uppercase">
                INVOICE TAHAP 1:
              </p>
              <p className="font-sans text-[11px] text-[#1A1A24]/60">
                (Pembayaran awal sebelum pengadaan)
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-black text-[#2323FF]">
                {formatIdr(totalStage1Idr)}
              </p>
            </div>
          </div>
        </div>

        {/* Stage 2 Info Notice */}
        <div className="p-3 bg-[#FFF8E1] border-2 border-[#1A1A24] space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#1A1A24]">
            <Info className="w-3.5 h-3.5 text-[#2323FF]" />
            <span>Bagaimana Tagihan Ongkir (Tahap 2)?</span>
          </div>
          <p className="font-sans text-[11px] text-[#1A1A24]/80 leading-relaxed">
            Ongkir internasional &amp; pajak dihitung transparan saat paket
            lengkap ditimbang di Shanghai. Anda hanya membayar tarif riil (Air
            Express mulai Rp 165rb/kg).
          </p>
        </div>

        {/* Action Button */}
        <Link href="/checkout" className="block">
          <Button
            variant="neon"
            size="lg"
            className="w-full text-center flex items-center justify-center gap-2"
            disabled={items.length === 0}
          >
            <span>LANJUT KE PENGIRIMAN &amp; CHECKOUT</span>
            <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
          </Button>
        </Link>

        {/* Barcode Footer */}
        <div className="pt-2 flex flex-col items-center">
          <Barcode value="FP-CONSOLIDATION-PASS" height={22} />
        </div>
      </div>
    </div>
  );
}
