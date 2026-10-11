"use client";

import {
  ExternalLink,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";
import { useToast } from "@/providers/toast-provider";
import { useNotificationStore } from "@/store/use-notification-store";
import { useProductRequestStore } from "@/store/use-product-request-store";
import type {
  ProductRequestRecord,
  ProductRequestStatus,
} from "@/types/product-request";

interface AdminProductRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ProductRequestRecord | null;
}

export function AdminProductRequestModal({
  isOpen,
  onClose,
  request,
}: AdminProductRequestModalProps) {
  const { success, error } = useToast();
  const updateRequestStatus = useProductRequestStore(
    (s) => s.updateRequestStatus,
  );
  const addSourcingResult = useProductRequestStore((s) => s.addSourcingResult);

  const [status, setStatus] = useState<ProductRequestStatus>(
    request?.status || "PENDING_SOURCING",
  );
  const [adminNotes, setAdminNotes] = useState(request?.adminNotes || "");

  // Form to add a new found supplier link
  const [showAddSource, setShowAddSource] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPlatform, setNewPlatform] = useState<
    "1688" | "Taobao" | "Tmall" | "Pabrik Langsung"
  >("1688");
  const [newPriceCny, setNewPriceCny] = useState<number>(0);
  const [newMinOrder, setNewMinOrder] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [newNotes, setNewNotes] = useState("");

  if (!isOpen || !request) return null;

  const handleSaveGeneral = () => {
    updateRequestStatus(request.id, status, adminNotes);
    success("Perubahan Disimpan", `Status request ${request.id} diperbarui.`);
  };

  const handleAddSourcingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      error("Field Belum Lengkap", "Judul barang dan URL wajib diisi.");
      return;
    }

    addSourcingResult(request.id, {
      title: newTitle.trim(),
      url: newUrl.trim(),
      platform: newPlatform,
      priceCny: Number(newPriceCny) || 0,
      minOrder: newMinOrder.trim(),
      supplierName: newSupplier.trim(),
      notes: newNotes.trim(),
    });

    // Reset sub-form
    setNewTitle("");
    setNewUrl("");
    setNewPriceCny(0);
    setNewMinOrder("");
    setNewSupplier("");
    setNewNotes("");
    setShowAddSource(false);

    success(
      "Supplier Ditambahkan",
      "Link produk hasil sourcing berhasil disimpan.",
    );
  };

  const handleSendNotification = () => {
    useNotificationStore.getState().addNotification({
      title: `Update Sourcing: ${request.productName}`,
      message: `Admin telah memperbarui status pencarian request #${request.id}: ${
        adminNotes || "Supplier telah ditemukan!"
      }`,
      type: "ORDER",
      badgeText: "Update Sourcing",
      linkUrl: "/profile",
    });

    success(
      "Notifikasi Terkirim",
      `Pemberitahuan telah dikirimkan ke ${request.userName} via ${
        request.notificationPreference === "BOTH"
          ? "WhatsApp & Email"
          : request.notificationPreference
      }.`,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#1035D0] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
              {request.id}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Diajukan:{" "}
              {new Date(request.createdAt).toLocaleDateString("id-ID")}
            </span>
          </div>
          <h2 className="font-sans font-black text-xl text-slate-900">
            Detail Request Produk: {request.productName}
          </h2>
        </div>

        {/* User Request Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
              Data Pemohon
            </span>
            <p className="font-bold text-slate-800">{request.userName}</p>
            <p className="text-slate-600 font-mono">WA: {request.userPhone}</p>
            {request.userEmail && (
              <p className="text-slate-600 font-mono">
                Email: {request.userEmail}
              </p>
            )}
            <p className="text-[#1035D0] font-mono">
              Notif: {request.notificationPreference}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
              Kategori &amp; Target
            </span>
            <p className="font-medium text-slate-700">
              Kategori: <strong>{request.category}</strong>
            </p>
            <p className="font-medium text-slate-700">
              Target Budget:{" "}
              <strong>{request.targetBudget || "Tidak ditentukan"}</strong>
            </p>
            <p className="font-medium text-slate-700">
              Target Qty:{" "}
              <strong>{request.targetQuantity || "Tidak ditentukan"}</strong>
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
              Foto &amp; Referensi
            </span>
            {request.referenceImage ? (
              <div className="flex items-center gap-2">
                <img
                  src={request.referenceImage}
                  alt="Referensi"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-2xs"
                />
                <span className="text-[11px] text-slate-500">
                  Foto terlampir
                </span>
              </div>
            ) : (
              <p className="text-slate-400 italic">Tidak ada foto</p>
            )}

            {request.referenceLink && (
              <a
                href={request.referenceLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#1035D0] hover:underline flex items-center gap-1 font-mono text-[11px] pt-1 truncate"
              >
                <span className="truncate">{request.referenceLink}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Specification Notes from User */}
        {request.specificationNotes && (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs">
            <span className="font-bold text-amber-900 block font-mono text-[10px] uppercase">
              Catatan Spesifikasi Pengguna:
            </span>
            <p className="text-amber-950 mt-0.5">
              {request.specificationNotes}
            </p>
          </div>
        )}

        {/* Status Update & Admin Notes */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-req-status-select"
                className="block text-xs font-bold text-slate-700 font-mono"
              >
                STATUS SOURCING
              </label>
              <select
                id="admin-req-status-select"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ProductRequestStatus)
                }
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1035D0]"
              >
                <option value="PENDING_SOURCING">
                  Antrian Sourcing (Pending)
                </option>
                <option value="SOURCING_IN_PROGRESS">
                  Sedang Dicari di Pabrik China
                </option>
                <option value="SOURCED">
                  Supplier Ditemukan (Ready Link &amp; Harga)
                </option>
                <option value="UNAVAILABLE">
                  Barang Tidak Tersedia / Belum Ditemukan
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-req-notes-input"
                className="block text-xs font-bold text-slate-700 font-mono"
              >
                CATATAN SOURCING TIM CHINA
              </label>
              <input
                id="admin-req-notes-input"
                type="text"
                placeholder="cth: Stok ready di pabrik Zhejiang, colokan 220V..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#1035D0]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="paper"
              size="sm"
              onClick={handleSaveGeneral}
              className="text-xs font-bold"
            >
              Simpan Status &amp; Catatan
            </Button>
          </div>
        </div>

        {/* Sourcing Results Section */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Link Supplier Ditemukan ({request.sourcingResults.length})
              </span>
            </span>

            <Button
              type="button"
              variant="electric"
              size="sm"
              onClick={() => setShowAddSource(!showAddSource)}
              className="text-xs font-bold"
            >
              <Plus className="w-3 h-3 mr-1" />
              <span>+ Input Link Supplier Baru</span>
            </Button>
          </div>

          {/* Add Supplier Form Drawer */}
          {showAddSource && (
            <form
              onSubmit={handleAddSourcingItem}
              className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in duration-150"
            >
              <h4 className="font-sans font-bold text-xs text-[#1035D0] uppercase font-mono">
                Input Penawaran Supplier dari China
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1 sm:col-span-2">
                  <label
                    htmlFor="supplier-title-input"
                    className="text-[10px] font-mono font-bold text-slate-600 block"
                  >
                    Judul Produk / Nama Pabrik *
                  </label>
                  <input
                    id="supplier-title-input"
                    type="text"
                    required
                    placeholder="cth: EasyPress Portable 12x10 Inch 220V"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="supplier-platform-select"
                    className="text-[10px] font-mono font-bold text-slate-600 block"
                  >
                    Platform Sourcing
                  </label>
                  <select
                    id="supplier-platform-select"
                    value={newPlatform}
                    onChange={(e) =>
                      setNewPlatform(
                        e.target.value as
                          | "1688"
                          | "Taobao"
                          | "Tmall"
                          | "Pabrik Langsung",
                      )
                    }
                    className="w-full bg-white px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  >
                    <option value="1688">1688 (Grosir Pabrik)</option>
                    <option value="Taobao">Taobao</option>
                    <option value="Tmall">Tmall Official</option>
                    <option value="Pabrik Langsung">
                      Pabrik Langsung / OEM
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="supplier-url-input"
                  className="text-[10px] font-mono font-bold text-slate-600 block"
                >
                  URL Link Produk China *
                </label>
                <input
                  id="supplier-url-input"
                  type="url"
                  required
                  placeholder="https://detail.1688.com/offer/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label
                    htmlFor="supplier-price-input"
                    className="text-[10px] font-mono font-bold text-slate-600 block"
                  >
                    Harga Satuan (CNY ¥)
                  </label>
                  <input
                    id="supplier-price-input"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="¥0"
                    value={newPriceCny || ""}
                    onChange={(e) => setNewPriceCny(Number(e.target.value))}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                  />
                  {newPriceCny > 0 && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      ~Rp{" "}
                      {Math.round(
                        newPriceCny * BRANDING.exchangeRate.cnyToIdr,
                      ).toLocaleString("id-ID")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="supplier-minorder-input"
                    className="text-[10px] font-mono font-bold text-slate-600 block"
                  >
                    Min. Order (MOQ)
                  </label>
                  <input
                    id="supplier-minorder-input"
                    type="text"
                    placeholder="cth: 1 unit / 10 pcs"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="supplier-name-input"
                    className="text-[10px] font-mono font-bold text-slate-600 block"
                  >
                    Nama Supplier Pabrik
                  </label>
                  <input
                    id="supplier-name-input"
                    type="text"
                    placeholder="cth: Zhejiang Tech Co."
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1035D0] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#0D2CA8] transition-colors cursor-pointer"
                >
                  Tambahkan Hasil Sourcing
                </button>
              </div>
            </form>
          )}

          {/* List of existing sourced results */}
          {request.sourcingResults.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              Belum ada link supplier yang dimasukkan untuk request ini.
            </p>
          ) : (
            <div className="space-y-2">
              {request.sourcingResults.map((src) => (
                <div
                  key={src.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold font-mono">
                        {src.platform}
                      </span>
                      <span className="font-bold text-slate-800">
                        {src.title}
                      </span>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1035D0] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="truncate max-w-sm">{src.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-600">
                      ¥{src.priceCny}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      Rp {src.priceIdr.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bottom: Notify Customer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <Button
            type="button"
            variant="electric"
            size="md"
            onClick={handleSendNotification}
            className="text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Notifikasi Update ke Pengguna</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
