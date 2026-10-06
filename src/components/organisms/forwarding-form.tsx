"use client";

import { PackageCheck, Sparkles, Truck } from "lucide-react";
import { Badge, Button, FormError, FormLabel } from "@/components/atoms";
import {
  PRESET_TRACKINGS,
  useForwardingForm,
} from "@/hooks/use-forwarding-form";
import { formatIdr } from "@/lib/utils";
import { ForwardingCategoryEnum } from "@/schemas/forwarding";

export function ForwardingForm() {
  const { form, declaredValue, handleApplyPreset, onSubmit } =
    useForwardingForm();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sample presets */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FFF8E1] border-2 border-dashed border-[#2323FF]">
        <span className="font-mono text-[11px] font-bold text-[#2323FF] uppercase flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Contoh Nomor Resi China:
        </span>
        {PRESET_TRACKINGS.map((sample) => (
          <button
            key={sample.code}
            type="button"
            onClick={() => handleApplyPreset(sample)}
            className="text-[11px] font-mono bg-white hover:bg-[#2323FF] hover:text-white px-2 py-0.5 border border-[#1A1A24] transition-colors cursor-pointer"
          >
            {sample.code} ({sample.courier.split(" ")[0]})
          </button>
        ))}
      </div>

      {/* Tracking Number Input */}
      <div className="space-y-2">
        <FormLabel htmlFor="chinaTrackingNumberInput" required>
          1. NOMOR RESI PENGIRIMAN DOMESTIK TIONGKOK
        </FormLabel>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
            <Truck className="w-4 h-4 text-[#2323FF]" />
          </div>
          <input
            id="chinaTrackingNumberInput"
            type="text"
            placeholder="Contoh: SF148902819001 atau YT9921008827"
            {...register("chinaTrackingNumber")}
            onChange={(e) => {
              setValue(
                "chinaTrackingNumber",
                e.target.value.toUpperCase().replace(/\s/g, ""),
              );
            }}
            className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-sm uppercase tracking-wider font-bold focus:outline-none focus:border-[#2323FF]"
          />
        </div>
        <p className="text-[11px] font-mono text-[#1A1A24]/60">
          Masukkan nomor resi kurir lokal (SF Express, ZTO, YTO, STO, dsb.) yang
          diberikan seller Anda.
        </p>
        <FormError message={errors.chinaTrackingNumber?.message} />
      </div>

      {/* Courier & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel htmlFor="itemCategoryInput" required>
            2. KATEGORI BARANG
          </FormLabel>
          <select
            id="itemCategoryInput"
            {...register("itemCategory")}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          >
            {ForwardingCategoryEnum.options.map((cat) => (
              <option key={cat} value={cat}>
                {cat} (
                {cat === "FASHION"
                  ? "Pakaian, Sepatu, Tas"
                  : cat === "BEAUTY"
                    ? "Kosmetik & Skincare Padat"
                    : cat === "ELECTRONICS"
                      ? "Elektronik & Sparepart"
                      : cat === "ACCESSORIES"
                        ? "Aksesoris & Perhiasan"
                        : "Lainnya"}
                )
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="courierNameInput">
            EKSPEDISI LOKAL CHINA (OPSIONAL)
          </FormLabel>
          <input
            id="courierNameInput"
            type="text"
            placeholder="Contoh: SF Express / ZTO Express"
            {...register("courierName")}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
        </div>
      </div>

      {/* Description & Qty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <FormLabel htmlFor="descriptionInput" required>
            3. DESKRIPSI ISI PAKET
          </FormLabel>
          <input
            id="descriptionInput"
            type="text"
            placeholder="Contoh: 3 Buah Hoodie Rajut & 1 Topi Beanie"
            {...register("description")}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          <FormError message={errors.description?.message} />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="qtyInput" required>
            JUMLAH PAKET (KOLI)
          </FormLabel>
          <input
            id="qtyInput"
            type="number"
            min="1"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          />
          <FormError message={errors.quantity?.message} />
        </div>
      </div>

      {/* Declared Value (IDR) */}
      <div className="p-4 bg-[#FFF8E1] border-2 border-[#1A1A24] space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel htmlFor="declaredValueIdrInput">
            4. ESTIMASI NILAI BARANG UNTUK ASURANSI CARGO (IDR)
          </FormLabel>
          <Badge variant="paper">{formatIdr(declaredValue)}</Badge>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-mono font-bold text-xs text-[#1A1A24]">
            Rp
          </span>
          <input
            id="declaredValueIdrInput"
            type="number"
            step="10000"
            min="0"
            placeholder="250000"
            {...register("declaredValueIdr", { valueAsNumber: true })}
            className="w-full pl-10 pr-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-sm font-bold focus:outline-none focus:border-[#2323FF]"
          />
        </div>
        <p className="text-[11px] font-mono text-[#1A1A24]/60">
          *Untuk Titip Kirim, Anda tidak membayar harga barang ke FLYPICK.
          Tagihan ongkos kirim internasional ditagih saat paket tiba di gudang
          Shanghai (Tahap 2).
        </p>
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <Button type="submit" variant="neon" size="lg" className="w-full">
          <PackageCheck className="w-5 h-5 mr-2" />+ DAFTARKAN RESI KE MANIFEST
          GUDANG
        </Button>
      </div>
    </form>
  );
}
