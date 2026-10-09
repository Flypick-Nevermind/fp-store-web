"use client";

import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  MessageSquare,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRANDING } from "@/config/branding";
import { cn, formatIdr } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useSubmissionStore } from "@/store/use-submission-store";
import type { CartItem } from "@/types";
import type { SubmissionItemLink, SubmissionRecord } from "@/types/submission";

export function UserSubmissionsList() {
  const router = useRouter();
  const { success, info } = useToast();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const allSubmissions = useSubmissionStore((s) => s.submissions);
  const addItem = useCartStore((s) => s.addItem);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");

  // Filter submissions by current user or search query
  const userSubmissions = allSubmissions.filter((sub) => {
    if (manualQuery.trim()) {
      const q = manualQuery.toLowerCase().trim();
      return (
        sub.id.toLowerCase().includes(q) ||
        sub.userPhone.includes(q) ||
        (sub.userEmail?.toLowerCase().includes(q) ?? false) ||
        sub.userName.toLowerCase().includes(q)
      );
    }

    if (isAuthenticated && user) {
      return (
        sub.userId === user.id ||
        (user.phone && sub.userPhone.includes(user.phone.replace(/\D/g, ""))) ||
        (user.email &&
          sub.userEmail &&
          sub.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.warehouseCode && sub.warehouseCode === user.warehouseCode)
      );
    }

    // Default to recent for preview if guest
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Convert submission link to cart item
  const handleAddToCart = (
    sub: SubmissionRecord,
    singleLink?: SubmissionItemLink,
  ) => {
    const targetLinks = singleLink
      ? [singleLink]
      : sub.links.filter(
          (l) =>
            l.status === "AVAILABLE" ||
            (l.priceCny && l.status !== "UNAVAILABLE"),
        );

    if (targetLinks.length === 0) {
      info(
        "Belum Ada Barang Ready",
        "Belum ada link yang bertanda stok tersedia dalam pengajuan ini.",
      );
      return;
    }

    targetLinks.forEach((link, idx) => {
      const cny = link.priceCny || 88;
      const idr =
        link.priceIdr || Math.round(cny * BRANDING.exchangeRate.cnyToIdr);

      const cartItem: CartItem = {
        id: `FP-BFM-${sub.id.replace(/\D/g, "").slice(-4)}-${idx + 1}-${Date.now().toString().slice(-4)}`,
        serviceType: "BUY_FOR_ME",
        sourceUrl: link.url,
        productName: `${link.domain || "Toko China"} - ${
          link.userNotes ? link.userNotes.slice(0, 36) : `Pengecekan #${sub.id}`
        }`,
        priceCny: cny,
        exchangeRate: BRANDING.exchangeRate.cnyToIdr,
        priceIdr: idr,
        selectedVariant: {
          color: link.userNotes || "Sesuai Catatan Pengajuan",
          size: "",
          skuId: `SKU-${sub.id.replace(/\D/g, "").slice(-4)}-${idx + 1}`,
        },
        quantity: 1,
        notes: link.adminNotes
          ? `Catatan Admin: ${link.adminNotes}`
          : `Terverifikasi dari pengajuan ${sub.id}`,
        imageUrl:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      };

      addItem(cartItem);
    });

    success(
      "Barang Masuk Keranjang!",
      `${targetLinks.length} barang siap dibeli dari pengajuan ${sub.id} berhasil ditambahkan ke keranjang belanja Anda.`,
    );

    router.push("/cart");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE4EC] p-5 sm:p-7 shadow-[0_12px_36px_-8px_rgba(16,53,208,0.08)] space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1035D0] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase text-[#1035D0]">
              VERIFIKASI LINK TITIP BELI
            </span>
          </div>
          <h3 className="font-sans font-black text-lg sm:text-xl text-[#0F172A] mt-1">
            Status Permintaan Cek Link Saya
          </h3>
          <p className="text-xs text-[#64748B] font-sans mt-0.5">
            Pantau hasil pengecekan manual dan catatan harga/stok dari admin
            FLYPICK untuk tautan China Anda.
          </p>
        </div>

        {/* Lookup / Search Input */}
        <div className="relative sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="Cari No. ID atau No. WA..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-[#1035D0] focus:bg-white"
          />
        </div>
      </div>

      {/* Submissions List */}
      {userSubmissions.length === 0 ? (
        <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#CBD5E1] space-y-2">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-[#0F172A]">
            Belum Ada Pengajuan Link
          </p>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Gunakan form di halaman depan untuk mengirimkan link produk
            Taobao/1688 yang ingin Anda beli.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userSubmissions.map((sub) => {
            const isExpanded = expandedId === sub.id;
            const isReviewed =
              sub.status === "REVIEWED" || sub.status === "NOTIFIED";
            const readyLinks = sub.links.filter(
              (l) =>
                l.status === "AVAILABLE" ||
                (l.priceCny && l.status !== "UNAVAILABLE"),
            );
            const totalReadyPriceIdr = readyLinks.reduce(
              (acc, curr) =>
                acc +
                (curr.priceIdr ||
                  Math.round(
                    (curr.priceCny || 0) * BRANDING.exchangeRate.cnyToIdr,
                  )),
              0,
            );

            return (
              <div
                key={sub.id}
                className={cn(
                  "rounded-2xl border transition-all overflow-hidden bg-white shadow-2xs",
                  isReviewed
                    ? "border-blue-200 hover:border-[#1035D0]"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                {/* Header row clickable */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(sub.id)}
                    className="flex-1 text-left flex items-start sm:items-center gap-3 cursor-pointer group"
                  >
                    <span className="w-9 h-9 rounded-full bg-[#1035D0]/10 border border-[#1035D0]/20 flex items-center justify-center text-[#1035D0] font-bold font-mono text-xs shrink-0 group-hover:scale-105 transition-transform">
                      FP
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-[#0F172A] group-hover:text-[#1035D0] transition-colors">
                          {sub.id}
                        </span>
                        <span className="text-xs text-slate-500 font-sans">
                          • {sub.links.length} Link Produk
                        </span>
                        {sub.warehouseCode && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                            {sub.warehouseCode}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-[#64748B] mt-0.5">
                        Diajukan:{" "}
                        {new Date(sub.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </button>

                  {/* Right Status Badge & Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    {sub.status === "PENDING_REVIEW" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Sedang Kami Proses
                      </span>
                    )}
                    {sub.status === "REVIEWED" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1035D0] font-mono text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sudah Dicek Admin
                      </span>
                    )}
                    {sub.status === "NOTIFIED" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold">
                        <Bell className="w-3.5 h-3.5" />
                        Notifikasi Terkirim
                      </span>
                    )}

                    {/* Quick Cart Button in Header if Ready */}
                    {isReviewed && readyLinks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(sub)}
                        className="px-3 py-1 rounded-full bg-[#1035D0] hover:bg-[#0A2699] text-white font-sans text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Masukkan barang siap dibeli ke keranjang"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>Beli ({readyLinks.length})</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(sub.id)}
                      className="p-1 text-slate-400 hover:text-[#1035D0] transition-colors cursor-pointer"
                      aria-label="Detail pengajuan"
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isExpanded ? "rotate-180 text-[#1035D0]" : "",
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40 space-y-4 animate-in fade-in duration-150">
                    {/* Overall Admin Note if any */}
                    {sub.overallAdminNotes && (
                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                        <span className="font-mono text-[10px] font-bold text-[#1035D0] uppercase block">
                          Pesan Tim Admin FLYPICK:
                        </span>
                        <p className="text-slate-800 font-sans leading-relaxed">
                          {sub.overallAdminNotes}
                        </p>
                      </div>
                    )}

                    {/* Links inspection breakdown */}
                    <div className="space-y-3">
                      <p className="font-mono text-xs font-bold uppercase text-[#334155]">
                        Rincian Hasil Pengecekan per Link:
                      </p>

                      {sub.links.map((link, idx) => (
                        <div
                          key={link.id}
                          className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-[#1035D0] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                {link.domain || "Store"}
                              </span>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-slate-800 hover:text-[#1035D0] underline truncate max-w-xs sm:max-w-md inline-flex items-center gap-1"
                              >
                                <span className="truncate">{link.url}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </div>

                            {/* Status tag & single buy action */}
                            <div className="flex items-center gap-2 shrink-0">
                              {link.status === "AVAILABLE" && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                                  ✓ Stok Tersedia
                                </span>
                              )}
                              {link.status === "UNAVAILABLE" && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-200">
                                  ✕ Stok Habis
                                </span>
                              )}
                              {link.status === "NEEDS_CONFIRMATION" && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
                                  ⚠ Perlu Konfirmasi
                                </span>
                              )}
                              {link.status === "PENDING" && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                                  ⏳ Menunggu Pengecekan
                                </span>
                              )}

                              {link.status === "AVAILABLE" && (
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(sub, link)}
                                  className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1035D0] font-sans font-bold text-[11px] border border-[#BFDBFE] transition-colors cursor-pointer"
                                >
                                  + Beli Link Ini
                                </button>
                              )}
                            </div>
                          </div>

                          {/* User Request */}
                          {link.userNotes && (
                            <p className="text-[#64748B] text-[11px]">
                              <strong>Request Anda:</strong> {link.userNotes}
                            </p>
                          )}

                          {/* Admin Feedback Box */}
                          {link.adminNotes ? (
                            <div className="p-2.5 bg-[#FFF8E1] rounded-lg border border-amber-200 text-xs text-[#0F172A] space-y-1">
                              <span className="font-mono text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                Catatan Admin FLYPICK:
                              </span>
                              <p className="font-medium">{link.adminNotes}</p>
                              {link.priceCny && (
                                <p className="font-mono text-[#1035D0] font-bold text-[11px] pt-1">
                                  Estimasi Harga: ¥{link.priceCny} CNY (Rp{" "}
                                  {(
                                    link.priceIdr ||
                                    link.priceCny *
                                      BRANDING.exchangeRate.cnyToIdr
                                  ).toLocaleString("id-ID")}
                                  )
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              Belum ada catatan admin untuk tautan ini.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Prominent Checkout Conversion Banner */}
                    {isReviewed && readyLinks.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 rounded-2xl border-2 border-[#1035D0]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                        <div>
                          <div className="flex items-center gap-1.5 font-sans font-black text-sm text-[#0F172A]">
                            <ShoppingBag className="w-4 h-4 text-[#1035D0]" />
                            <span>{readyLinks.length} Produk Siap Dibeli</span>
                          </div>
                          <p className="text-xs text-[#64748B] font-sans mt-0.5">
                            Total estimasi barang:{" "}
                            <strong className="font-mono text-[#1035D0]">
                              {formatIdr(totalReadyPriceIdr)}
                            </strong>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(sub)}
                          className="px-5 py-2.5 rounded-xl bg-[#1035D0] hover:bg-[#0A2699] text-white font-sans text-xs font-bold transition-all shadow-md shadow-[#1035D0]/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <ShoppingCart className="w-4 h-4 text-[#00F0FF]" />
                          <span>Lanjut ke Keranjang &amp; Checkout</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Bottom WhatsApp Contact Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-600">
                        Ada pertanyaan atau ingin konfirmasi pembelian lewat
                        chat? Hubungi CS kami:
                      </p>
                      <a
                        href={`https://wa.me/6281299887766?text=${encodeURIComponent(
                          `Halo Admin FLYPICK, saya ingin konfirmasi pesanan untuk pengajuan cek link ${sub.id}.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp Admin</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
