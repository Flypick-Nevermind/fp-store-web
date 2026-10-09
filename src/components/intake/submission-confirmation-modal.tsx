"use client";

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { SubmissionRecord } from "@/types/submission";

interface SubmissionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionRecord | null;
}

export function SubmissionConfirmationModal({
  isOpen,
  onClose,
  submission,
}: SubmissionConfirmationModalProps) {
  const router = useRouter();

  if (!isOpen || !submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#DCE4EC] shadow-[0_24px_60px_-12px_rgba(16,53,208,0.25)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Decorative Header Accent */}
        <div className="h-2.5 bg-gradient-to-r from-[#1035D0] via-[#00C2FF] to-[#1035D0]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          aria-label="Tutup Konfirmasi"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Confirmation Badge & Title */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EFF6FF] border-2 border-[#BFDBFE] flex items-center justify-center text-[#1035D0] shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-[#1035D0] animate-in zoom-in-75 duration-300" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                Menunggu Pengecekan Admin
              </span>
              <h2
                id="confirmation-modal-title"
                className="font-sans font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight leading-tight"
              >
                Data kamu sedang kami proses
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm font-sans max-w-md mx-auto mt-2 leading-relaxed">
                Tim admin FLYPICK sedang memeriksa ketersediaan, stok, dan harga
                masing-masing link secara manual dari seller Taobao/China.
              </p>
            </div>
          </div>

          {/* Submission Ticket Overview */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] font-mono text-xs">
              <span className="text-[#64748B]">Nomor Referensi:</span>
              <span className="font-black text-[#1035D0] bg-white px-2 py-0.5 rounded border border-[#DCE4EC]">
                {submission.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Nama Pengaju:
                </span>
                <span className="font-bold text-[#0F172A]">
                  {submission.userName}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">
                  Kontak Notifikasi:
                </span>
                <span className="font-mono font-bold text-[#0F172A]">
                  {submission.userPhone || submission.userEmail}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[11px] mb-1 font-sans">
                Tautan Yang Dikirimkan ({submission.links.length} Link):
              </span>
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                {submission.links.map((link, idx) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-[#E2E8F0] text-[11px]"
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#1035D0] text-white font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate font-mono text-[#334155]">
                        {link.url}
                      </span>
                    </div>
                    {link.userNotes && (
                      <span className="shrink-0 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {link.userNotes.slice(0, 15)}...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Steps Notice */}
          <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[#1E3A8A] text-xs">
            <Clock className="w-4 h-4 shrink-0 text-[#1035D0] mt-0.5" />
            <p className="leading-snug">
              Setelah selesai diverifikasi oleh admin, kamu akan menerima
              notifikasi lengkap beserta rincian harga &amp; catatan
              ketersediaan melalui <strong>WhatsApp</strong> atau{" "}
              <strong>Email</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              type="button"
              variant="electric"
              className="w-full h-11 text-sm font-bold shadow-md cursor-pointer"
              onClick={() => {
                onClose();
                router.push("/profile");
              }}
            >
              Lihat Status di Profil Saya
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="paper"
                className="flex-1 h-10 text-xs font-semibold cursor-pointer text-[#475569]"
                onClick={onClose}
              >
                Tutup &amp; Input Link Lain
              </Button>

              <Link
                href="/admin"
                onClick={onClose}
                className="flex-1 h-10 flex items-center justify-center gap-1 text-xs font-bold text-[#1035D0] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-xl border border-[#BFDBFE] transition-colors cursor-pointer"
              >
                <span>Buka Dashboard Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
