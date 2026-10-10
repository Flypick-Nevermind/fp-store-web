"use client";

import { ArrowRight, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { SubmissionConfirmationModal } from "@/components/intake/submission-confirmation-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useSubmissionStore } from "@/store/use-submission-store";
import type { SubmissionRecord } from "@/types/submission";

interface LinkRowState {
  id: string;
  url: string;
  userNotes: string;
}

const SAMPLE_DEMO_LINKS = [
  {
    url: "https://item.taobao.com/item.htm?id=726194812301",
    notes: "Warna Washed Charcoal, Ukuran XL Loose Fit",
  },
  {
    url: "https://detail.tmall.com/item.htm?id=691238475920",
    notes: "Sneaker Putih EU 42",
  },
];

export function MultiLinkIntakeForm({ className }: { className?: string }) {
  const { error, success } = useToast();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const createSubmission = useSubmissionStore((s) => s.createSubmission);

  // Form states
  const [links, setLinks] = useState<LinkRowState[]>([
    { id: "row-1", url: "", userNotes: "" },
  ]);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modal state
  const [confirmationData, setConfirmationData] =
    useState<SubmissionRecord | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleAddRow = () => {
    const newId = `row-${Date.now().toString().slice(-4)}`;
    setLinks((prev) => [...prev, { id: newId, url: "", userNotes: "" }]);
  };

  const handleRemoveRow = (id: string) => {
    if (links.length <= 1) {
      setLinks([{ id: "row-1", url: "", userNotes: "" }]);
      return;
    }
    setLinks((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (
    id: string,
    field: "url" | "userNotes",
    value: string,
  ) => {
    setLinks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleLoadSampleLinks = () => {
    setLinks([
      {
        id: "sample-1",
        url: SAMPLE_DEMO_LINKS[0].url,
        userNotes: SAMPLE_DEMO_LINKS[0].notes,
      },
      {
        id: "sample-2",
        url: SAMPLE_DEMO_LINKS[1].url,
        userNotes: SAMPLE_DEMO_LINKS[1].notes,
      },
    ]);
    if (!isAuthenticated) {
      if (!guestName) setGuestName("Budi Santoso");
      if (!guestPhone) setGuestPhone("081288992211");
    }
    success("Contoh Link Diisi", "2 link produk contoh berhasil dimasukkan.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validLinks = links.filter((l) => l.url.trim().length > 0);
    if (validLinks.length === 0) {
      error(
        "Link Kosong",
        "Masukkan minimal 1 link produk China (Taobao, 1688, dll).",
      );
      return;
    }

    const finalName = (
      isAuthenticated && user?.name ? user.name : guestName
    ).trim();
    const finalPhone = (
      isAuthenticated && user?.phone ? user.phone : guestPhone
    ).trim();

    if (!finalName) {
      error("Nama Diperlukan", "Mohon cantumkan nama lengkap Anda.");
      return;
    }

    if (!finalPhone) {
      error(
        "Nomor WhatsApp Diperlukan",
        "Cantumkan nomor WhatsApp aktif agar admin dapat mengirim notifikasi hasil cek.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newRecord = createSubmission({
        userName: finalName,
        userPhone: finalPhone,
        userEmail: user?.email,
        userId: user?.id,
        warehouseCode: user?.warehouseCode,
        links: validLinks.map((l) => ({
          url: l.url,
          userNotes: l.userNotes,
        })),
      });

      // Reset
      setLinks([{ id: "row-1", url: "", userNotes: "" }]);
      if (!isAuthenticated) {
        setGuestName("");
        setGuestPhone("");
      }

      setConfirmationData(newRecord);
      setIsConfirmationOpen(true);
    } catch (_err) {
      error("Gagal Mengirim", "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-[0_16px_40px_-12px_rgba(16,53,208,0.1)] text-left space-y-4",
          className,
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Strip with Sample Link Button */}
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Tempel Link Produk China
            </span>
            <button
              type="button"
              onClick={handleLoadSampleLinks}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1035D0] hover:underline cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Coba Link Contoh</span>
            </button>
          </div>

          {/* List of Link Rows */}
          <div className="space-y-2.5">
            {links.map((row, index) => (
              <div
                key={row.id}
                className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-3 hover:border-[#1035D0]/40 transition-colors space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1035D0]/10 text-[#1035D0] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  {/* URL Input */}
                  <input
                    type="url"
                    required
                    placeholder="https://item.taobao.com/... atau 1688"
                    value={row.url}
                    onChange={(e) =>
                      handleUpdateRow(row.id, "url", e.target.value)
                    }
                    className="flex-1 bg-white px-3 py-2 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0]"
                  />

                  {/* Remove Button */}
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Optional Note */}
                <div className="pl-7">
                  <input
                    type="text"
                    placeholder="Catatan varian: warna, ukuran, atau qty (opsional)"
                    value={row.userNotes}
                    onChange={(e) =>
                      handleUpdateRow(row.id, "userNotes", e.target.value)
                    }
                    className="w-full bg-white/80 hover:bg-white focus:bg-white px-3 py-1.5 rounded-lg border border-slate-200/70 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* "+ Tambah Link" Full-width Button */}
          <button
            type="button"
            onClick={handleAddRow}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#1035D0] text-slate-600 hover:text-[#1035D0] font-sans text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white/50 hover:bg-blue-50/40"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Link Produk Lain</span>
          </button>

          {/* Guest Contact Input (Minimal 1 line) */}
          {!isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                <span className="font-semibold text-slate-700">
                  Kirim Hasil Pengecekan Ke:
                </span>
                <span className="text-[11px] text-slate-400">
                  Via WhatsApp &amp; Email
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap *"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#1035D0]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Nomor WhatsApp *"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#1035D0]"
                />
              </div>
            </div>
          ) : (
            <div className="pt-1 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>
                Akun: <strong>{user?.name}</strong> ({user?.warehouseCode})
              </span>
              <span className="text-emerald-600 font-bold">✓ Terhubung</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-1 space-y-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="electric"
              className="w-full h-12 rounded-2xl text-sm font-bold shadow-md shadow-[#1035D0]/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Memproses Permintaan...
                </>
              ) : (
                <>
                  <span>Cek Link Saya Sekarang ({links.length} Produk)</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
            <p className="text-[11px] text-slate-400 text-center font-sans">
              Gratis • Admin cek stok &amp; estimasi harga • Konfirmasi langsung
              via WhatsApp
            </p>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <SubmissionConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        submission={confirmationData}
      />
    </>
  );
}
