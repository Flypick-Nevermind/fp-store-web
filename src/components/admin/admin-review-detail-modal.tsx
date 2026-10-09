"use client";

import {
  Bell,
  Check,
  CheckCircle2,
  ExternalLink,
  Link2,
  MessageSquare,
  X,
} from "lucide-react";
import { useState } from "react";
import { AdminNotifyModal } from "@/components/admin/admin-notify-modal";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";
import { formatIdr } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useSubmissionStore } from "@/store/use-submission-store";
import type {
  SubmissionItemLink,
  SubmissionLinkStatus,
} from "@/types/submission";

interface AdminReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string | null;
}

export function AdminReviewDetailModal({
  isOpen,
  onClose,
  submissionId,
}: AdminReviewDetailModalProps) {
  const { success } = useToast();
  const getSubmissionById = useSubmissionStore((s) => s.getSubmissionById);
  const updateLinkReview = useSubmissionStore((s) => s.updateLinkReview);
  const markSubmissionAsReviewed = useSubmissionStore(
    (s) => s.markSubmissionAsReviewed,
  );

  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [overallNotes, setOverallNotes] = useState("");

  if (!isOpen || !submissionId) return null;

  const submission = getSubmissionById(submissionId);
  if (!submission) return null;

  const isReviewed =
    submission.status === "REVIEWED" || submission.status === "NOTIFIED";
  const isNotified = submission.status === "NOTIFIED";

  const handleUpdateLink = (
    linkId: string,
    updates: Partial<SubmissionItemLink>,
  ) => {
    updateLinkReview(submission.id, linkId, updates);
  };

  const handleMarkAsReviewed = () => {
    markSubmissionAsReviewed(
      submission.id,
      "Admin FLYPICK",
      overallNotes || undefined,
    );
    success(
      "Submission Ditandai Sudah Dicek!",
      `Status pengajuan ${submission.id} kini 'Sudah Dicek'. Tombol 'Notify User' siap digunakan.`,
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#DCE4EC] shadow-[0_24px_60px_-12px_rgba(16,53,208,0.25)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
          {/* Header Accent Bar */}
          <div
            className={`h-2 bg-gradient-to-r ${
              isNotified
                ? "from-emerald-500 via-[#1035D0] to-emerald-500"
                : isReviewed
                  ? "from-[#1035D0] via-cyan-400 to-[#1035D0]"
                  : "from-amber-400 via-orange-500 to-amber-400"
            }`}
          />

          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#1035D0]/10 border border-[#1035D0]/20 flex items-center justify-center text-[#1035D0] font-bold font-mono text-sm">
                FP
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-black text-lg text-[#0F172A]">
                    Pemeriksaan Submission {submission.id}
                  </h3>
                  {/* Status Badge */}
                  {submission.status === "PENDING_REVIEW" && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[10px] font-bold uppercase">
                      Menunggu Cek
                    </span>
                  )}
                  {submission.status === "REVIEWED" && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1035D0] font-mono text-[10px] font-bold uppercase">
                      Sudah Dicek
                    </span>
                  )}
                  {submission.status === "NOTIFIED" && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Terkirim Notif
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-[#64748B]">
                  Diajukan:{" "}
                  {new Date(submission.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
            {/* Customer Information Card */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1035D0] text-white flex items-center justify-center font-bold font-mono text-sm shrink-0">
                  {submission.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A]">
                      {submission.userName}
                    </span>
                    {submission.warehouseCode && (
                      <span className="px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] font-mono text-[10px] font-bold text-[#1035D0]">
                        {submission.warehouseCode}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-[#64748B]">
                    WhatsApp: {submission.userPhone}{" "}
                    {submission.userEmail ? `• ${submission.userEmail}` : ""}
                  </p>
                </div>
              </div>

              {/* Quick WhatsApp Link for Admin */}
              <a
                href={`https://wa.me/${submission.userPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-emerald-500 text-emerald-700 font-mono text-xs font-semibold transition-colors shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Admin WA</span>
              </a>
            </div>

            {/* Links Review Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-[#1035D0]" />
                  Pemeriksaan Link Satu Per Satu ({submission.links.length}{" "}
                  Link):
                </h4>
                <span className="text-[11px] text-[#64748B]">
                  Buka link dan berikan catatan ketersediaan/harga
                </span>
              </div>

              {/* Link Cards List */}
              <div className="space-y-4">
                {submission.links.map((link, idx) => (
                  <div
                    key={link.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      link.isChecked
                        ? "bg-white border-blue-200 shadow-xs"
                        : "bg-white border-amber-200 shadow-xs"
                    }`}
                  >
                    {/* Link Card Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-[#1035D0] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                          {link.domain || "China Store"}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-[#1035D0] hover:underline truncate max-w-xs sm:max-w-md inline-flex items-center gap-1"
                        >
                          <span className="truncate">{link.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>

                      {/* Direct External Open Button */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1035D0] font-sans text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        <span>Buka Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* User Notes if any */}
                    {link.userNotes && (
                      <div className="mt-2.5 p-2 bg-[#FFF8E1] rounded-xl border border-amber-200/80 text-xs">
                        <span className="font-mono text-[10px] font-bold uppercase text-amber-800 block">
                          Request/Catatan dari Pengguna:
                        </span>
                        <p className="text-[#0F172A] mt-0.5">
                          {link.userNotes}
                        </p>
                      </div>
                    )}

                    {/* Admin Verification Controls */}
                    <div className="mt-3.5 space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Status Selection Buttons */}
                        <div>
                          <label
                            htmlFor={`link-status-${link.id}`}
                            className="block font-mono text-[10px] font-bold text-[#64748B] uppercase mb-1"
                          >
                            Status Ketersediaan:
                          </label>
                          <select
                            id={`link-status-${link.id}`}
                            value={link.status}
                            onChange={(e) =>
                              handleUpdateLink(link.id, {
                                status: e.target.value as SubmissionLinkStatus,
                                isChecked: true,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBD5E1] bg-white font-sans text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1035D0]"
                          >
                            <option value="PENDING">⏳ Belum Dicek</option>
                            <option value="AVAILABLE">✅ Stok Tersedia</option>
                            <option value="UNAVAILABLE">❌ Stok Habis</option>
                            <option value="NEEDS_CONFIRMATION">
                              ⚠️ Perlu Konfirmasi
                            </option>
                          </select>
                        </div>

                        {/* Estimated Price CNY */}
                        <div>
                          <label
                            htmlFor={`link-cny-${link.id}`}
                            className="block font-mono text-[10px] font-bold text-[#64748B] uppercase mb-1"
                          >
                            Estimasi Harga (¥ CNY):
                          </label>
                          <input
                            id={`link-cny-${link.id}`}
                            type="number"
                            step="0.1"
                            placeholder="Contoh: 120"
                            value={link.priceCny || ""}
                            onChange={(e) =>
                              handleUpdateLink(link.id, {
                                priceCny: e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined,
                                isChecked: true,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBD5E1] bg-white font-mono text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#1035D0]"
                          />
                        </div>

                        {/* Estimated Price IDR preview */}
                        <div>
                          <span className="block font-mono text-[10px] font-bold text-[#64748B] uppercase mb-1">
                            Estimasi (IDR):
                          </span>
                          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-[#1035D0]">
                            {link.priceCny
                              ? formatIdr(
                                  Math.round(
                                    link.priceCny *
                                      BRANDING.exchangeRate.cnyToIdr,
                                  ),
                                )
                              : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes per link */}
                      <div>
                        <label
                          htmlFor={`link-notes-${link.id}`}
                          className="block font-mono text-[10px] font-bold text-[#64748B] uppercase mb-1"
                        >
                          Catatan / Keterangan Admin per Link (Opsional):
                        </label>
                        <input
                          id={`link-notes-${link.id}`}
                          type="text"
                          placeholder="Contoh: Ready stok size XL warna hitam. Seller respon cepat."
                          value={link.adminNotes || ""}
                          onChange={(e) =>
                            handleUpdateLink(link.id, {
                              adminNotes: e.target.value,
                              isChecked: true,
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-[#CBD5E1] bg-white font-sans text-xs text-[#0F172A] focus:outline-none focus:border-[#1035D0]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Admin Note */}
            <div className="space-y-1.5">
              <label
                htmlFor="overallAdminNotesTextarea"
                className="font-mono text-xs font-bold uppercase text-[#0F172A]"
              >
                Catatan Keseluruhan Untuk Pelanggan (Opsional):
              </label>
              <textarea
                id="overallAdminNotesTextarea"
                rows={2}
                placeholder="Tulis pesan tambahan untuk pelanggan sebelum notifikasi dikirim..."
                value={overallNotes || submission.overallAdminNotes || ""}
                onChange={(e) => setOverallNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white font-sans text-xs text-[#0F172A] focus:outline-none focus:border-[#1035D0]"
              />
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="paper"
              size="sm"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Button: Tandai Sudah Dicek */}
              {!isReviewed && (
                <Button
                  type="button"
                  variant="paper"
                  size="sm"
                  onClick={handleMarkAsReviewed}
                  className="w-full sm:w-auto font-bold border-blue-400 text-[#1035D0] hover:bg-blue-50"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Tandai Sudah Dicek
                </Button>
              )}

              {/* Button: Notify User (Highlighted when reviewed) */}
              <Button
                type="button"
                variant="electric"
                size="sm"
                onClick={() => setIsNotifyOpen(true)}
                className={`w-full sm:w-auto font-bold shadow-md cursor-pointer ${
                  isReviewed
                    ? "bg-gradient-to-r from-emerald-600 to-[#1035D0] text-white"
                    : ""
                }`}
              >
                <Bell className="w-4 h-4 mr-1.5" />
                Notify User {isNotified && "(Kirim Ulang)"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notify Modal */}
      <AdminNotifyModal
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        submission={submission}
      />
    </>
  );
}
