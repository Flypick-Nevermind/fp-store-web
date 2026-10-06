"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  type DeliveryAddress,
  DeliveryAddressSchema,
} from "@/schemas/checkout";
import { useCheckoutStore } from "@/store/use-checkout-store";

interface AddressStepProps {
  onNext: () => void;
}

export function AddressStep({ onNext }: AddressStepProps) {
  const deliveryAddress = useCheckoutStore((s) => s.deliveryAddress);
  const setDeliveryAddress = useCheckoutStore((s) => s.setDeliveryAddress);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryAddress>({
    resolver: zodResolver(DeliveryAddressSchema),
    defaultValues: deliveryAddress,
  });

  const onSubmit = (data: DeliveryAddress) => {
    setDeliveryAddress(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-[#1A1A24]/10">
        <MapPin className="w-5 h-5 text-[#2323FF]" />
        <div>
          <h3 className="font-mono text-sm font-bold uppercase text-[#1A1A24]">
            Langkah 1: Alamat Pengiriman Indonesia
          </h3>
          <p className="text-xs text-[#1A1A24]/70">
            Alamat tujuan akhir saat paket rilis dari bea cukai Bandara
            Cengkareng (CGK).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recipient Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="recipientNameInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Nama Lengkap Penerima <span className="text-red-600">*</span>
          </label>
          <input
            id="recipientNameInput"
            type="text"
            placeholder="Contoh: Ahmad Fikri"
            {...register("recipientName")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.recipientName && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.recipientName.message}
            </p>
          )}
        </div>

        {/* WhatsApp / Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="recipientPhoneInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Nomor Telepon / WhatsApp (+62){" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            id="recipientPhoneInput"
            type="text"
            placeholder="+6281299887766"
            {...register("phone")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.phone && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province */}
        <div className="space-y-1.5">
          <label
            htmlFor="provinceInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Provinsi <span className="text-red-600">*</span>
          </label>
          <input
            id="provinceInput"
            type="text"
            placeholder="DKI Jakarta"
            {...register("province")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.province && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.province.message}
            </p>
          )}
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label
            htmlFor="cityInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Kota / Kabupaten <span className="text-red-600">*</span>
          </label>
          <input
            id="cityInput"
            type="text"
            placeholder="Jakarta Selatan"
            {...register("city")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.city && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.city.message}
            </p>
          )}
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <label
            htmlFor="districtInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Kecamatan <span className="text-red-600">*</span>
          </label>
          <input
            id="districtInput"
            type="text"
            placeholder="Tebet"
            {...register("district")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.district && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.district.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Postal Code */}
        <div className="space-y-1.5 md:col-span-1">
          <label
            htmlFor="postalCodeInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Kode Pos <span className="text-red-600">*</span>
          </label>
          <input
            id="postalCodeInput"
            type="text"
            maxLength={5}
            placeholder="12810"
            {...register("postalCode")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.postalCode && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* Street Address */}
        <div className="space-y-1.5 md:col-span-3">
          <label
            htmlFor="streetAddressInput"
            className="block font-mono text-xs font-bold uppercase text-[#1A1A24]"
          >
            Alamat Lengkap & Patokan Rumah{" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            id="streetAddressInput"
            type="text"
            placeholder="Jl. Tebet Timur Raya No. 42B, RT 04 / RW 07"
            {...register("streetAddress")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.streetAddress && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.streetAddress.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button type="submit" variant="neon" size="md">
          SIMPAN & LANJUT KE JALUR FREIGHT ➔
        </Button>
      </div>
    </form>
  );
}
