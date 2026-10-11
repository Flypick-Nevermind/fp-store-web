"use client";

import {
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  Package,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { AdminProductRequestModal } from "@/components/admin/admin-product-request-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useProductRequestStore } from "@/store/use-product-request-store";
import type {
  ProductRequestRecord,
  ProductRequestStatus,
} from "@/types/product-request";

export function AdminProductRequestTable() {
  const { success } = useToast();
  const requests = useProductRequestStore((s) => s.requests);
  const resetToDefaults = useProductRequestStore((s) => s.resetToDefaults);

  const [activeTab, setActiveTab] = useState<"ALL" | ProductRequestStatus>(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  // Statistics count
  const totalCount = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "PENDING_SOURCING",
  ).length;
  const inProgressCount = requests.filter(
    (r) => r.status === "SOURCING_IN_PROGRESS",
  ).length;
  const sourcedCount = requests.filter((r) => r.status === "SOURCED").length;

  const filteredRequests = requests.filter((item) => {
    if (activeTab !== "ALL" && item.status !== activeTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchName = item.userName.toLowerCase().includes(q);
      const matchPhone = item.userPhone.includes(q);
      const matchProduct = item.productName.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);

      return matchId || matchName || matchPhone || matchProduct || matchCat;
    }

    return true;
  });

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const handleResetData = () => {
    resetToDefaults();
    success(
      "Data Direset",
      "Data demo request pencarian produk dikembalikan ke awal.",
    );
  };

  const getStatusBadge = (status: ProductRequestStatus) => {
    switch (status) {
      case "PENDING_SOURCING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Antrian Sourcing</span>
          </span>
        );
      case "SOURCING_IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-blue-50 text-[#1035D0] border border-blue-200">
            <Clock className="w-3 h-3 animate-spin text-[#1035D0]" />
            <span>Sedang Dicari</span>
          </span>
        );
      case "SOURCED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Supplier Ditemukan</span>
          </span>
        );
      case "UNAVAILABLE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200">
            <span>Stok Kosong</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── KPI Stat Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer bg-white",
            activeTab === "ALL"
              ? "border-[#1035D0] ring-2 ring-[#1035D0]/20 shadow-xs"
              : "border-slate-200/80 hover:border-slate-300",
          )}
        >
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block">
            Semua Request
          </span>
          <span className="text-2xl font-black text-slate-900 font-sans mt-1 block">
            {totalCount}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            Total permintaan cari produk
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PENDING_SOURCING")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer bg-white",
            activeTab === "PENDING_SOURCING"
              ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
              : "border-slate-200/80 hover:border-slate-300",
          )}
        >
          <span className="text-[11px] font-mono text-amber-600 uppercase font-bold block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Antrian Sourcing</span>
          </span>
          <span className="text-2xl font-black text-amber-900 font-sans mt-1 block">
            {pendingCount}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            Perlu dicari tim China
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SOURCING_IN_PROGRESS")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer bg-white",
            activeTab === "SOURCING_IN_PROGRESS"
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
              : "border-slate-200/80 hover:border-slate-300",
          )}
        >
          <span className="text-[11px] font-mono text-[#1035D0] uppercase font-bold block">
            Sedang Dicari
          </span>
          <span className="text-2xl font-black text-[#1035D0] font-sans mt-1 block">
            {inProgressCount}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            Negosiasi pabrik Yiwu/1688
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SOURCED")}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all cursor-pointer bg-white",
            activeTab === "SOURCED"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
              : "border-slate-200/80 hover:border-slate-300",
          )}
        >
          <span className="text-[11px] font-mono text-emerald-600 uppercase font-bold block">
            Supplier Ditemukan
          </span>
          <span className="text-2xl font-black text-emerald-800 font-sans mt-1 block">
            {sourcedCount}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            Link &amp; harga siap
          </span>
        </button>
      </div>

      {/* ── Filter Bar & Actions ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID, pemohon, WA, atau nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="paper"
              size="sm"
              onClick={handleResetData}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Demo
            </Button>
          </div>
        </div>

        {/* ── Table Container ──────────────────────────────────────── */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 font-mono text-[11px] text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4 font-bold">ID / Tanggal</th>
                <th className="py-3 px-4 font-bold">Pemohon &amp; Kontak</th>
                <th className="py-3 px-4 font-bold">Produk yang Dicari</th>
                <th className="py-3 px-4 font-bold">Budget &amp; Qty</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Hasil Sourcing</th>
                <th className="py-3 px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada permintaan cari produk yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* ID & Date */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-[#1035D0] block">
                        {req.id}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block font-sans">
                        {req.userName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 block">
                        {req.userPhone}
                      </span>
                      <span className="text-[10px] text-[#1035D0] font-mono uppercase">
                        Notif: {req.notificationPreference}
                      </span>
                    </td>

                    {/* Product & Category */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        {req.referenceImage && (
                          <img
                            src={req.referenceImage}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block truncate">
                            {req.productName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {req.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Budget & Qty */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-700 block">
                        {req.targetBudget || "-"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Qty: {req.targetQuantity || "1 pcs"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">{getStatusBadge(req.status)}</td>

                    {/* Sourcing Found count */}
                    <td className="py-3 px-4">
                      {req.sourcingResults.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
                          {req.sourcingResults.length} Supplier Siap
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Belum ada
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        type="button"
                        variant="electric"
                        size="sm"
                        onClick={() => setSelectedRequestId(req.id)}
                        className="text-xs font-bold shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Kelola</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Sourcing Modal */}
      <AdminProductRequestModal
        isOpen={!!selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        request={selectedRequest || null}
      />
    </div>
  );
}
