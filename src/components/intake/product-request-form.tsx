"use client";

import {
  ArrowRight,
  BellRing,
  Camera,
  CheckCheck,
  Loader2,
  Lock,
  LogIn,
  Mail,
  MessageSquare,
  Package,
  PackageCheck,
  Search,
  Sparkles,
  Warehouse,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductRequestConfirmationModal } from "@/components/intake/product-request-confirmation-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useNotificationStore } from "@/store/use-notification-store";
import { useProductRequestStore } from "@/store/use-product-request-store";
import type {
  NotificationPreference,
  ProductCategory,
  ProductRequestRecord,
} from "@/types";

const CATEGORIES: ProductCategory[] = [
  "Fashion & Pakaian",
  "Sepatu & Sandal",
  "Tas & Aksesoris",
  "Elektronik & Gadget",
  "Peralatan Rumah Tangga",
  "Mainan & Hobi",
  "Kecantikan & Kosmetik",
  "Grosir Pabrik 1688",
  "Lainnya",
];

const SAMPLE_REQUEST = {
  productName: "Mesin Heat Press Sablon DTF Mini Portable 12x10 Inch",
  category: "Elektronik & Gadget" as ProductCategory,
  targetBudget: "Maksimal Rp 1.500.000 / unit",
  targetQuantity: "2 unit (Sampel Usaha)",
  specificationNotes:
    "Tegangan 220V colokan standard Indonesia (EU plug). Temperatur digital layar sentuh, include tatakan silikon anti panas.",
  referenceLink: "https://shopee.co.id/search?keyword=heat%20press%20mini",
};

export function ProductRequestForm({ className }: { className?: string }) {
  const { error, success, info } = useToast();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);
  const createProductRequest = useProductRequestStore(
    (s) => s.createProductRequest,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isUserLoggedIn = isMounted && isAuthenticated && !!user;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [productName, setProductName] = useState("");
  const [category, setCategory] =
    useState<ProductCategory>("Fashion & Pakaian");
  const [referenceImage, setReferenceImage] = useState<string | undefined>(
    undefined,
  );
  const [targetBudget, setTargetBudget] = useState("");
  const [targetQuantity, setTargetQuantity] = useState("");
  const [specificationNotes, setSpecificationNotes] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [notificationPref, setNotificationPref] =
    useState<NotificationPreference>("BOTH");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation modal
  const [confirmationData, setConfirmationData] =
    useState<ProductRequestRecord | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    if (!isUserLoggedIn) {
      info(
        "Wajib Masuk Terlebih Dahulu",
        "Silakan masuk ke akun Anda terlebih dahulu untuk mengunggah foto referensi.",
      );
      openLoginModal();
      return;
    }
    if (!file.type.startsWith("image/")) {
      error("Format Salah", "Pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      error("Ukuran Terlalu Besar", "Ukuran foto maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setReferenceImage(e.target?.result as string);
      success("Foto Terunggah", "Foto referensi produk berhasil ditambahkan.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleLoadSample = () => {
    if (!isUserLoggedIn) {
      info(
        "Wajib Masuk Terlebih Dahulu",
        "Silakan masuk ke akun Anda terlebih dahulu untuk mencoba request pencarian produk.",
      );
      openLoginModal();
      return;
    }
    setProductName(SAMPLE_REQUEST.productName);
    setCategory(SAMPLE_REQUEST.category);
    setTargetBudget(SAMPLE_REQUEST.targetBudget);
    setTargetQuantity(SAMPLE_REQUEST.targetQuantity);
    setSpecificationNotes(SAMPLE_REQUEST.specificationNotes);
    setReferenceLink(SAMPLE_REQUEST.referenceLink);

    success(
      "Contoh Request Diisi",
      "Formulir pencarian produk contoh berhasil diisi otomatis.",
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      error(
        "Wajib Masuk Terlebih Dahulu",
        "Anda harus masuk ke akun Anda terlebih dahulu untuk mengajukan request cari produk.",
      );
      openLoginModal();
      return;
    }

    if (!productName.trim()) {
      error(
        "Nama Produk Kosong",
        "Tuliskan nama atau deskripsi produk yang ingin dicari.",
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
        "Cantumkan nomor WhatsApp aktif agar tim kami dapat mengirimkan hasil sourcing.",
      );
      return;
    }

    if (requiresEmail && !finalEmail) {
      error(
        "Email Diperlukan",
        "Cantumkan alamat email Anda agar penawaran pabrik dapat dikirim ke inbox Anda.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newRecord = createProductRequest({
        productName: productName.trim(),
        category,
        referenceImage,
        targetBudget: targetBudget.trim(),
        targetQuantity: targetQuantity.trim(),
        specificationNotes: specificationNotes.trim(),
        referenceLink: referenceLink.trim(),
        notificationPreference: notificationPref,
        userName: finalName,
        userPhone: finalPhone,
        userEmail: finalEmail,
        userId: user?.id,
        warehouseCode: user?.warehouseCode,
      });

      // Dispatch in-app notification
      useNotificationStore.getState().addNotification({
        title: `Request Sourcing Terkirim (${newRecord.id})`,
        message: `Permintaan pencarian produk "${newRecord.productName}" telah diterima tim sourcing China. Estimasi info supplier 1x24 jam.`,
        type: "ORDER",
        badgeText: "Sourcing China",
        linkUrl: "/profile",
      });

      // Reset form
      setProductName("");
      setReferenceImage(undefined);
      setTargetBudget("");
      setTargetQuantity("");
      setSpecificationNotes("");
      setReferenceLink("");
      if (!isAuthenticated) {
        setGuestName("");
        setGuestPhone("");
        setGuestEmail("");
      }

      setConfirmationData(newRecord);
      setIsConfirmationOpen(true);
      success(
        "Permintaan Diterima",
        `Request #${newRecord.id} berhasil dibuat.`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat memproses formulir.";
      error("Gagal Mengirim", msg);
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
                SOURCING 1688 • PABRIK CHINA
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-sans font-black text-slate-900 tracking-tight leading-tight">
                Masuk untuk Request Cari Produk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                Untuk meminta tim sourcing China FLYPICK mencarikan supplier
                tangan pertama, cek sampel, serta menghitung estimasi landing
                cost ke Indonesia, silakan masuk ke akun Anda terlebih dahulu.
              </p>
            </div>

            {/* Interactive Preview Mockup Box */}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              onClick={() => {
                info(
                  "Wajib Masuk Akun",
                  "Silakan masuk ke akun FLYPICK Anda untuk mengajukan request cari produk.",
                );
                openLoginModal();
              }}
              className="relative p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border-2 border-dashed border-slate-200 hover:border-[#1035D0]/50 transition-all cursor-pointer group space-y-2.5 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-100/70 text-[#1035D0] flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      Mesin Heat Press Sablon DTF Mini Portable...
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Kategori: Elektronik &amp; Gadget
                    </span>
                  </div>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1035D0] transition-colors shrink-0" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-slate-500 pt-1 border-t border-slate-200/60">
                <span className="group-hover:text-[#1035D0] transition-colors flex items-center gap-1">
                  🔒 Klik di sini untuk masuk &amp; ajukan request
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
                  <Search className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Sourcing Tangan-1
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Tim kami di China carikan pabrik terverifikasi di 1688.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                  <PackageCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Riset di Dashboard
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Rekomendasi supplier &amp; harga tersimpan di profil Anda.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-1">
                <div className="w-6 h-6 rounded-lg bg-purple-600/10 text-purple-600 flex items-center justify-center">
                  <Warehouse className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Konsultasi Gratis
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Diskusi spesifikasi barang tanpa biaya komitmen awal.
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
              <p className="text-center text-[11px] text-slate-400 font-sans mt-2">
                Belum punya akun? Pendaftaran cepat via WhatsApp OTP atau Email
                &amp; Password.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Strip with Sample Request Button */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1035D0] animate-pulse" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Cari Produk Tanpa Link China
                </span>
                {user?.warehouseCode && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-mono text-[10px] font-bold">
                    {user.warehouseCode}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1035D0] hover:underline cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Coba Request Contoh</span>
              </button>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 text-xs text-slate-600 flex items-start gap-2.5">
              <Package className="w-4 h-4 text-[#1035D0] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Punya barang yang ingin dicari di pabrik China tapi tidak punya
                link 1688/Taobao? Tuliskan nama produk, unggah foto, atau
                cantumkan link referensi. Tim kami carikan supplier tangan
                pertama termurah.
              </p>
            </div>

            {/* ── Product Name Input (Required) ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="product-name-input"
                className="block text-xs font-bold text-slate-700 font-mono"
              >
                NAMA PRODUK / KATA KUNCI <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="product-name-input"
                  type="text"
                  required
                  placeholder="Contoh: Sepatu Sneakers Chunky Vintage / Panci Elektrik Mini"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0] focus:ring-1 focus:ring-[#1035D0]/30 transition-all"
                />
              </div>
            </div>

            {/* ── Category & Reference Photo (Two Columns) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category */}
              <div className="space-y-1.5">
                <label
                  htmlFor="category-select"
                  className="block text-xs font-bold text-slate-700 font-mono"
                >
                  KATEGORI BARANG
                </label>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white px-3 py-2.5 rounded-xl border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-[#1035D0] font-sans cursor-pointer transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload / Drag Drop */}
              <div className="space-y-1.5">
                {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="block text-xs font-bold text-slate-700 font-mono">
                  FOTO / GAMBAR CONTOH
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {referenceImage ? (
                  <div className="relative flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={referenceImage}
                      alt="Preview referensi"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                    />
                    <span className="text-[11px] font-medium text-slate-700 truncate flex-1">
                      Foto terpasang
                    </span>
                    <button
                      type="button"
                      onClick={() => setReferenceImage(undefined)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
                      title="Hapus foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-[#1035D0] bg-slate-50/60 hover:bg-blue-50/30 text-slate-600 hover:text-[#1035D0] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload Foto (Opsional)</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Target Budget & Target Quantity ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="budget-input"
                  className="block text-xs font-bold text-slate-700 font-mono"
                >
                  TARGET BUDGET (OPSIONAL)
                </label>
                <input
                  id="budget-input"
                  type="text"
                  placeholder="Contoh: Maks Rp 200.000 / pcs"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white px-3 py-2 rounded-xl border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="quantity-input"
                  className="block text-xs font-bold text-slate-700 font-mono"
                >
                  TARGET JUMLAH / QTY
                </label>
                <input
                  id="quantity-input"
                  type="text"
                  placeholder="Contoh: 1 pcs sampel / 50 pcs grosir"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white px-3 py-2 rounded-xl border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0] transition-all"
                />
              </div>
            </div>

            {/* ── Specification Notes ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="notes-textarea"
                className="block text-xs font-bold text-slate-700 font-mono"
              >
                DETAIL SPESIFIKASI &amp; PERMINTAAN KHUSUS
              </label>
              <textarea
                id="notes-textarea"
                rows={2}
                placeholder="Warna yang diinginkan, ukuran, bahan/material, atau fitur spesifik..."
                value={specificationNotes}
                onChange={(e) => setSpecificationNotes(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0] resize-none transition-all"
              />
            </div>

            {/* ── Optional Reference Link (Shopee / TikTok / IG) ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="ref-link-input"
                className="block text-xs font-bold text-slate-700 font-mono"
              >
                LINK CONTOH PRODUK (JIKA ADA)
              </label>
              <input
                id="ref-link-input"
                type="url"
                placeholder="https://shopee.co.id/... atau TikTok / Instagram / Pinterest"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                className="w-full bg-slate-50/80 hover:bg-slate-50 focus:bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0] transition-all"
              />
            </div>

            {/* ── Notification Channel Preference Selection ─────────── */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-[#1035D0]" />
                  <span>Saluran Notifikasi Penawaran Sourcing:</span>
                </span>
                <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                  Pilih jalur update
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
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-500",
                    )}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold leading-tight">
                    WhatsApp
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Update Cepat
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationPref("EMAIL")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer select-none",
                    notificationPref === "EMAIL"
                      ? "bg-blue-50/90 border-[#1035D0] text-blue-950 shadow-xs ring-1 ring-[#1035D0]/40"
                      : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-600",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors",
                      notificationPref === "EMAIL"
                        ? "bg-[#1035D0] text-white"
                        : "bg-slate-200 text-slate-500",
                    )}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold leading-tight">Email</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Invoice Rinci
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
                        : "bg-slate-200 text-slate-500",
                    )}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold leading-tight">
                    Keduanya
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    WA &amp; Email
                  </span>
                </button>
              </div>
            </div>

            {/* ── Contact Info Section (Logged in Account) ───────────── */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5 font-sans">
                  <span className="text-[10px] text-[#1035D0] font-mono font-bold block uppercase">
                    Mengirim Sebagai Akun Terdaftar
                  </span>
                  <p className="font-bold text-slate-800">
                    {user?.name}{" "}
                    <span className="text-slate-500 font-normal">
                      (
                      {user?.phone ||
                        guestPhone ||
                        user?.email ||
                        guestEmail ||
                        "-"}
                      )
                    </span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white text-[#1035D0] text-[11px] font-mono font-bold border border-blue-200/60 shadow-2xs">
                  {user?.warehouseCode || "FP-MEMBER"}
                </span>
              </div>

              {/* In case user's profile is missing phone or email */}
              {!user?.phone &&
                (notificationPref === "WHATSAPP" ||
                  notificationPref === "BOTH") && (
                  <div className="space-y-1">
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                    <label className="text-[11px] font-bold text-slate-700 font-sans">
                      Nomor WhatsApp Anda (untuk hasil sourcing):
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Nomor WhatsApp Aktif *"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0]"
                    />
                  </div>
                )}

              {!user?.email &&
                (notificationPref === "EMAIL" ||
                  notificationPref === "BOTH") && (
                  <div className="space-y-1">
                    {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                    <label className="text-[11px] font-bold text-slate-700 font-sans">
                      Alamat Email Anda (untuk rincian supplier):
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Alamat Email Aktif *"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-slate-50/90 hover:bg-slate-50 focus:bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1035D0]"
                    />
                  </div>
                )}
            </div>

            {/* ── Submit Action Button ──────────────────────────────── */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="electric"
                size="lg"
                disabled={isSubmitting}
                className="w-full rounded-2xl py-3.5 text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mengirimkan Permintaan Sourcing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Kirim Permintaan Cari Produk (Gratis)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-slate-400 font-sans pt-2">
                🔒 Tanpa biaya pencarian awal. Tim kami akan mengirimkan link
                pabrik &amp; estimasi landing cost.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Modal */}
      <ProductRequestConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        request={confirmationData}
      />
    </>
  );
}
