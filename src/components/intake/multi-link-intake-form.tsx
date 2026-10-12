"use client";

import {
  ArrowRight,
  BellRing,
  CheckCheck,
  Loader2,
  Lock,
  LogIn,
  Mail,
  MessageSquare,
  PackageCheck,
  Plus,
  Sparkles,
  Trash2,
  Warehouse,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SubmissionConfirmationModal } from "@/components/intake/submission-confirmation-modal";
import { Button } from "@/components/ui/button";
import { cartCheckApi } from "@/lib/api/cart";
import { ApiError, formatApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useNotificationStore } from "@/store/use-notification-store";
import { useSubmissionStore } from "@/store/use-submission-store";
import type {
  NotificationPreference,
  SubmissionRecord,
} from "@/types/submission";

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
  const { error, success, info } = useToast();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);
  const createSubmission = useSubmissionStore((s) => s.createSubmission);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isUserLoggedIn = isMounted && isAuthenticated && !!user;

  // Form states
  const [links, setLinks] = useState<LinkRowState[]>([
    { id: "row-1", url: "", userNotes: "" },
  ]);
  const [notificationPref, setNotificationPref] =
    useState<NotificationPreference>("BOTH");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modal state
  const [confirmationData, setConfirmationData] =
    useState<SubmissionRecord | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleAddRow = () => {
    if (!isUserLoggedIn) {
      info(
        "Wajib Masuk Terlebih Dahulu",
        "Silakan masuk ke akun Anda terlebih dahulu untuk menempelkan link produk.",
      );
      openLoginModal();
      return;
    }
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
    if (!isUserLoggedIn) {
      info(
        "Wajib Masuk Terlebih Dahulu",
        "Silakan masuk ke akun Anda terlebih dahulu untuk menempelkan link produk.",
      );
      openLoginModal();
      return;
    }
    setLinks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleLoadSampleLinks = () => {
    if (!isUserLoggedIn) {
      info(
        "Wajib Masuk Terlebih Dahulu",
        "Silakan masuk ke akun Anda terlebih dahulu untuk menempelkan dan mencoba link produk.",
      );
      openLoginModal();
      return;
    }
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
    success("Contoh Link Diisi", "2 link produk contoh berhasil dimasukkan.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      error(
        "Wajib Masuk Terlebih Dahulu",
        "Anda harus masuk ke akun Anda terlebih dahulu untuk menempelkan dan mengecek link produk.",
      );
      openLoginModal();
      return;
    }

    const validLinks = links.filter((l) => l.url.trim().length > 0);
    if (validLinks.length === 0) {
      error(
        "Link Kosong",
        "Masukkan minimal 1 link produk China (Taobao, 1688, dll).",
      );
      return;
    }

    const finalName = (user?.name || guestName || "Member FLYPICK").trim();
    const finalPhone = (user?.phone || guestPhone).trim();
    const finalEmail = (user?.email || guestEmail).trim();

    if (!finalName) {
      error("Nama Diperlukan", "Mohon cantumkan nama lengkap Anda.");
      return;
    }

    const requiresPhone =
      notificationPref === "WHATSAPP" || notificationPref === "BOTH";
    const requiresEmail =
      notificationPref === "EMAIL" || notificationPref === "BOTH";

    if (requiresPhone && !finalPhone) {
      error(
        "Nomor WhatsApp Diperlukan",
        "Cantumkan nomor WhatsApp aktif agar admin dapat mengirim notifikasi hasil cek.",
      );
      return;
    }

    if (requiresEmail && !finalEmail) {
      error(
        "Email Diperlukan",
        "Cantumkan alamat email Anda agar rincian hasil cek dapat dikirim ke inbox Anda.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      let serverCartCreationId: string | undefined;
      let serverStatus: string | undefined;
      let isServerSynced = false;

      // ── Integrasi Endpoint POST /api/v1/cart/check ───────────────
      // Jika pengguna telah login dan memiliki ID akun backend resmi
      if (isAuthenticated && user?.id) {
        const token = useAuthStore.getState().token || undefined;
        const checkRes = await cartCheckApi(
          {
            user_id: user.id,
            items: validLinks.map((l) => ({
              url: l.url.trim(),
              notes: l.userNotes.trim() || undefined,
            })),
          },
          token,
        );

        if (checkRes?.cart_creation_id) {
          serverCartCreationId = checkRes.cart_creation_id;
          serverStatus = checkRes.status || "ON_PROGRESS";
          isServerSynced = true;
        }
      }

      const newRecord = createSubmission({
        userName: finalName,
        userPhone: finalPhone,
        userEmail: finalEmail,
        userId: user?.id,
        warehouseCode: user?.warehouseCode,
        notificationPreference: notificationPref,
        serverCartCreationId,
        serverStatus,
        isServerSynced,
        links: validLinks.map((l) => ({
          url: l.url,
          userNotes: l.userNotes,
        })),
      });

      // Dispatch in-app notification for the user
      useNotificationStore.getState().addNotification({
        title: `Permintaan Cek Link Terkirim (${newRecord.id})`,
        message: isServerSynced
          ? `Terkoneksi ke server FLYPICK (ID: ${serverCartCreationId}). Pengecekan ${newRecord.links.length} link produk telah masuk antrian verifikasi admin.`
          : `Permintaan pengecekan ${newRecord.links.length} link produk telah masuk antrian verifikasi admin. Saluran: ${
              notificationPref === "BOTH"
                ? "WhatsApp & Email"
                : notificationPref === "WHATSAPP"
                  ? "WhatsApp"
                  : "Email"
            }.`,
        type: "ORDER",
        badgeText: isServerSynced ? "Server Synced" : "Antrian Cek",
        linkUrl: "/profile",
      });

      if (isServerSynced) {
        success(
          "Tersinkronisasi ke Server!",
          `Berhasil terhubung ke database server FLYPICK (ID: ${serverCartCreationId}).`,
        );
      }

      // Reset
      setLinks([{ id: "row-1", url: "", userNotes: "" }]);
      if (!isAuthenticated) {
        setGuestName("");
        setGuestPhone("");
        setGuestEmail("");
      }

      setConfirmationData(newRecord);
      setIsConfirmationOpen(true);
    } catch (err: unknown) {
      console.error("Gagal memproses pengiriman ke server backend:", err);
      const errorMsg = formatApiErrorMessage(err);
      const errorCode = err instanceof ApiError ? ` (${err.code})` : "";
      error(`Gagal Mengirim ke Server${errorCode}`, errorMsg);
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
        {!isUserLoggedIn ? (
          <div className="space-y-4">
            {/* Header Strip */}
            <div className="flex items-center justify-between pb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>WAJIB MASUK TERLEBIH DAHULU</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                TAOBAO • 1688 • TMALL
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-sans font-black text-slate-900 tracking-tight leading-tight">
                Masuk untuk Menempelkan Link Produk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Untuk menempelkan link produk China dan meminta tim FLYPICK
                memverifikasi ketersediaan stok, harga RMB, serta estimasi
                ongkir ke Indonesia, silakan masuk ke akun Anda terlebih dahulu.
              </p>
            </div>

            {/* biome-ignore lint/a11y/noStaticElementInteractions: Interactive preview box triggers login modal */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: Interactive preview box triggers login modal */}
            <div
              onClick={() => {
                info(
                  "Wajib Masuk Akun",
                  "Silakan masuk ke akun FLYPICK Anda untuk mulai menempelkan link belanja.",
                );
                openLoginModal();
              }}
              className="relative p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border-2 border-dashed border-slate-200 hover:border-[#1035D0]/50 transition-all cursor-pointer group space-y-2.5 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex-1 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span className="truncate">
                    https://item.taobao.com/item.htm?id=726194812301...
                  </span>
                  <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1035D0] transition-colors shrink-0 ml-2" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-slate-500 pl-7">
                <span className="group-hover:text-[#1035D0] transition-colors flex items-center gap-1">
                  🔒 Klik di sini untuk masuk &amp; tempel link
                </span>
                <span className="text-[#1035D0] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Masuk Sekarang <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col gap-1">
                <div className="w-6 h-6 rounded-lg bg-[#1035D0]/10 text-[#1035D0] flex items-center justify-center">
                  <PackageCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Riwayat Tersimpan
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Link &amp; pesanan otomatis tercatat di dashboard akun Anda.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Update Cepat
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Notifikasi hasil cek via WhatsApp &amp; Email resmi.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-1">
                <div className="w-6 h-6 rounded-lg bg-purple-600/10 text-purple-600 flex items-center justify-center">
                  <Warehouse className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Gudang Shanghai
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Alamat gudang dan ID personal (FP-xxxx) aktif.
                </span>
              </div>
            </div>

            {/* Big CTA Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={openLoginModal}
                className="w-full bg-[#1035D0] hover:bg-[#0A2699] text-white py-3.5 h-auto text-sm font-bold rounded-2xl shadow-[0_4px_14px_rgba(16,53,208,0.25)] hover:shadow-[0_6px_20px_rgba(16,53,208,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk / Daftar Akun Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-center text-[11px] text-slate-500 font-sans mt-2">
                Belum punya akun? Pendaftaran cepat via WhatsApp OTP atau Email
                &amp; Password.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Strip with Sample Link Button */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Tempel Link Produk China
                </span>
                {user?.warehouseCode && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-mono text-[10px] font-bold">
                    {user.warehouseCode}
                  </span>
                )}
              </div>
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

            {/* ── Notification Channel Preference Selection ─────────── */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-[#1035D0]" />
                  <span>Saluran Notifikasi Hasil Cek:</span>
                </span>
                <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                  Pilih notifikasi yang diinginkan
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNotificationPref("WHATSAPP")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer select-none",
                    notificationPref === "WHATSAPP"
                      ? "bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500/40"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-600",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors",
                      notificationPref === "WHATSAPP"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600",
                    )}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold">WhatsApp</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Chat Instan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationPref("EMAIL")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer select-none",
                    notificationPref === "EMAIL"
                      ? "bg-blue-50/90 border-[#1035D0] text-[#1035D0] shadow-xs ring-1 ring-[#1035D0]/40"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-600",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors",
                      notificationPref === "EMAIL"
                        ? "bg-[#1035D0] text-white"
                        : "bg-slate-200 text-slate-600",
                    )}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold">Email</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Inbox Rincian
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationPref("BOTH")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer select-none",
                    notificationPref === "BOTH"
                      ? "bg-purple-50/90 border-purple-600 text-purple-950 shadow-xs ring-1 ring-purple-600/40"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-600",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors",
                      notificationPref === "BOTH"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 text-slate-600",
                    )}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-xs font-bold">Keduanya</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    WA + Email
                  </span>
                </button>
              </div>
            </div>

            {/* User Account / Contact Details */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[11px] block">
                    AKUN PENERIMA NOTIFIKASI:
                  </span>
                  <span className="font-bold text-slate-800">
                    {user?.name}{" "}
                    <span className="text-[#1035D0]">
                      ({user?.warehouseCode})
                    </span>
                  </span>
                </div>
                <div className="text-left sm:text-right text-[11px] text-slate-600">
                  {notificationPref === "BOTH" && (
                    <span>
                      WA: {user?.phone || guestPhone || "-"} &bull; Email:{" "}
                      {user?.email || guestEmail || "-"}
                    </span>
                  )}
                  {notificationPref === "WHATSAPP" && (
                    <span>WA: {user?.phone || guestPhone || "-"}</span>
                  )}
                  {notificationPref === "EMAIL" && (
                    <span>Email: {user?.email || guestEmail || "-"}</span>
                  )}
                </div>
              </div>

              {/* In case user's profile is missing phone or email */}
              {!user?.phone &&
                (notificationPref === "WHATSAPP" ||
                  notificationPref === "BOTH") && (
                  <div className="space-y-1">
                    {/* biome-ignore lint/a11y/noLabelWithoutControl: Label precedes sibling input element */}
                    <label className="text-[11px] font-bold text-slate-700 font-sans">
                      Nomor WhatsApp Anda (untuk notifikasi hasil cek):
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812xxxxxxxx *"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#1035D0]"
                    />
                  </div>
                )}

              {!user?.email &&
                (notificationPref === "EMAIL" ||
                  notificationPref === "BOTH") && (
                  <div className="space-y-1">
                    {/* biome-ignore lint/a11y/noLabelWithoutControl: Label precedes sibling input element */}
                    <label className="text-[11px] font-bold text-slate-700 font-sans">
                      Alamat Email Anda (untuk invoice rincian):
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com *"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#1035D0]"
                    />
                  </div>
                )}
            </div>

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
                    <span>Menyinkronkan ke Server FLYPICK...</span>
                  </>
                ) : (
                  <>
                    <span>Cek Link Saya Sekarang ({links.length} Produk)</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
              <p className="text-[11px] text-slate-400 text-center font-sans">
                Gratis &bull; Admin verifikasi harga &amp; stok &bull;
                Pemberitahuan dikirim via{" "}
                {notificationPref === "BOTH"
                  ? "WhatsApp & Email"
                  : notificationPref === "WHATSAPP"
                    ? "WhatsApp"
                    : "Email"}
              </p>
            </div>
          </form>
        )}
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
