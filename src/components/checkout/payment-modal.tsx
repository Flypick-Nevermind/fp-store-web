"use client";

import confetti from "canvas-confetti";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  MessageCircle,
  Plane,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/atoms";
import { useCheckoutMutation } from "@/hooks/use-order-api";
import { formatApiErrorMessage } from "@/lib/api-client";
import { formatIdr } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useCheckoutStore } from "@/store/use-checkout-store";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage1TotalIdr: number;
}

interface BankOption {
  id: "BCA" | "MANDIRI";
  name: string;
  accountNumber: string;
  accountName: string;
  logoText: string;
  bgBadge: string;
}

const BANK_ACCOUNTS: BankOption[] = [
  {
    id: "BCA",
    name: "Bank Central Asia (BCA)",
    accountNumber: "8801982177",
    accountName: "PT FLYPICK INDONESIA REKSA",
    logoText: "BCA",
    bgBadge: "bg-blue-600 text-white",
  },
  {
    id: "MANDIRI",
    name: "Bank Mandiri",
    accountNumber: "1370019821772",
    accountName: "PT FLYPICK INDONESIA REKSA",
    logoText: "MANDIRI",
    bgBadge: "bg-amber-600 text-white",
  },
];

export function PaymentModal({
  isOpen,
  onClose,
  stage1TotalIdr,
}: PaymentModalProps) {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useCheckoutStore((s) => s.createOrder);
  const deliveryAddress = useCheckoutStore((s) => s.deliveryAddress);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);

  const checkoutMutation = useCheckoutMutation();

  const [selectedBank, setSelectedBank] = useState<"BCA" | "MANDIRI">("BCA");
  const [senderAccountName, setSenderAccountName] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);

  const [isPaid, setIsPaid] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState<string>("");

  if (!isOpen) return null;

  const currentBank =
    BANK_ACCOUNTS.find((b) => b.id === selectedBank) || BANK_ACCOUNTS[0];

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(currentBank.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCopyTotal = () => {
    navigator.clipboard?.writeText(stage1TotalIdr.toString());
    setCopiedTotal(true);
    setTimeout(() => setCopiedTotal(false), 2000);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastError(
        "Format Salah",
        "Pilih file gambar struk (JPG, PNG, atau WebP).",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError("Ukuran Terlalu Besar", "Ukuran foto maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProofImage(event.target?.result as string);
      info("Bukti Dipilih", "Foto bukti transfer berhasil dimuat.");
    };
    reader.readAsDataURL(file);
  };

  const handleExecutePayment = async () => {
    if (!isAuthenticated || !user) {
      info(
        "Harap Masuk Akun",
        "Silakan masuk ke akun Anda terlebih dahulu agar pesanan tercatat di manifes.",
      );
      openLoginModal();
      return;
    }

    if (items.length === 0) {
      toastError(
        "Keranjang Kosong",
        "Tidak ada produk dalam keranjang untuk dicheckout.",
      );
      return;
    }

    if (!proofImage) {
      toastError(
        "Bukti Transfer Diperlukan",
        "Silakan unggah foto/screenshot struk bukti transfer terlebih dahulu.",
      );
      return;
    }

    // Check if any items don't have valid price yet
    const unpricedItems = items.filter(
      (it) => it.serviceType === "BUY_FOR_ME" && (it.priceIdr || 0) <= 0,
    );
    if (unpricedItems.length > 0) {
      toastError(
        "Item Belum Divalidasi",
        "Beberapa item di keranjang belum memiliki harga valid dari admin. Harap tunggu verifikasi selesai.",
      );
      return;
    }

    try {
      const shippingNotes = `Transfer Manual ${currentBank.id} - A.N Pengirim: ${
        senderAccountName.trim() || "-"
      } - Bukti Terlampir`;

      const response = await checkoutMutation.mutateAsync({
        items,
        deliveryAddress,
        paymentMethod: "MANUAL",
        shippingNotes,
        userId: user.id,
      });

      const orderNumber =
        response.order?.order_number ||
        response.order?.order_id ||
        `FP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      setCreatedOrderCode(orderNumber);

      // Record in local store for instant local cache
      createOrder(items, stage1TotalIdr);

      // Clear the cart
      clearCart();

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#1035D0", "#00F0FF", "#3B82F6"],
        });
      } catch (_e) {
        // fallback
      }

      setIsPaid(true);

      success(
        "Bukti Transfer Diterima!",
        `Nomor Pesanan ${orderNumber} berhasil diterbitkan dan masuk antrean verifikasi finance admin.`,
      );
    } catch (err: unknown) {
      const errorMsg = formatApiErrorMessage(err);
      toastError("Checkout Gagal", errorMsg);
    }
  };

  const handleGoToTracking = () => {
    onClose();
    router.push("/profile");
  };

  const isPending = checkoutMutation.isPending;

  // Pre-filled WhatsApp confirmation URL
  const waMessage = encodeURIComponent(
    `Halo Admin Flypick, saya sudah transfer untuk pesanan:\n` +
      `• No. Order: ${createdOrderCode}\n` +
      `• Total: ${formatIdr(stage1TotalIdr)}\n` +
      `• Bank Tujuan: ${currentBank.name}\n` +
      `• A.N Pengirim: ${senderAccountName.trim() || user?.name || "-"}\n\n` +
      `Mohon dibantu verifikasi pembayarannya. Terima kasih!`,
  );
  const waUrl = `https://api.whatsapp.com/send?phone=6281299887766&text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#DCE4EC] shadow-[0_24px_60px_-12px_rgba(16,53,208,0.25)] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1035D0] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#00F0FF]">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm tracking-tight text-white uppercase">
                Pembayaran Transfer Manual (1x Bayar)
              </h3>
              <p className="text-[11px] text-[#93C5FD]">
                Rekening Resmi Flypick &amp; Verifikasi Bukti Struk
              </p>
            </div>
          </div>
          {!isPaid && !isPending && (
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto">
          {!isPaid ? (
            <>
              {/* Total Invoice Box */}
              <div className="p-4 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] text-[#1E40AF] font-bold uppercase block">
                    TOTAL TAGIHAN ALL-IN:
                  </span>
                  <p className="font-mono text-2xl font-black text-[#1035D0] mt-0.5">
                    {formatIdr(stage1TotalIdr)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTotal}
                  className="px-2.5 py-1 text-xs font-mono font-bold text-[#1035D0] hover:bg-blue-100/70 border border-[#93C5FD] rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedTotal ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Nominal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bank Selector Tabs */}
              <div className="space-y-2">
                {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-xs font-bold text-slate-700 block">
                  Pilih Rekening Tujuan Transfer:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BANK_ACCOUNTS.map((bank) => {
                    const isSelected = selectedBank === bank.id;
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        disabled={isPending}
                        className={`p-3 rounded-xl font-sans text-xs font-bold border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1035D0] text-white border-[#1035D0] shadow-sm"
                            : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-[#00F0FF]" />
                        <span>{bank.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Account Info Card */}
              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Nomor Rekening {currentBank.id}:
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    REKENING UTAMA
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#CBD5E1]">
                  <div>
                    <p className="font-mono text-xl sm:text-2xl font-black text-[#1035D0] tracking-wider">
                      {currentBank.accountNumber}
                    </p>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                      a.n. {currentBank.accountName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="p-2 text-xs font-bold text-[#1035D0] hover:bg-[#EFF6FF] rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-blue-200"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin No. Rek</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Upload Proof of Payment */}
              <div className="space-y-3 pt-1">
                <div>
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                  <label className="text-xs font-bold text-slate-700 block">
                    Upload Bukti Pembayaran / Struk Transfer:{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Kirim foto struk ATM atau screenshot m-banking yang
                    menunjukkan nominal transfer.
                  </p>
                </div>

                {proofImage ? (
                  <div className="relative p-3 bg-slate-50 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
                        <img
                          src={proofImage}
                          alt="Bukti Transfer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Bukti Siap Dikirim</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Klik tombol silang di kanan jika ingin mengganti foto.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProofImage(null)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#CBD5E1] hover:border-[#1035D0] flex flex-col items-center justify-center space-y-2 text-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={isPending}
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1035D0] flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">
                        Klik untuk Pilih Foto Bukti Transfer
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Format JPG, PNG, atau WebP (Maks. 5MB)
                      </p>
                    </div>
                  </label>
                )}

                {/* Sender Account Name (Optional) */}
                <div>
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Nama Pemilik Rekening Pengirim (Opsional):
                  </label>
                  <input
                    type="text"
                    value={senderAccountName}
                    onChange={(e) => setSenderAccountName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    disabled={isPending}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1035D0] bg-slate-50"
                  />
                </div>
              </div>

              {/* Delivery recipient preview */}
              <div className="text-[11px] text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1E293B] block">
                    Alamat Pengantaran: {deliveryAddress.recipientName} (
                    {deliveryAddress.phone})
                  </span>
                  <span className="text-[#64748B] block truncate max-w-xs">
                    {deliveryAddress.city}, {deliveryAddress.streetAddress}
                  </span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
              </div>

              {/* Payment button connecting to backend */}
              <button
                type="button"
                disabled={isPending}
                onClick={handleExecutePayment}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#1035D0] hover:bg-[#0D2BAA] disabled:opacity-70 text-white font-sans font-bold text-sm rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
                    <span>Menerbitkan Order &amp; Mengirim Bukti...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                    <span>Kirim Bukti Bayar &amp; Terbitkan Pesanan</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Post-payment Success Card */
            <div className="text-center space-y-5 animate-in zoom-in-95 py-2">
              <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full mx-auto flex items-center justify-center text-amber-600 shadow-sm">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <Badge
                  variant="yellow"
                  className="bg-amber-100 text-amber-800 border-amber-300"
                >
                  MENUNGGU VERIFIKASI ADMIN
                </Badge>
                <h2 className="font-sans font-black text-xl text-[#0F172A] uppercase">
                  Bukti Pembayaran Diterima!
                </h2>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl inline-block my-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Nomor Pesanan Resmi
                  </span>
                  <p className="font-mono text-base text-[#1035D0] font-black tracking-wider">
                    {createdOrderCode}
                  </p>
                </div>

                <p className="text-xs text-[#64748B] max-w-sm mx-auto pt-1 leading-relaxed">
                  Pesanan Anda telah resmi dibuat. Tim Finance Admin Flypick
                  sedang memverifikasi mutasi transfer Anda. Begitu pembayaran
                  terverifikasi, barang akan langsung dibeli ke seller China.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi Cepat via WhatsApp Admin</span>
                </a>

                <button
                  type="button"
                  onClick={handleGoToTracking}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1035D0] hover:bg-[#0D2BAA] text-white font-sans font-bold text-xs rounded-xl shadow-[0_12px_24px_-4px_rgba(16,53,208,0.35)] transition-all cursor-pointer"
                >
                  <span>Lihat Status Pesanan di Profil</span>
                  <ArrowRight className="w-4 h-4 text-[#00F0FF]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
