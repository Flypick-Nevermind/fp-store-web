"use client";

import {
  Link2,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
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
    notes:
      "Warna Washed Charcoal, Ukuran XL Loose Fit. Tolong cek ketersediaan stok ya min.",
  },
  {
    url: "https://detail.tmall.com/item.htm?id=691238475920",
    notes: "Sneaker Putih EU 42. Tolong pastikan box sepatu mulus.",
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
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modal state
  const [confirmationData, setConfirmationData] =
    useState<SubmissionRecord | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Add new link row
  const handleAddRow = () => {
    const newId = `row-${Date.now().toString().slice(-4)}`;
    setLinks((prev) => [...prev, { id: newId, url: "", userNotes: "" }]);
  };

  // Remove link row
  const handleRemoveRow = (id: string) => {
    if (links.length <= 1) {
      setLinks([{ id: "row-1", url: "", userNotes: "" }]);
      return;
    }
    setLinks((prev) => prev.filter((r) => r.id !== id));
  };

  // Update row
  const handleUpdateRow = (
    id: string,
    field: "url" | "userNotes",
    value: string,
  ) => {
    setLinks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  // Load sample demo links
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
      if (!guestEmail) setGuestEmail("budi.santoso@gmail.com");
    }
    success("Contoh Link Diisi", "2 link produk contoh berhasil dimasukkan.");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate links
    const validLinks = links.filter((l) => l.url.trim().length > 0);
    if (validLinks.length === 0) {
      error(
        "Link Kosong",
        "Masukkan minimal 1 link produk China (Taobao, 1688, dll).",
      );
      return;
    }

    // Determine contact info
    const finalName = (
      isAuthenticated && user?.name ? user.name : guestName
    ).trim();
    const finalPhone = (
      isAuthenticated && user?.phone ? user.phone : guestPhone
    ).trim();
    const finalEmail = (
      isAuthenticated && user?.email ? user.email : guestEmail
    ).trim();
    const finalWarehouse = isAuthenticated ? user?.warehouseCode : undefined;

    if (!finalName) {
      error(
        "Nama Diperlukan",
        "Mohon cantumkan nama lengkap Anda untuk data pengajuan.",
      );
      return;
    }

    if (!finalPhone && !finalEmail) {
      error(
        "Kontak Diperlukan",
        "Cantumkan nomor WhatsApp atau Email agar tim admin dapat memberikan notifikasi.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate quick processing
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newRecord = createSubmission({
        userName: finalName,
        userPhone: finalPhone || "081200000000",
        userEmail: finalEmail,
        userId: user?.id,
        warehouseCode: finalWarehouse,
        links: validLinks.map((l) => ({
          url: l.url,
          userNotes: l.userNotes,
        })),
      });

      // Reset form
      setLinks([{ id: "row-1", url: "", userNotes: "" }]);
      if (!isAuthenticated) {
        setGuestName("");
        setGuestPhone("");
        setGuestEmail("");
      }

      // Show confirmation modal
      setConfirmationData(newRecord);
      setIsConfirmationOpen(true);
    } catch (_err) {
      error(
        "Gagal Mengirim",
        "Terjadi kesalahan saat memproses data. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full max-w-2xl mx-auto bg-white rounded-3xl border border-[#DCE4EC] p-5 sm:p-7 shadow-[0_20px_50px_-12px_rgba(16,53,208,0.12)] text-left relative overflow-hidden",
          className,
        )}
      >
        {/* Top subtle blue accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1035D0] via-[#00C2FF] to-[#1035D0]" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1035D0] font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                Formulir Cek Link Titip Beli
              </span>
              <h2 className="font-sans font-black text-lg sm:text-xl text-[#0F172A] tracking-tight">
                Kirim Link Produk China
              </h2>
            </div>

            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleLoadSampleLinks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E1] hover:bg-[#FEF08A] border border-[#FDE047] text-[#854D0E] font-mono text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Contoh 2 Link Taobao</span>
            </button>
          </div>

          {/* User Contact Info Bar */}
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1035D0] text-white flex items-center justify-center font-bold font-mono text-xs">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#0F172A]">{user.name}</p>
                  <p className="font-mono text-[11px] text-[#64748B]">
                    {user.phone || user.email} • ID Gudang:{" "}
                    <span className="font-black text-[#1035D0]">
                      {user.warehouseCode}
                    </span>
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">
                Akun Terverifikasi
              </span>
            </div>
          ) : (
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-mono text-[11px] font-bold uppercase text-[#475569] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1035D0]" />
                Kontak Penerima Notifikasi:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#CBD5E1] text-xs font-sans text-[#0F172A] focus:outline-none focus:border-[#1035D0]"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Nomor WhatsApp (Aktif) *"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#1035D0]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Link Rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="font-mono text-xs font-bold text-[#0F172A] uppercase flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#1035D0]" />
                Daftar Link Produk ({links.length} Baris):
              </label>
              <span className="text-[11px] text-[#64748B]">
                Taobao, Tmall, 1688, Pinduoduo
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {links.map((row, index) => (
                <div
                  key={row.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] hover:border-[#1035D0]/50 transition-colors space-y-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1035D0] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    {/* URL Input */}
                    <input
                      type="url"
                      required
                      placeholder="Tempel tautan produk (https://item.taobao.com/...)"
                      value={row.url}
                      onChange={(e) =>
                        handleUpdateRow(row.id, "url", e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 bg-[#FAF8F5] rounded-xl border border-[#E2E8F0] font-mono text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#1035D0]"
                    />

                    {/* Delete button if > 1 row */}
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Notes for this link (color, size, quantity) */}
                  <div className="pl-8">
                    <input
                      type="text"
                      placeholder="Catatan per link (opsional: warna, size, jumlah, dsb)..."
                      value={row.userNotes}
                      onChange={(e) =>
                        handleUpdateRow(row.id, "userNotes", e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-[11px] font-sans text-[#334155] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#1035D0]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* "+ Tambah Baris" Button */}
            <button
              type="button"
              onClick={handleAddRow}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-[#CBD5E1] hover:border-[#1035D0] hover:bg-[#EFF6FF] text-[#1035D0] font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Baris Link Produk Lain</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="electric"
              className="w-full h-12 rounded-2xl text-sm font-bold shadow-lg shadow-[#1035D0]/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mengirim Permintaan...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Permintaan Cek Link ({links.length} Link)
                </>
              )}
            </Button>
            <p className="text-[11px] text-[#64748B] text-center mt-2 font-sans">
              Admin akan memeriksa stok, harga, dan varian tiap link secara
              manual lalu mengirimkan notifikasi.
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
