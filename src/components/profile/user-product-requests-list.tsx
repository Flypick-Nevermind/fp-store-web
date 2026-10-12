"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  MessageSquare,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRANDING } from "@/config/branding";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useProductRequestStore } from "@/store/use-product-request-store";
import type { CartItem } from "@/types";
import type {
  ProductRequestRecord,
  ProductRequestStatus,
  SourcingResultItem,
} from "@/types/product-request";

export function UserProductRequestsList() {
  const router = useRouter();
  const { success, info } = useToast();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const allRequests = useProductRequestStore((s) => s.requests);
  const deleteProductRequest = useProductRequestStore(
    (s) => s.deleteProductRequest,
  );
  const addItem = useCartStore((s) => s.addItem);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | ProductRequestStatus
  >("ALL");

  // Filter requests
  const filteredRequests = allRequests.filter((req) => {
    // User scope
    if (isAuthenticated && user) {
      const matchUser =
        req.userId === user.id ||
        (user.phone && req.userPhone.includes(user.phone.replace(/\D/g, ""))) ||
        (user.email &&
          req.userEmail &&
          req.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.warehouseCode && req.warehouseCode === user.warehouseCode);

      if (!matchUser) return false;
    }

    // Status filter
    if (statusFilter !== "ALL" && req.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        req.id.toLowerCase().includes(q) ||
        req.productName.toLowerCase().includes(q) ||
        req.category.toLowerCase().includes(q) ||
        req.userPhone.includes(q)
      );
    }

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAddSourcedToCart = (
    req: ProductRequestRecord,
    sourcedItem: SourcingResultItem,
  ) => {
    const cny = sourcedItem.priceCny || 99;
    const idr =
      sourcedItem.priceIdr || Math.round(cny * BRANDING.exchangeRate.cnyToIdr);

    const cartItem: CartItem = {
      id: `FP-BFM-${req.id.replace(/\D/g, "").slice(-4)}-${Date.now().toString().slice(-4)}`,
      serviceType: "BUY_FOR_ME",
      sourceUrl: sourcedItem.url,
      productName: `${sourcedItem.platform} - ${sourcedItem.title}`,
      priceCny: cny,
      exchangeRate: BRANDING.exchangeRate.cnyToIdr,
      priceIdr: idr,
      selectedVariant: {
        color: req.specificationNotes || "Sesuai Request Sourcing",
        size: "",
        skuId: `SKU-${req.id.replace(/\D/g, "").slice(-4)}`,
      },
      quantity: 1,
      notes: `Sourcing ID: ${req.id} | Supplier: ${sourcedItem.supplierName || "China Direct"}`,
      imageUrl:
        req.referenceImage ||
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    };

    addItem(cartItem);
    success(
      "Masuk Keranjang!",
      `Produk hasil sourcing "${sourcedItem.title.slice(0, 30)}..." telah ditambahkan ke keranjang belanja.`,
    );
    router.push("/cart");
  };

  const handleDeleteRequest = (e: React.MouseEvent, reqId: string) => {
    e.stopPropagation();
    deleteProductRequest(reqId);
    info("Request Dihapus", `Permintaan produk #${reqId} telah dihapus.`);
  };

  const getStatusBadge = (status: ProductRequestStatus) => {
    switch (status) {
      case "PENDING_SOURCING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Antrian Sourcing</span>
          </span>
        );
      case "SOURCING_IN_PROGRESS":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-blue-50 text-[#1035D0] border border-blue-200/80 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#1035D0] animate-spin" />
            <span>Sedang Dicari di China</span>
          </span>
        );
      case "SOURCED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Supplier Ditemukan</span>
          </span>
        );
      case "UNAVAILABLE":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200">
            <span>Stok Pabrik Kosong</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Bar: Search & Action ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID request, nama barang, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | ProductRequestStatus)
            }
            className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#1035D0] cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING_SOURCING">Antrian Sourcing</option>
            <option value="SOURCING_IN_PROGRESS">Sedang Dicari</option>
            <option value="SOURCED">Supplier Ditemukan</option>
            <option value="UNAVAILABLE">Belum Ditemukan</option>
          </select>

          <Link
            href="/?tab=request"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1035D0] text-white text-xs font-bold shadow-xs hover:bg-[#0D2CA8] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Request Baru</span>
          </Link>
        </div>
      </div>

      {/* ── Requests Cards List ───────────────────────────────────── */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1035D0]">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-sans font-bold text-base text-slate-900">
              Belum Ada Request Produk
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Punya barang impian atau produk viral yang ingin dicari langsung
              ke supplier pabrik di China? Ajukan request gratis sekarang.
            </p>
          </div>
          <Link
            href="/?tab=request"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1035D0] text-white text-xs font-bold hover:bg-[#0D2CA8] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Ajukan Request Produk Pertama</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isExpanded = expandedId === req.id;
            const hasSourcedResults = req.sourcingResults.length > 0;

            return (
              <div
                key={req.id}
                className={cn(
                  "bg-white rounded-3xl border transition-all duration-200 overflow-hidden",
                  hasSourcedResults
                    ? "border-emerald-200/90 shadow-[0_8px_24px_-6px_rgba(16,185,129,0.12)]"
                    : "border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)]",
                )}
              >
                {/* ── Card Header ── */}
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1035D0] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                        {req.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(req.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(req.status)}
                    </div>
                  </div>

                  {/* ── Main Body Row ── */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 flex-1">
                      {/* Photo Thumbnail if available */}
                      {req.referenceImage ? (
                        <img
                          src={req.referenceImage}
                          alt={req.productName}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <Package className="w-7 h-7 text-slate-300" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold uppercase">
                            {req.category}
                          </span>
                          {req.targetQuantity && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              Qty: <strong>{req.targetQuantity}</strong>
                            </span>
                          )}
                        </div>

                        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 leading-snug">
                          {req.productName}
                        </h3>

                        {req.targetBudget && (
                          <p className="text-xs text-slate-500 font-medium">
                            Target Budget:{" "}
                            <span className="text-emerald-700 font-bold">
                              {req.targetBudget}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => toggleExpand(req.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? "Tutup" : "Lihat Detail"}</span>
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            isExpanded ? "rotate-180" : "",
                          )}
                        />
                      </button>

                      {hasSourcedResults && (
                        <button
                          type="button"
                          onClick={() =>
                            handleAddSourcedToCart(req, req.sourcingResults[0])
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Order Sekarang</span>
                        </button>
                      )}

                      {/* Delete Request Card Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteRequest(e, req.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Hapus permintaan produk ini"
                        aria-label="Hapus request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Expanded Content (Notes, Links, Admin Results) ── */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: User Request Specs */}
                      <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                          Catatan Spesifikasi Pengaju
                        </span>
                        <p className="text-slate-800 leading-relaxed font-sans">
                          {req.specificationNotes ||
                            "Tidak ada catatan spesifikasi tambahan."}
                        </p>

                        {req.referenceLink && (
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-mono text-slate-400 block">
                              Link Contoh:
                            </span>
                            <a
                              href={req.referenceLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#1035D0] hover:underline flex items-center gap-1 truncate font-mono text-[11px] pt-0.5"
                            >
                              <span className="truncate">
                                {req.referenceLink}
                              </span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                          <p>
                            Pengirim: <strong>{req.userName}</strong>
                          </p>
                          <p>
                            WhatsApp: <strong>{req.userPhone}</strong>
                          </p>
                          {req.userEmail && (
                            <p>
                              Email: <strong>{req.userEmail}</strong>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Sourcing Progress & Admin Notes */}
                      <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] font-mono font-bold text-[#1035D0] block uppercase flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Laporan Tim Sourcing Flypick</span>
                        </span>

                        {req.adminNotes ? (
                          <p className="text-slate-800 leading-relaxed font-sans">
                            {req.adminNotes}
                          </p>
                        ) : (
                          <p className="text-slate-400 italic">
                            Tim kami sedang memeriksa database pabrik di
                            Yiwu/Guangzhou/Shenzhen. Update akan segera muncul
                            di sini.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sourced Items List */}
                    {hasSourcedResults && (
                      <div className="space-y-2.5 pt-2">
                        <span className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1.5 uppercase">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Pilihan Supplier / Penawaran Ditemukan:</span>
                        </span>

                        <div className="space-y-2">
                          {req.sourcingResults.map((src) => (
                            <div
                              key={src.id}
                              className="bg-white rounded-2xl border border-emerald-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-emerald-300 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-200">
                                    {src.platform}
                                  </span>
                                  {src.supplierName && (
                                    <span className="text-[11px] font-semibold text-slate-700">
                                      {src.supplierName}
                                    </span>
                                  )}
                                  {src.minOrder && (
                                    <span className="text-[11px] text-slate-400">
                                      MOQ: {src.minOrder}
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {src.title}
                                </h4>

                                {src.notes && (
                                  <p className="text-xs text-slate-500">
                                    {src.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                                <div className="text-right">
                                  <span className="font-mono text-xs font-bold text-amber-600">
                                    ¥{src.priceCny}
                                  </span>
                                  <span className="text-xs font-bold text-emerald-600 block">
                                    Rp {src.priceIdr.toLocaleString("id-ID")}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAddSourcedToCart(req, src)
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-[#1035D0] hover:bg-[#0D2CA8] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Beli Produk Ini</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
