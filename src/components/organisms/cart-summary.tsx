"use client";

import { ArrowRight, Plane, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms";
import { useCartActions } from "@/hooks/use-cart-actions";
import { formatCny, formatIdr } from "@/lib/utils";

export function CartSummary() {
  const {
    items,
    itemCount,
    subtotalIdr,
    serviceFeeIdr,
    totalStage1Idr,
    buyForMeCny,
  } = useCartActions();

  return (
    <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-[0_16px_36px_-8px_rgba(16,53,208,0.12)] overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-[#1035D0] text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-white">
            Ringkasan Keranjang
          </h3>
        </div>
        <Badge variant="electric" className="text-[10px] font-mono px-2 py-0.5">
          {itemCount} LINK TERDAFTAR
        </Badge>
      </div>

      <div className="p-5 space-y-5">
        {/* Stage 1 Breakdown */}
        <div className="space-y-3 font-sans text-xs">
          {buyForMeCny > 0 && (
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#64748B]">Total Nilai CNY:</span>
              <span className="font-bold text-[#0F172A]">
                {formatCny(buyForMeCny)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Subtotal Barang (IDR):</span>
            <span className="font-mono font-bold text-[#0F172A]">
              {formatIdr(subtotalIdr)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Handling &amp; Konsolidasi:</span>
            <span className="font-mono font-bold text-[#0F172A]">
              {formatIdr(serviceFeeIdr)}
            </span>
          </div>

          {/* Subtotal Stage 1 */}
          <div className="pt-3 border-t border-dashed border-[#CBD5E1] flex items-baseline justify-between">
            <div>
              <p className="font-sans font-bold text-xs text-[#0F172A] uppercase">
                Estimasi Tahap 1:
              </p>
              <p className="text-[11px] text-[#64748B]">
                (Produk + Biaya Layanan)
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-black text-[#1035D0]">
                {formatIdr(totalStage1Idr)}
              </p>
            </div>
          </div>
        </div>

        {/* Info next step */}
        <div className="p-3 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#1035D0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Langkah Berikutnya: Pilih Jasa Kirim</span>
          </div>
          <p className="text-[11px] text-[#475569] leading-relaxed">
            Di halaman checkout, Anda dapat memilih antara{" "}
            <strong>Tiket Kargo</strong> atau{" "}
            <strong>Tiket Handcarry VIP</strong>.
          </p>
        </div>

        {/* Action Button: Lanjut ke Checkout */}
        <Link href="/checkout" className="block">
          <button
            type="button"
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1035D0] hover:bg-[#0D2BAA] disabled:opacity-50 text-white font-sans font-bold text-xs rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
          >
            <span>Lanjut ke Pengiriman &amp; Checkout</span>
            <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
          </button>
        </Link>
      </div>
    </div>
  );
}
