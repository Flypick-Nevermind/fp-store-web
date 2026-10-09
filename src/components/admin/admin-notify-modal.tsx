"use client";

import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { useSubmissionStore } from "@/store/use-submission-store";
import type { NotificationChannel, SubmissionRecord } from "@/types/submission";

interface AdminNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionRecord | null;
  onNotificationSent?: () => void;
}

export function AdminNotifyModal({
  isOpen,
  onClose,
  submission,
  onNotificationSent,
}: AdminNotifyModalProps) {
  const { success, error, info } = useToast();
  const notifyUser = useSubmissionStore((s) => s.notifyUser);

  const [sendViaEmail, setSendViaEmail] = useState(true);
  const [sendViaWhatsapp, setSendViaWhatsapp] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !submission) return null;

  // Compile notification message preview from reviewed links
  const generateDefaultMessage = () => {
    const lines: string[] = [];
    lines.push(`Halo Kak ${submission.userName},`);
    lines.push(
      `Permintaan pengecekan link produk China kamu (ID: ${submission.id}) sudah selesai kami verifikasi oleh tim Admin FLYPICK! ✈️📦`,
    );
    lines.push("");
    lines.push("📋 *Rincian Hasil Pengecekan:*");

    submission.links.forEach((link, idx) => {
      lines.push("");
      lines.push(`*Link ${idx + 1}* (${link.domain || "China Store"}):`);
      lines.push(`${link.url}`);
      if (link.userNotes) {
        lines.push(`• Request Anda: ${link.userNotes}`);
      }

      const statusLabel =
        link.status === "AVAILABLE"
          ? "✅ Stok Tersedia"
          : link.status === "UNAVAILABLE"
            ? "❌ Stok Habis"
            : link.status === "NEEDS_CONFIRMATION"
              ? "⚠️ Perlu Konfirmasi"
              : "ℹ️ Selesai Dicek";

      lines.push(`• Status: ${statusLabel}`);

      if (link.adminNotes) {
        lines.push(`• Catatan Admin: ${link.adminNotes}`);
      }

      if (link.priceCny) {
        lines.push(
          `• Estimasi Harga: ¥${link.priceCny} CNY (~Rp ${(link.priceIdr || link.priceCny * 2400).toLocaleString("id-ID")})`,
        );
      }
    });

    if (submission.overallAdminNotes) {
      lines.push("");
      lines.push(`📝 *Catatan Tambahan:* ${submission.overallAdminNotes}`);
    }

    lines.push("");
    lines.push(
      "Silakan konfirmasi pesanan ini untuk kami proses pembelian dan pengiriman ke alamat Indonesia kamu.",
    );
    lines.push(
      "Terima kasih telah mempercayakan pengiriman Anda bersama FLYPICK!",
    );

    return lines.join("\n");
  };

  const messageText = generateDefaultMessage();

  // WhatsApp formatted phone
  const cleanPhone = submission.userPhone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("0")
    ? `62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith("62")
      ? cleanPhone
      : `62${cleanPhone}`;

  const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(
    messageText,
  )}`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      success(
        "Teks Disalin",
        "Pesan notifikasi berhasil disalin ke clipboard.",
      );
    } catch {
      info("Salin Manual", "Silakan blok dan salin pesan secara manual.");
    }
  };

  const handleConfirmSend = async () => {
    if (!sendViaEmail && !sendViaWhatsapp) {
      error(
        "Pilih Channel",
        "Pilih minimal salah satu channel notifikasi (Email atau WhatsApp).",
      );
      return;
    }

    setIsSending(true);

    try {
      const channels: NotificationChannel[] = [];
      if (sendViaEmail) channels.push("EMAIL");
      if (sendViaWhatsapp) channels.push("WHATSAPP");

      // Save notification log & update submission status to NOTIFIED
      notifyUser(submission.id, channels, messageText);

      // If WhatsApp is selected, open WhatsApp Web/App
      if (sendViaWhatsapp) {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      success(
        "Notifikasi Berhasil Dikirim!",
        `Status pengajuan ${submission.id} diperbarui ke 'Terkirim Notif'. Saluran: ${channels.join(", ")}.`,
      );

      if (onNotificationSent) {
        onNotificationSent();
      }
      onClose();
    } catch (_err) {
      error(
        "Gagal Mengirim",
        "Terjadi kesalahan saat memproses pengiriman notifikasi.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#DCE4EC] shadow-[0_24px_60px_-12px_rgba(16,53,208,0.25)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Top Accent */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-[#1035D0] to-emerald-500" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-black text-lg text-[#0F172A]">
                Notify User (Kirim Notifikasi)
              </h3>
              <p className="font-mono text-xs text-[#64748B]">
                ID: {submission.id} • {submission.userName}
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
          {/* Channel Selector */}
          <div className="space-y-2">
            {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="font-mono text-xs font-bold uppercase text-[#0F172A]">
              1. Pilih Saluran Notifikasi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Toggle */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  sendViaWhatsapp
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sendViaWhatsapp}
                  onChange={(e) => setSendViaWhatsapp(e.target.checked)}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#64748B] truncate mt-0.5">
                    {submission.userPhone || "Tidak ada no WA"}
                  </p>
                </div>
              </label>

              {/* Email Toggle */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  sendViaEmail
                    ? "border-[#1035D0] bg-[#EFF6FF]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sendViaEmail}
                  onChange={(e) => setSendViaEmail(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#1035D0] rounded border-slate-300 focus:ring-[#1035D0]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                    <Mail className="w-4 h-4 text-[#1035D0]" />
                    <span>Email</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#64748B] truncate mt-0.5">
                    {submission.userEmail || "user@example.com"}
                  </p>
                </div>
              </label>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setSendViaEmail(true);
                  setSendViaWhatsapp(true);
                }}
                className="text-[#1035D0] hover:underline font-semibold"
              >
                ✓ Pilih Keduanya (Email &amp; WhatsApp)
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
              <label className="font-mono text-xs font-bold uppercase text-[#0F172A]">
                2. Preview Pesan Notifikasi:
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center gap-1 text-xs font-semibold text-[#1035D0] hover:text-[#0A2699]"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-2xl p-3.5 max-h-56 overflow-y-auto text-xs font-mono text-[#334155] whitespace-pre-wrap leading-relaxed">
              {messageText}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="paper"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {sendViaWhatsapp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors w-full sm:w-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Buka WhatsApp</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}

            <Button
              type="button"
              variant="electric"
              size="sm"
              disabled={isSending}
              onClick={handleConfirmSend}
              className="w-full sm:w-auto font-bold"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Konfirmasi &amp; Tandai Terkirim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
