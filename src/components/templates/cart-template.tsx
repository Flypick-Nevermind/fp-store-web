"use client";

import { ArrowLeft, PackagePlus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms";
import { EmptyState } from "@/components/molecules";
import { CartItemCard } from "@/components/organisms/cart-item-card";
import { CartSummary } from "@/components/organisms/cart-summary";
import { BRANDING } from "@/config/branding";
import { useCartActions } from "@/hooks/use-cart-actions";

export function CartTemplate() {
  const { items, clearCart } = useCartActions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* ── Header Bar ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-6 shadow-[0_12px_28px_-6px_rgba(16,53,208,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-sans text-xs text-[#1035D0] hover:underline font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Depan
            </Link>
            <span className="text-[#94A3B8]">/</span>
            <span className="font-sans text-xs text-[#64748B]">
              Keranjang Konsolidasi
            </span>
          </div>

          <h1 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#1035D0]" />
            Keranjang Belanja (1 Link = 1 Varian)
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-sans">
            Setiap link produk mewakili 1 varian. Anda dapat mengatur kuantitas
            (quantity) per link sebelum memilih tiket pengiriman.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1035D0] border border-[#BFDBFE] text-xs font-bold transition-colors cursor-pointer"
            >
              <PackagePlus className="w-4 h-4 text-[#1035D0]" />
              <span>+ Tambah Link Lagi dari Depan</span>
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content: Cart Items + Sidebar ───────────────────── */}
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10 text-[#1035D0]" />}
          title="Keranjang Anda Masih Kosong"
          description="Belum ada link Taobao, Pinduoduo, atau 1688 yang dimasukkan. Buka halaman depan untuk menempel link produk."
          actionText="+ TEMPEL LINK PRODUK DI DEPAN"
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Live Exchange Rate Ticker */}
            <div className="p-3.5 bg-white rounded-xl border border-[#DCE4EC] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1035D0] animate-pulse" />
                <span className="font-bold text-[#0F172A]">
                  KURS CNY AKTIF:
                </span>
                <span className="text-[#1035D0] font-black">
                  ¥1 CNY = Rp{" "}
                  {BRANDING.exchangeRate.cnyToIdr.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex gap-2">
                <Badge variant="neon">{items.length} Link Terdaftar</Badge>
              </div>
            </div>

            {/* List of 1 Link = 1 Variant Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom Add Link Banner */}
            <div className="pt-2">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] hover:border-[#1035D0] rounded-2xl text-xs font-bold text-[#1035D0] transition-colors cursor-pointer"
              >
                <PackagePlus className="w-4 h-4" />
                <span>+ Tempel Link Tambahan ke Halaman Depan</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Cart Summary Sidebar */}
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
