"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(16,53,208,0.18)] p-6 sm:p-7 text-center space-y-4 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-13 h-13 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>

        {/* Header & Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Sedang Diproses Tim Admin</span>
          </div>

          <h2
            id="confirmation-modal-title"
            className="font-sans font-bold text-xl sm:text-2xl text-slate-900 tracking-tight"
          >
            Data kamu sedang kami proses
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            Tim admin FLYPICK sedang memeriksa ketersediaan stok &amp; harga.
            Hasil cek akan kami kirimkan ke WhatsApp{" "}
            <strong className="text-slate-800">
              {submission.userPhone || "kamu"}
            </strong>
            .
          </p>
        </div>

        {/* Compact Summary Strip */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-3.5 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs font-sans">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">
                NO. REFERENSI
              </span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {submission.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">
                TOTAL PENGAJUAN
              </span>
              <span className="font-bold text-[#1035D0] text-xs">
                {submission.links.length} Link Produk
              </span>
            </div>
          </div>

          {/* Optional Toggle to view submitted links */}
          <div className="pt-2 border-t border-slate-200/70">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="w-full flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-[#1035D0] cursor-pointer transition-colors"
            >
              <span>Lihat rincian link yang dikirim</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  showDetails ? "rotate-180 text-[#1035D0]" : "",
                )}
              />
            </button>

            {showDetails && (
              <div className="mt-2 max-h-28 overflow-y-auto space-y-1.5 animate-in fade-in duration-150 pr-1">
                {submission.links.map((link, idx) => (
                  <div
                    key={link.id}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 text-[11px] flex items-center justify-between gap-2"
                  >
                    <span className="truncate font-mono text-slate-600">
                      #{idx + 1} {link.url}
                    </span>
                    {link.userNotes && (
                      <span className="shrink-0 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded max-w-[100px] truncate">
                        {link.userNotes}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/profile");
            }}
            className="w-full h-11 bg-[#1035D0] hover:bg-[#0A2699] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#1035D0]/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Lihat Status di Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-xl border border-slate-200 text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <Link
              href="/admin"
              onClick={onClose}
              className="flex-1 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1035D0]" />
              <span>Dashboard Admin</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
