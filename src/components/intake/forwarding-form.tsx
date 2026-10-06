"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, PackageCheck, Sparkles, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIdr, generateId } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import {
  type CreateForwardingInput,
  CreateForwardingInputSchema,
  ForwardingCategoryEnum,
} from "@/schemas/forwarding";
import { useCartStore } from "@/store/use-cart-store";

const PRESET_TRACKINGS = [
  {
    code: "SF188290182991",
    category: "FASHION" as const,
    desc: "Sepatu Boots & Kardus Tambahan",
    courier: "SF Express (顺丰)",
  },
  {
    code: "YT98201948102",
    category: "ELECTRONICS" as const,
    desc: "Wireless Microphone Set 2.4G",
    courier: "Yuantong Express (圆通)",
  },
  {
    code: "JD0019283746",
    category: "BEAUTY" as const,
    desc: "Skincare Ampoule & Cushion Pack",
    courier: "JD Logistics (京东物流)",
  },
];

export function ForwardingForm() {
  const { success } = useToast();
  const addItem = useCartStore((s) => s.addItem);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateForwardingInput>({
    resolver: zodResolver(CreateForwardingInputSchema),
    defaultValues: {
      serviceType: "FORWARDING",
      chinaTrackingNumber: "",
      itemCategory: "FASHION",
      quantity: 1,
      declaredValueIdr: 250000,
      description: "",
      courierName: "",
    },
  });

  const declaredValue = watch("declaredValueIdr") || 0;

  const onSubmit = (values: CreateForwardingInput) => {
    const newItem = {
      ...values,
      id: generateId("FP-FWD"),
      chinaTrackingNumber: values.chinaTrackingNumber.toUpperCase().trim(),
    };

    addItem(newItem);
    success(
      "Tiket Titip Kirim Berhasil Dibuat!",
      `Resi ${newItem.chinaTrackingNumber} terdaftar di manifest kedatangan Shanghai.`,
    );

    reset({
      serviceType: "FORWARDING",
      chinaTrackingNumber: "",
      itemCategory: "FASHION",
      quantity: 1,
      declaredValueIdr: 0,
      description: "",
      courierName: "",
    });
  };

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
            onClick={() => {
              setValue("chinaTrackingNumber", sample.code, {
                shouldValidate: true,
              });
              setValue("itemCategory", sample.category, {
                shouldValidate: true,
              });
              setValue("description", sample.desc, { shouldValidate: true });
              setValue("courierName", sample.courier, { shouldValidate: true });
            }}
            className="text-[11px] font-mono bg-white hover:bg-[#2323FF] hover:text-white px-2 py-0.5 border border-[#1A1A24] transition-colors"
          >
            {sample.code} ({sample.courier.split(" ")[0]})
          </button>
        ))}
      </div>

      {/* Tracking Number Input */}
      <div className="space-y-2">
        <label
          htmlFor="chinaTrackingNumberInput"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
        >
          1. NOMOR RESI PENGIRIMAN DOMESTIK TIONGKOK{" "}
          <span className="text-red-600">*</span>
        </label>
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
        {errors.chinaTrackingNumber && (
          <p className="font-mono text-[11px] text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.chinaTrackingNumber.message}
          </p>
        )}
      </div>

      {/* Courier & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="itemCategoryInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            2. KATEGORI BARANG <span className="text-red-600">*</span>
          </label>
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
          <label
            htmlFor="courierNameInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            EKSPEDISI LOKAL CHINA (OPSIONAL)
          </label>
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
          <label
            htmlFor="descriptionInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            3. DESKRIPSI ISI PAKET <span className="text-red-600">*</span>
          </label>
          <input
            id="descriptionInput"
            type="text"
            placeholder="Contoh: 3 Buah Hoodie Rajut & 1 Topi Beanie"
            {...register("description")}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.description && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="qtyInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            JUMLAH PAKET (KOLI) <span className="text-red-600">*</span>
          </label>
          <input
            id="qtyInput"
            type="number"
            min="1"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.quantity && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* Declared Value (IDR) */}
      <div className="p-4 bg-[#FFF8E1] border-2 border-[#1A1A24] space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="declaredValueIdrInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            4. ESTIMASI NILAI BARANG UNTUK ASURANSI CARGO (IDR)
          </label>
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
