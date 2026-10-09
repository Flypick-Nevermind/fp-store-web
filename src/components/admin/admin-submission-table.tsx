"use client";

import {
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  RotateCcw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { AdminReviewDetailModal } from "@/components/admin/admin-review-detail-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useSubmissionStore } from "@/store/use-submission-store";
import type { SubmissionStatus } from "@/types/submission";

export function AdminSubmissionTable() {
  const { success } = useToast();
  const submissions = useSubmissionStore((s) => s.submissions);
  const resetToDefaults = useSubmissionStore((s) => s.resetToDefaults);

  const [activeTab, setActiveTab] = useState<"ALL" | SubmissionStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);

  // Statistics count
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(
    (s) => s.status === "PENDING_REVIEW",
  ).length;
  const reviewedCount = submissions.filter(
    (s) => s.status === "REVIEWED",
  ).length;
  const notifiedCount = submissions.filter(
    (s) => s.status === "NOTIFIED",
  ).length;

  // Filter & search
  const filteredSubmissions = submissions.filter((item) => {
    // Tab filter
    if (activeTab !== "ALL" && item.status !== activeTab) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchName = item.userName.toLowerCase().includes(q);
      const matchPhone = item.userPhone.includes(q);
      const matchEmail = item.userEmail?.toLowerCase().includes(q) || false;
      const matchWarehouse =
        item.warehouseCode?.toLowerCase().includes(q) || false;
      const matchLink = item.links.some(
        (l) =>
          l.url.toLowerCase().includes(q) ||
          l.userNotes?.toLowerCase().includes(q),
      );

      return (
        matchId ||
        matchName ||
        matchPhone ||
        matchEmail ||
        matchWarehouse ||
        matchLink
      );
    }

    return true;
  });

  const handleResetData = () => {
    resetToDefaults();
    success(
      "Data Direset",
      "Daftar pengajuan dikembalikan ke contoh default untuk demonstrasi.",
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Top Metric Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card: Total */}
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "p-4 rounded-2xl border transition-all cursor-pointer bg-white text-left",
              activeTab === "ALL"
                ? "border-[#1035D0] ring-2 ring-[#1035D0]/20 shadow-md"
                : "border-[#E2E8F0] hover:border-slate-300",
            )}
          >
            <p className="font-mono text-xs text-[#64748B] uppercase font-bold">
              Total Permintaan
            </p>
            <p className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1 font-mono">
              {totalCount}
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Semua submission
            </p>
          </button>

          {/* Card: Menunggu Cek */}
          <button
            type="button"
            onClick={() => setActiveTab("PENDING_REVIEW")}
            className={cn(
              "p-4 rounded-2xl border transition-all cursor-pointer bg-white text-left",
              activeTab === "PENDING_REVIEW"
                ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                : "border-[#E2E8F0] hover:border-slate-300",
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-amber-700 uppercase font-bold">
                Menunggu Cek
              </p>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono">
              {pendingCount}
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Perlu diverifikasi
            </p>
          </button>

          {/* Card: Sudah Dicek */}
          <button
            type="button"
            onClick={() => setActiveTab("REVIEWED")}
            className={cn(
              "p-4 rounded-2xl border transition-all cursor-pointer bg-white text-left",
              activeTab === "REVIEWED"
                ? "border-[#1035D0] ring-2 ring-[#1035D0]/20 shadow-md"
                : "border-[#E2E8F0] hover:border-slate-300",
            )}
          >
            <p className="font-mono text-xs text-[#1035D0] uppercase font-bold">
              Sudah Dicek
            </p>
            <p className="text-2xl sm:text-3xl font-black text-[#1035D0] mt-1 font-mono">
              {reviewedCount}
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Siap Notify User
            </p>
          </button>

          {/* Card: Terkirim Notif */}
          <button
            type="button"
            onClick={() => setActiveTab("NOTIFIED")}
            className={cn(
              "p-4 rounded-2xl border transition-all cursor-pointer bg-white text-left",
              activeTab === "NOTIFIED"
                ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                : "border-[#E2E8F0] hover:border-slate-300",
            )}
          >
            <p className="font-mono text-xs text-emerald-700 uppercase font-bold">
              Terkirim Notif
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-mono">
              {notifiedCount}
            </p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Selesai dinotifikasi
            </p>
          </button>
        </div>

        {/* ── Filter Bar & Search ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#E2E8F0]">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer shrink-0",
                activeTab === "ALL"
                  ? "bg-[#1035D0] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("PENDING_REVIEW")}
              className={cn(
                "px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer shrink-0",
                activeTab === "PENDING_REVIEW"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100",
              )}
            >
              Menunggu Cek ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("REVIEWED")}
              className={cn(
                "px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer shrink-0",
                activeTab === "REVIEWED"
                  ? "bg-[#1035D0] text-white"
                  : "bg-blue-50 text-[#1035D0] hover:bg-blue-100",
              )}
            >
              Sudah Dicek ({reviewedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("NOTIFIED")}
              className={cn(
                "px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer shrink-0",
                activeTab === "NOTIFIED"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
              )}
            >
              Terkirim Notif ({notifiedCount})
            </button>
          </div>

          {/* Search & Reset */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID, Nama, No WA, Link..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-[#1035D0] focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleResetData}
              title="Reset ke contoh demo"
              className="p-2 text-slate-500 hover:text-[#1035D0] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Submissions Table / Cards ────────────────────────────── */}
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-sans font-bold text-base text-slate-900">
              Tidak Ada Submission Ditemukan
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada data yang cocok dengan kriteria pencarian atau tab saat
              ini.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAF8F5] border-b border-[#E2E8F0] text-[#475569] font-mono uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">ID Submission</th>
                    <th className="py-3 px-4">Pelanggan &amp; Kontak</th>
                    <th className="py-3 px-4">Jumlah Link</th>
                    <th className="py-3 px-4">Status Verifikasi</th>
                    <th className="py-3 px-4">Waktu Diajukan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredSubmissions.map((sub) => {
                    const checkedCount = sub.links.filter(
                      (l) => l.isChecked,
                    ).length;

                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* ID Submission */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1035D0]">
                          <div className="flex items-center gap-1.5">
                            <span>{sub.id}</span>
                            {sub.warehouseCode && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono font-normal">
                                {sub.warehouseCode}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-slate-900">
                              {sub.userName}
                            </p>
                            <p className="font-mono text-[11px] text-slate-500">
                              {sub.userPhone}
                              {sub.userEmail ? ` • ${sub.userEmail}` : ""}
                            </p>
                          </div>
                        </td>

                        {/* Link Count */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono font-bold text-[11px] text-slate-800">
                              {sub.links.length} Link
                            </span>
                            {checkedCount > 0 && (
                              <span className="text-[10px] text-emerald-600 font-mono">
                                ({checkedCount}/{sub.links.length} dicek)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {sub.status === "PENDING_REVIEW" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px] font-bold">
                              <Clock className="w-3 h-3" />
                              Menunggu Cek
                            </span>
                          )}
                          {sub.status === "REVIEWED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1035D0] font-mono text-[11px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              Sudah Dicek
                            </span>
                          )}
                          {sub.status === "NOTIFIED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-bold">
                              <Bell className="w-3 h-3" />
                              Terkirim Notif
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {new Date(sub.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            type="button"
                            variant="electric"
                            size="sm"
                            onClick={() => setSelectedSubmissionId(sub.id)}
                            className="font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Cek Link
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Review Modal */}
      <AdminReviewDetailModal
        isOpen={!!selectedSubmissionId}
        onClose={() => setSelectedSubmissionId(null)}
        submissionId={selectedSubmissionId}
      />
    </>
  );
}
