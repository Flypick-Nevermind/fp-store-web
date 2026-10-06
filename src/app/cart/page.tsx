"use client";

import { ArrowLeft, PackagePlus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { CartItemCard } from "@/components/cart/cart-item-card";
import { CartSummary } from "@/components/cart/cart-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";
import { useCartStore } from "@/store/use-cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const buyForMeItems = items.filter((i) => i.serviceType === "BUY_FOR_ME");
  const forwardingItems = items.filter((i) => i.serviceType === "FORWARDING");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Bar */}
      <div className="bg-[#FFF8E1] border-2 border-[#1A1A24] p-4 sm:p-6 shadow-[4px_4px_0px_0px_#2323FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-mono text-xs text-[#2323FF] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Intake Hub
            </Link>
            <span className="text-[#1A1A24]/40">/</span>
            <span className="font-mono text-xs text-[#1A1A24]/70">
              Terminal Konsolidasi
            </span>
          </div>
          <h1 className="font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1A24] flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#2323FF]" />
            Keranjang Konsolidasi Pesanan
          </h1>
          <p className="text-xs text-[#1A1A24]/75 mt-1 font-sans">
            Semua paket di bawah ini akan digabungkan menjadi satu manifest
            kargo di Shanghai Hub sebelum diterbangkan ke Indonesia.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="paper"
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:border-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Kosongkan Keranjang
            </Button>
          </div>
        )}
      </div>

      {/* Main Layout: Cart List + Sidebar Summary */}
      {items.length === 0 ? (
        <div className="bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF] mx-auto flex items-center justify-center text-[#2323FF]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-mono text-lg font-bold uppercase text-[#1A1A24]">
              Keranjang Konsolidasi Anda Masih Kosong
            </h2>
            <p className="text-xs text-[#1A1A24]/70 max-w-md mx-auto">
              Belum ada tiket titip beli atau resi titip kirim yang ditambahkan.
              Gunakan formulir Intake Hub untuk memasukkan link atau resi.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button variant="neon" size="lg">
                <PackagePlus className="w-4 h-4 mr-2" />
                BUKA INTAKE HUB SEKARANG
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Exchange Rate & Status Ticker */}
            <div className="p-3.5 bg-[#FFF8E1] border-2 border-dashed border-[#2323FF] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
                <span className="font-bold text-[#1A1A24]">
                  KURS PENUKARAN AKTIF:
                </span>
                <span className="text-[#2323FF] font-black">
                  1 CNY = Rp{" "}
                  {BRANDING.exchangeRate.cnyToIdr.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex gap-2">
                <Badge variant="neon">{buyForMeItems.length} Titip Beli</Badge>
                <Badge variant="orange">
                  {forwardingItems.length} Titip Kirim
                </Badge>
              </div>
            </div>

            {/* List of Boarding Pass Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Add More Action */}
            <div className="pt-2">
              <Link href="/">
                <Button variant="paper" size="md" className="w-full">
                  <PackagePlus className="w-4 h-4 mr-2 text-[#2323FF]" />+
                  TAMBAH BARANG LAIN (PASTE LINK / RESI LAIN)
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Consolidation Review Summary */}
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
