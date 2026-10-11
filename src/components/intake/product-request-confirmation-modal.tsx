"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductRequestRecord } from "@/types/product-request";

interface ProductRequestConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ProductRequestRecord | null;
}

export function ProductRequestConfirmationModal({
  isOpen,
  onClose,
  request,
}: ProductRequestConfirmationModalProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !request) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="req-confirmation-modal-title"
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
        <div className="w-13 h-13 mx-auto rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#1035D0] shadow-2xs">
          <Sparkles className="w-7 h-7 text-[#1035D0]" />
        </div>

        {/* Header & Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1035D0] text-[11px] font-semibold border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1035D0] animate-pulse" />
            <span>Permintaan Sourcing Diterima</span>
          </div>

          <h2
            id="req-confirmation-modal-title"
            className="font-sans font-bold text-xl sm:text-2xl text-slate-900 tracking-tight"
          >
            Tim Kami Sedang Mencari Produk
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            Tim sourcing FLYPICK di China sedang mencari supplier pabrik &amp;
            harga terbaik untuk produk{" "}
            <strong className="text-slate-800 font-semibold">
              &ldquo;{request.productName}&rdquo;
            </strong>
            . Notifikasi akan dikirimkan ke{" "}
            {request.notificationPreference === "BOTH" ? (
              <>
                WhatsApp{" "}
                <strong className="text-slate-800">{request.userPhone}</strong>{" "}
                dan Email{" "}
                <strong className="text-slate-800">
                  {request.userEmail || "-"}
                </strong>
              </>
            ) : request.notificationPreference === "EMAIL" ? (
              <>
                Email{" "}
                <strong className="text-slate-800">
                  {request.userEmail || request.userPhone}
                </strong>
              </>
            ) : (
              <>
                WhatsApp{" "}
                <strong className="text-slate-800">
                  {request.userPhone || "nomor kamu"}
                </strong>
              </>
            )}
            .
          </p>
        </div>

        {/* ID Card Box */}
        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl p-3.5 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Nomor Request:</span>
            <span className="font-mono font-bold text-[#1035D0] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              {request.id}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Kategori:</span>
            <span className="font-medium text-slate-800">
              {request.category}
            </span>
          </div>
          {request.targetQuantity && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Target Qty:</span>
              <span className="font-medium text-slate-800">
                {request.targetQuantity}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Estimasi Waktu:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>1x24 Jam Kerja</span>
            </span>
          </div>
        </div>

        {/* Expandable Request Details */}
        <div className="text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-medium py-1 px-1 transition-colors cursor-pointer"
          >
            <span>Rincian Request Produk</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-200",
                showDetails && "rotate-180",
              )}
            />
          </button>

          {showDetails && (
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700 max-h-48 overflow-y-auto">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">
                  SPESIFIKASI / CATATAN
                </span>
                <p className="font-medium">
                  {request.specificationNotes ||
                    "Tidak ada catatan spesifikasi"}
                </p>
              </div>

              {request.targetBudget && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">
                    TARGET BUDGET
                  </span>
                  <p className="font-medium">{request.targetBudget}</p>
                </div>
              )}

              {request.referenceImage && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono mb-1">
                    FOTO REFERENSI
                  </span>
                  <img
                    src={request.referenceImage}
                    alt="Foto Referensi"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {request.referenceLink && (
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono">
                    LINK CONTOH
                  </span>
                  <a
                    href={request.referenceLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1035D0] hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{request.referenceLink}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Selesai
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/profile");
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#1035D0] hover:bg-[#0D2CA8] text-xs font-semibold text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Pantau di Profil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
