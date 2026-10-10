"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  MessageSquare,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRANDING } from "@/config/branding";
import { cn } from "@/lib/utils";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter submissions by current user or query
  const userSubmissions = allSubmissions.filter((sub) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
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

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
      `${targetLinks.length} barang siap dibeli ditambahkan ke keranjang belanja Anda.`,
    );

    router.push("/cart");
  };

  return (
    <div className="space-y-4 text-left">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
            Daftar Pengajuan Cek Link ({userSubmissions.length})
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Klik pengajuan untuk melihat hasil cek ketersediaan stok &amp; harga
            oleh admin.
          </p>
        </div>

        <div className="relative sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID atau nama..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-[#1035D0] shadow-2xs"
          />
        </div>
      </div>

      {/* Submissions List */}
      {userSubmissions.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">
              Belum Ada Pengajuan Link
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
              Tempel link produk dari Taobao atau 1688 di halaman utama untuk
              memulai pengecekan gratis.
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
      ) : (
        <div className="space-y-3">
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
                  "bg-white rounded-2xl border transition-all overflow-hidden",
                  isExpanded
                    ? "border-[#1035D0]/40 shadow-sm"
                    : "border-slate-200/90 shadow-2xs hover:border-slate-300",
                )}
              >
                {/* Header Strip */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(sub.id)}
                    className="flex-1 text-left flex items-start sm:items-center gap-3 cursor-pointer group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#1035D0] group-hover:underline">
                          {sub.id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          • {sub.links.length} Link Produk
                        </span>
                        {readyLinks.length > 0 && isReviewed && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {readyLinks.length} Stok Ready
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">
                        {new Date(sub.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • Pemesan: <strong>{sub.userName}</strong>
                      </p>
                    </div>
                  </button>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {sub.status === "PENDING_REVIEW" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/80">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        Sedang Diproses
                      </span>
                    )}
                    {sub.status === "REVIEWED" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-[#1035D0] text-xs font-bold border border-blue-200/80">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sudah Dicek
                      </span>
                    )}
                    {sub.status === "NOTIFIED" && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hasil Terkirim
                      </span>
                    )}

                    {/* Quick Add To Cart Button */}
                    {isReviewed && readyLinks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(sub)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1035D0] hover:bg-[#0A2699] text-white font-sans text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>Beli ({readyLinks.length})</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-3 animate-in fade-in duration-150">
                    {/* Overall Admin Note */}
                    {sub.overallAdminNotes && (
                      <div className="p-3 bg-blue-50/90 rounded-xl text-xs text-slate-800 border border-blue-200/60 leading-relaxed">
                        <span className="font-bold text-[#1035D0] block text-[11px] mb-0.5">
                          💬 Catatan dari Admin FLYPICK:
                        </span>
                        {sub.overallAdminNotes}
                      </div>
                    )}

                    {/* Links List */}
                    <div className="space-y-2">
                      {sub.links.map((link, idx) => (
                        <div
                          key={link.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-slate-400 text-xs font-bold shrink-0">
                                #{idx + 1}
                              </span>
                              <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded shrink-0">
                                {link.domain || "China Store"}
                              </span>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-slate-700 hover:text-[#1035D0] truncate underline inline-flex items-center gap-1"
                              >
                                <span className="truncate max-w-[200px] sm:max-w-md">
                                  {link.url}
                                </span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </div>

                            {/* Status and Action */}
                            <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                              {link.status === "AVAILABLE" && (
                                <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  ✓ Stok Ready
                                </span>
                              )}
                              {link.status === "UNAVAILABLE" && (
                                <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                  ✕ Stok Habis
                                </span>
                              )}
                              {link.status === "NEEDS_CONFIRMATION" && (
                                <span className="text-amber-700 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  ⚠ Konfirmasi
                                </span>
                              )}
                              {link.status === "PENDING" && (
                                <span className="text-slate-500 font-medium text-xs bg-slate-100 px-2 py-0.5 rounded">
                                  ⏳ Menunggu Cek
                                </span>
                              )}

                              {link.status === "AVAILABLE" && (
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(sub, link)}
                                  className="text-xs text-[#1035D0] hover:underline font-bold cursor-pointer"
                                >
                                  + Beli Ini
                                </button>
                              )}
                            </div>
                          </div>

                          {/* User Note */}
                          {link.userNotes && (
                            <p className="text-slate-500 text-[11px] bg-slate-50 px-2.5 py-1 rounded-lg">
                              <strong>Catatan Varian:</strong> {link.userNotes}
                            </p>
                          )}

                          {/* Admin Feedback */}
                          {(link.adminNotes || link.priceCny) && (
                            <div className="p-2.5 bg-[#FFFDE7] rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              {link.adminNotes && (
                                <p className="flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span>{link.adminNotes}</span>
                                </p>
                              )}
                              {link.priceCny && (
                                <p className="font-bold text-[#1035D0] shrink-0 font-mono">
                                  ¥{link.priceCny} CNY (Rp{" "}
                                  {(
                                    link.priceIdr ||
                                    link.priceCny *
                                      BRANDING.exchangeRate.cnyToIdr
                                  ).toLocaleString("id-ID")}
                                  )
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      {isReviewed && readyLinks.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(sub)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1035D0] hover:bg-[#0A2699] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 text-[#00F0FF]" />
                          <span>
                            Lanjut ke Keranjang (Rp{" "}
                            {totalReadyPriceIdr.toLocaleString("id-ID")})
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div />
                      )}

                      <a
                        href={`https://wa.me/6281299887766?text=${encodeURIComponent(
                          `Halo Admin FLYPICK, saya ingin menanyakan pengajuan link ${sub.id}.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-emerald-600 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
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
