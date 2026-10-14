"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogIn,
  MessageSquare,
  PackageSearch,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRANDING } from "@/config/branding";
import { useUserCartsQuery } from "@/hooks/use-cart-api";
import { extractCartImageUrl, parsePrice } from "@/lib/api/cart";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import type { CartItem } from "@/types";
import type { CartWithImagesItem } from "@/types/api";

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("taobao")) return "Taobao";
    if (parsed.hostname.includes("tmall")) return "Tmall";
    if (parsed.hostname.includes("1688")) return "1688";
    if (
      parsed.hostname.includes("pinduoduo") ||
      parsed.hostname.includes("yangkeduo")
    )
      return "Pinduoduo";
    if (parsed.hostname.includes("alibaba")) return "Alibaba";
    return parsed.hostname.replace("www.", "");
  } catch {
    return "Toko China";
  }
}

export function UserSubmissionsList() {
  const router = useRouter();
  const { success, info } = useToast();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const [searchQuery, setSearchQuery] = useState("");

  // Directly fetch all carts owned by the logged-in user from backend
  const {
    data: carts = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useUserCartsQuery(user?.id);

  const handleManualSync = async () => {
    try {
      const res = await refetch();
      if (res.data && res.data.length > 0) {
        success(
          "Sinkronisasi Berhasil",
          `${res.data.length} item pengajuan berhasil diperbarui dari server backend.`,
        );
      } else {
        info(
          "Sinkronisasi Selesai",
          "Data pengajuan Anda sudah yang paling baru.",
        );
      }
    } catch {
      info(
        "Status Server",
        "Gagal menghubungi server. Silakan coba beberapa saat lagi.",
      );
    }
  };

  const handleAddToCart = (cart: CartWithImagesItem) => {
    const { priceIdr, priceCny } = parsePrice(cart.cart_price);
    const imageUrl = extractCartImageUrl(cart.cart_images);
    const domain = extractDomain(cart.cart_url);

    const cartItem: CartItem = {
      id: `FP-BFM-${cart.cart_id}`,
      serviceType: "BUY_FOR_ME",
      sourceUrl: cart.cart_url,
      productName: cart.cart_title || `${domain} - Pengecekan #${cart.cart_id.slice(0, 8)}`,
      priceCny,
      exchangeRate: BRANDING.exchangeRate.cnyToIdr,
      priceIdr,
      selectedVariant: {
        color: "Sesuai Pengecekan Admin",
        size: "Standard",
        skuId: `SKU-${cart.cart_id.slice(0, 8).toUpperCase()}`,
      },
      quantity: 1,
      notes: `Terverifikasi oleh Tim Admin Flypick (ID: ${cart.cart_id.slice(0, 8)})`,
      imageUrl,
    };

    addItem(cartItem);
    success(
      "Barang Masuk Keranjang!",
      `${cartItem.productName} berhasil ditambahkan ke keranjang belanja.`,
    );
    router.push("/cart");
  };

  // Filter carts by search query
  const filteredCarts = carts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.cart_id.toLowerCase().includes(q) ||
      (c.cart_title && c.cart_title.toLowerCase().includes(q)) ||
      (c.cart_url && c.cart_url.toLowerCase().includes(q))
    );
  });

  // Calculate status counts
  const readyCount = carts.filter((c) => {
    const { priceCny } = parsePrice(c.cart_price);
    return priceCny > 0 && c.cart_title && !c.cart_title.toLowerCase().includes("marketplace china");
  }).length;

  const pendingCount = carts.length - readyCount;

  // 1. Not Authenticated State
  if (!isAuthenticated || !user) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-[#1035D0]">
          <LogIn className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
            Masuk untuk Melihat Status Cek Link
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Data pengecekan link produk dari Taobao dan 1688 tersimpan langsung di server akun FLYPICK Anda.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1035D0] hover:bg-[#0A2699] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <span>Masuk ke Akun Anda</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {/* ── Top Header & Filter Bar ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
              Daftar Pengajuan Cek Link ({carts.length})
            </h3>
            {readyCount > 0 && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {readyCount} Siap Beli
              </span>
            )}
            {pendingCount > 0 && (
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {pendingCount} Diproses
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Data real-time dari server Flypick. Status langsung terupdate setelah divalidasi oleh tim admin.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            title="Muat ulang data dari server"
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5 text-[#1035D0]",
                isFetching && "animate-spin",
              )}
            />
            <span>{isFetching ? "Menyinkronkan..." : "Sinkronkan Status"}</span>
          </button>

          <div className="relative sm:w-60 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau link..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-[#1035D0] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ── Loading Skeleton ─────────────────────────────────────── */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="p-4 bg-white rounded-2xl border border-slate-200 animate-pulse flex items-start gap-4"
            >
              <div className="w-20 h-20 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ─────────────────────────────────────────── */}
      {!isLoading && isError && (
        <div className="p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
          <p className="font-bold text-sm text-rose-800">
            Gagal Memuat Data Pengajuan dari Server
          </p>
          <p className="text-xs text-rose-600 max-w-sm mx-auto">
            Tidak dapat terhubung ke endpoint kargo server FLYPICK. Periksa koneksi internet Anda atau coba muat ulang.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Muat Ulang</span>
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────────────── */}
      {!isLoading && !isError && carts.length === 0 && (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">
              Belum Ada Pengajuan Link Produk
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
              Tempel link produk dari Taobao, 1688, atau Tmall di halaman utama untuk memulai pengecekan gratis oleh admin.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1035D0] text-white text-xs font-bold rounded-xl hover:bg-[#0A2699] transition-all cursor-pointer shadow-xs"
          >
            <span>+ Ajukan Link Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Search Empty State ──────────────────────────────────── */}
      {!isLoading && !isError && carts.length > 0 && filteredCarts.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          Tidak ditemukan pengajuan dengan kata kunci &quot;{searchQuery}&quot;.
        </div>
      )}

      {/* ── Carts Items List (Direct from Backend) ───────────────── */}
      {!isLoading && !isError && filteredCarts.length > 0 && (
        <div className="space-y-3">
          {filteredCarts.map((cart) => {
            const { priceIdr, priceCny } = parsePrice(cart.cart_price);
            const imageUrl = extractCartImageUrl(cart.cart_images);
            const domain = extractDomain(cart.cart_url);
            const isValidated =
              priceCny > 0 &&
              cart.cart_title &&
              !cart.cart_title.toLowerCase().includes("marketplace china");
            const isInCart = cartItems.some(
              (item) =>
                item.id === `FP-BFM-${cart.cart_id}` ||
                (item.serviceType === "BUY_FOR_ME" &&
                  item.sourceUrl === cart.cart_url),
            );

            return (
              <div
                key={cart.cart_id}
                className={cn(
                  "bg-white rounded-2xl border transition-all overflow-hidden p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-xs",
                  isValidated
                    ? "border-blue-200/90 bg-gradient-to-r from-white via-white to-blue-50/20"
                    : "border-slate-200/90",
                )}
              >
                {/* Left Side: Thumbnail & Product Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={cart.cart_title || "Foto Produk"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Badges strip */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80">
                        {domain}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-500">
                        ID: {cart.cart_id.slice(0, 8).toUpperCase()}
                      </span>
                      {cart.created_at && (
                        <span className="text-[11px] text-slate-400 font-sans">
                          • {new Date(cart.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-sans font-bold text-sm text-slate-900 leading-snug truncate">
                      {cart.cart_title || "Pengecekan Link Produk China"}
                    </h4>

                    {/* Link Url */}
                    <div className="flex items-center gap-1.5">
                      <a
                        href={cart.cart_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-slate-500 hover:text-[#1035D0] truncate underline inline-flex items-center gap-1 text-[11px] max-w-xs sm:max-w-md"
                      >
                        <span className="truncate">{cart.cart_url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    {/* Price and Validation Feedback */}
                    {isValidated ? (
                      <div className="pt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-[#1035D0]">
                          ¥{priceCny} CNY
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          (~Rp {priceIdr.toLocaleString("id-ID")})
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Harga &amp; Stok Terverifikasi
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic pt-0.5">
                        Menunggu penetapan harga &amp; pengecekan stok oleh tim admin...
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Status Badge & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Status Pill */}
                  {isValidated ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1035D0] text-xs font-bold border border-blue-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1035D0]" />
                      Sudah Dicek • Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/80">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      Sedang Diproses
                    </span>
                  )}

                  {/* Action Button */}
                  {isValidated ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(cart)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer",
                        isInCart
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-[#1035D0] hover:bg-[#0A2699] text-white",
                      )}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>{isInCart ? "Tambah Lagi" : "+ Beli Sekarang"}</span>
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/6281299887766?text=${encodeURIComponent(
                        `Halo Admin FLYPICK, saya ingin menanyakan status pengecekan link cart #${cart.cart_id.slice(0, 8)} (${cart.cart_url}).`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-medium border border-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tanya Admin</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
