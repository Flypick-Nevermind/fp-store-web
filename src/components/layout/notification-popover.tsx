"use client";

import {
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Plane,
  Sparkles,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      {/* ── Bell Trigger Button with 'Soon' Pill ─────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative p-2 rounded-full transition-all cursor-pointer text-[#334155] hover:text-[#1035D0] hover:bg-[#F1F5F9]",
          isOpen ? "bg-[#EFF6FF] text-[#1035D0]" : "",
        )}
        aria-label="Pusat Notifikasi (Segera Hadir)"
        title="Pusat Notifikasi (Segera Hadir)"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-0.5 -right-1 px-1 py-0.2 bg-[#1035D0] text-white font-mono font-bold text-[8px] rounded-full uppercase tracking-tight shadow-xs">
          Soon
        </span>
      </button>

      {/* ── Coming Soon Dropdown Popover ─────────────────────────── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg text-[#1035D0] border border-blue-100">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-sans font-bold text-sm text-[#0F172A]">
                    Pusat Notifikasi
                  </h4>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    COMING SOON
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans">
                  Sistem pemberitahuan live pesanan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4">
            {/* Visual Teaser Hero */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/80 to-slate-50 border border-blue-100/70 text-center space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-white border border-blue-100 shadow-xs flex items-center justify-center text-[#1035D0]">
                <Sparkles className="w-5 h-5 text-[#1035D0]" />
              </div>
              <h5 className="font-sans font-bold text-xs text-[#0F172A] pt-1">
                Segera Hadir: Notifikasi Realtime
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                Kami sedang menyiapkan sistem peringatan otomatis langsung ke
                perangkat Anda agar Anda tidak ketinggalan setiap perkembangan
                kargo.
              </p>
            </div>

            {/* Upcoming Features Checklist */}
            <div className="space-y-2">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Fitur yang Akan Hadir:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                  <Warehouse className="w-4 h-4 text-[#1035D0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      Paket Tiba di Gudang Shanghai
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Notifikasi otomatis saat seller mengirim paket &amp; foto
                      QC selesai diunggah.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                  <Plane className="w-4 h-4 text-[#1035D0] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      Perjalanan Kargo Udara &amp; Bea Cukai
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Pembaruan live status manifest penerbangan Shanghai -
                      Jakarta.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      Hasil Verifikasi Link Produk
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Alert cepat begitu admin selesai mengecek stok &amp; harga
                      di Taobao/1688.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Info Box */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed font-sans flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Saat ini, Anda dapat memantau pergerakan pesanan dan status
                gudang secara langsung melalui menu <strong>Track Order</strong>
                .
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3 border-t border-slate-100 bg-[#FAF8F5] flex items-center justify-between gap-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1035D0] hover:bg-[#0A2699] text-white font-sans text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              <span>Buka Halaman Track Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="py-2 px-3 text-slate-500 hover:text-slate-800 font-sans text-xs font-semibold rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
