"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminSubmissionTable } from "@/components/admin/admin-submission-table";
import { MultiLinkIntakeForm } from "@/components/intake/multi-link-intake-form";
import { Button } from "@/components/ui/button";

export function AdminDashboardTemplate() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Top Navigation & Breadcrumb ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#1035D0] text-[#0F172A] font-sans text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Web Pelanggan</span>
            </Link>
            <span className="text-[#94A3B8]">•</span>
            <span className="font-mono text-xs text-[#1035D0] font-bold">
              PORTAL ADMIN VERIFIKASI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="paper"
              size="sm"
              onClick={() => setIsTestModalOpen(true)}
              className="text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-[#1035D0]" />
              Tes Input Submission User
            </Button>
          </div>
        </div>

        {/* ── Main Header Banner ─────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-[#DCE4EC] p-6 sm:p-8 shadow-[0_12px_36px_-8px_rgba(16,53,208,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1035D0] text-white font-mono text-[11px] font-bold uppercase tracking-wider">
                  Admin Ops Shanghai &amp; Jakarta
                </span>
                <span className="text-xs font-mono text-slate-500">v2.4</span>
              </div>
              <h1 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-tight">
                Pemeriksaan Link &amp; Notifikasi Pelanggan
              </h1>
              <p className="text-[#64748B] text-xs sm:text-sm font-sans leading-relaxed">
                Platform kurasi manual untuk tautan produk Taobao, 1688, dan
                Tmall. Admin mengecek ketersediaan per link, mencantumkan
                catatan spesifikasi/harga, lalu mengirimkan konfirmasi via
                WhatsApp atau Email ke pengguna.
              </p>
            </div>

            {/* Quick Flow Visual */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] p-4 text-xs font-mono space-y-2 shrink-0 md:w-80">
              <p className="font-bold text-[#0F172A] uppercase text-[11px]">
                ⚡ Alur Kerja Admin:
              </p>
              <div className="space-y-1 text-[#475569] text-[11px]">
                <p>1. Cek daftar submission baru</p>
                <p>2. Buka link manual &amp; beri catatan</p>
                <p>3. Klik &quot;Tandai Sudah Dicek&quot;</p>
                <p>4. Klik &quot;Notify User&quot; (WA / Email)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Submissions Table & Actions ──────────────────────────── */}
        <AdminSubmissionTable />

        {/* ── Test Submission Intake Modal (for admin/demo testing) ─── */}
        {isTestModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <h3 className="font-sans font-black text-lg text-slate-900">
                  Uji Coba: Submit Link Sebagai User
                </h3>
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <MultiLinkIntakeForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
