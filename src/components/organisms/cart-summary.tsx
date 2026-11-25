"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader2, Plane, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/atoms";
import { useCartActions } from "@/hooks/use-cart-actions";
import {
  checkExchangeRateActiveApi,
  getExchangeRateApi,
} from "@/lib/api/settings";
import { formatCny, formatIdr } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useCartStore } from "@/store/use-cart-store";
import { useExchangeRateStore } from "@/store/use-exchange-rate-store";

export function CartSummary() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { info } = useToast();
  const [checkingRate, setCheckingRate] = useState(false);
  const recalculateExchangeRate = useCartStore(
    (s) => s.recalculateExchangeRate,
  );
  const {
    items,
    itemCount,
    subtotalIdr,
    serviceFeeIdr,
    totalStage1Idr,
    buyForMeCny,
  } = useCartActions();

  const handleProceedToCheckout = async () => {
    if (items.length === 0 || checkingRate) return;

    setCheckingRate(true);
    try {
      const { historyId, cnyToIdr, setExchangeRate } =
        useExchangeRateStore.getState();

      if (historyId !== null) {
        const res = await checkExchangeRateActiveApi(historyId);
        const activeRate = Math.round(res.active_rate);
        const hasOutdatedItem = items.some(
          (item) =>
            item.serviceType === "BUY_FOR_ME" &&
            Math.round(item.exchangeRate) !== activeRate,
        );

        const rateChanged = activeRate !== Math.round(cnyToIdr);
        if (rateChanged || hasOutdatedItem) {
          const latest = await getExchangeRateApi();
          const finalRate = latest.isSyncedFromServer ? latest.rate : activeRate;
          setExchangeRate(finalRate, {
            historyId: latest.historyId ?? (res.active ? res.history_id : null),
            updatedAt: latest.updatedAt ?? res.rate_updated_at,
            updatedBy: latest.updatedBy,
            isSyncedFromServer: true,
          });
          recalculateExchangeRate(finalRate);
          await queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
          info(
            "Kurs CNY Diperbarui",
            `Kurs berubah menjadi Rp ${finalRate.toLocaleString("id-ID")}/CNY. Perhitungan harga keranjang telah disesuaikan.`,
          );
          return;
        }
      } else {
        const latest = await getExchangeRateApi();
        if (latest.isSyncedFromServer) {
          const hasOutdatedItem = items.some(
            (item) =>
              item.serviceType === "BUY_FOR_ME" &&
              Math.round(item.exchangeRate) !== latest.rate,
          );
          setExchangeRate(latest.rate, {
            historyId: latest.historyId ?? null,
            updatedAt: latest.updatedAt,
            updatedBy: latest.updatedBy,
            isSyncedFromServer: true,
          });
          if (latest.rate !== Math.round(cnyToIdr) || hasOutdatedItem) {
            recalculateExchangeRate(latest.rate);
            await queryClient.invalidateQueries({ queryKey: ["exchange-rate"] });
            info(
              "Kurs CNY Diperbarui",
              `Kurs berubah menjadi Rp ${latest.rate.toLocaleString("id-ID")}/CNY. Perhitungan harga keranjang telah disesuaikan.`,
            );
            return;
          }
        }
      }

      router.push("/checkout");
    } catch {
      // Fall back to proceeding if the rate-check endpoint is temporarily unreachable
      router.push("/checkout");
    } finally {
      setCheckingRate(false);
    }
  };

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
          {items.length} LINK{" "}
          {itemCount > items.length ? `(${itemCount} PCS)` : "TERDAFTAR"}
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

          {serviceFeeIdr > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Handling &amp; Konsolidasi:</span>
              <span className="font-mono font-bold text-[#0F172A]">
                {formatIdr(serviceFeeIdr)}
              </span>
            </div>
          )}

          {/* Packaging option summary */}
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
            <span className="text-[#64748B] flex items-center gap-1">
              <span>Kemasan:</span>
            </span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-[#1035D0] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {items.filter((i) => (i.packagingOption || "WITH_BOX") === "WITH_BOX").length} With Box
              </span>
              {items.filter((i) => i.packagingOption === "NO_BOX").length > 0 && (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {items.filter((i) => i.packagingOption === "NO_BOX").length} No Box
                </span>
              )}
            </div>
          </div>

          {/* Subtotal Stage 1 */}
          <div className="pt-3 border-t border-dashed border-[#CBD5E1] flex items-baseline justify-between">
            <div>
              <p className="font-sans font-bold text-xs text-[#0F172A] uppercase">
                Estimasi Tahap 1:
              </p>
              <p className="text-[11px] text-[#64748B]">
                (Total Harga Produk)
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
        <button
          type="button"
          onClick={handleProceedToCheckout}
          disabled={items.length === 0 || checkingRate}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1035D0] hover:bg-[#0D2BAA] disabled:opacity-50 text-white font-sans font-bold text-xs rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
        >
          {checkingRate ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
              <span>Memeriksa Kurs Terbaru...</span>
            </>
          ) : (
            <>
              <span>Lanjut ke Pengiriman &amp; Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
