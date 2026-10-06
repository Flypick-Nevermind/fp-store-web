"use client";

import { Check, Copy, MapPin, Phone, User, Warehouse } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";

export function VirtualWarehouseCard() {
  const user = useAuthStore((s) => s.user);
  const { success } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const warehouse = user?.addressChina || {
    recipientName: `Ahmad Fikri [${BRANDING.defaultWarehouseCode}]`,
    phone: BRANDING.warehouse.shanghai.phone,
    province: BRANDING.warehouse.shanghai.province,
    city: BRANDING.warehouse.shanghai.city,
    district: BRANDING.warehouse.shanghai.district,
    streetAddress: `${BRANDING.warehouse.shanghai.streetAddress} (User ID: ${BRANDING.defaultWarehouseCode})`,
    postalCode: BRANDING.warehouse.shanghai.postalCode,
    hubCode: BRANDING.warehouse.shanghai.hubCode,
  };

  const fullAddressText = `收件人 (Nama): ${warehouse.recipientName}
电话 (Telepon): ${warehouse.phone}
省市区 (Provinsi/Kota/Distrik): ${warehouse.province} ${warehouse.city} ${warehouse.district}
详细地址 (Alamat Lengkap): ${warehouse.streetAddress}
邮政编码 (Kode Pos): ${warehouse.postalCode}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    success("Berhasil Disalin!", `${label} disalin ke clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative bg-white border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] overflow-hidden">
      {/* Luggage Tag Header Cutout Style */}
      <div className="bg-[#2323FF] text-[#FFF8E1] p-5 relative border-b-2 border-[#1A1A24]">
        {/* Luggage Eyelet Ring in Center */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF8E1] border-2 border-[#1A1A24] flex items-center justify-center font-mono font-black text-[#2323FF]">
              <div className="w-4 h-4 rounded-full border-2 border-[#2323FF] bg-[#1A1A24]" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-widest font-bold">
                OFFICIAL CARGO LUGGAGE TAG
              </p>
              <h2 className="font-mono text-lg font-black tracking-wider text-white uppercase">
                VIRTUAL WAREHOUSE PASS
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-[10px] text-white/70 block uppercase">
              KODE GUDANG ANDA
            </span>
            <span className="inline-block bg-[#00F0FF] text-[#1A1A24] font-mono text-sm sm:text-base font-black px-2.5 py-0.5 border border-[#1A1A24]">
              {user ? user.warehouseCode : BRANDING.defaultWarehouseCode}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tag Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Notice on how to use */}
        <div className="p-3 bg-[#FFF8E1] border-2 border-[#1A1A24] flex items-start gap-3">
          <Warehouse className="w-5 h-5 text-[#2323FF] shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-[#1A1A24]">
              Cara Menggunakan Alamat Ini di Taobao / 1688 / Tmall:
            </p>
            <p className="text-[#1A1A24]/80">
              Salin alamat ini dan tempel di formulir alamat pengiriman
              marketplace Tiongkok Anda. Jangan lupa cantumkan kode unik{" "}
              <strong>
                {user?.warehouseCode || BRANDING.defaultWarehouseCode}
              </strong>{" "}
              agar paket otomatis masuk ke akun Anda.
            </p>
          </div>
        </div>

        {/* Structured Address Breakdown Fields with Instant Copy buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Field 1: Recipient Name */}
          <div className="p-3 bg-white border-2 border-[#1A1A24]/30 hover:border-[#2323FF] transition-colors relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-[#2323FF]" /> 收件人 / Nama
                Penerima
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(warehouse.recipientName, "Nama Penerima")
                }
                className="font-mono text-[10px] text-[#2323FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === "Nama Penerima" ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Salin
              </button>
            </div>
            <p className="font-mono text-xs font-bold text-[#1A1A24] select-all">
              {warehouse.recipientName}
            </p>
          </div>

          {/* Field 2: Phone */}
          <div className="p-3 bg-white border-2 border-[#1A1A24]/30 hover:border-[#2323FF] transition-colors relative group">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#2323FF]" /> 电话 / Nomor HP
                Gudang China
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(warehouse.phone, "Nomor HP")}
                className="font-mono text-[10px] text-[#2323FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === "Nomor HP" ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Salin
              </button>
            </div>
            <p className="font-mono text-xs font-bold text-[#1A1A24] select-all">
              {warehouse.phone}
            </p>
          </div>

          {/* Field 3: Province & City */}
          <div className="p-3 bg-white border-2 border-[#1A1A24]/30 hover:border-[#2323FF] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2323FF]" /> 所在地区 / Wilayah
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `${warehouse.province} ${warehouse.city} ${warehouse.district}`,
                    "Wilayah Provinsi & Kota",
                  )
                }
                className="font-mono text-[10px] text-[#2323FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === "Wilayah Provinsi & Kota" ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Salin
              </button>
            </div>
            <p className="font-mono text-xs font-bold text-[#1A1A24] select-all">
              {warehouse.province} {warehouse.city} {warehouse.district}
            </p>
          </div>

          {/* Field 4: Postal Code */}
          <div className="p-3 bg-white border-2 border-[#1A1A24]/30 hover:border-[#2323FF] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase">
                邮编 / Kode Pos
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(warehouse.postalCode, "Kode Pos")
                }
                className="font-mono text-[10px] text-[#2323FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === "Kode Pos" ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Salin
              </button>
            </div>
            <p className="font-mono text-xs font-bold text-[#1A1A24] select-all">
              {warehouse.postalCode}
            </p>
          </div>

          {/* Field 5: Full Street Address */}
          <div className="md:col-span-2 p-3 bg-white border-2 border-[#1A1A24]/30 hover:border-[#2323FF] transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase">
                详细地址 / Alamat Lengkap Jalan & Gudang
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(warehouse.streetAddress, "Alamat Jalan")
                }
                className="font-mono text-[10px] text-[#2323FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === "Alamat Jalan" ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Salin
              </button>
            </div>
            <p className="font-mono text-xs font-bold text-[#1A1A24] select-all leading-relaxed">
              {warehouse.streetAddress}
            </p>
          </div>
        </div>

        {/* Master One-Click Copy Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="neon"
            size="lg"
            className="flex-1"
            onClick={() =>
              copyToClipboard(fullAddressText, "Semua Alamat Gudang")
            }
          >
            <Copy className="w-4 h-4 mr-2" />
            SALIN ALAMAT GUDANG (LENGKAP 1-KLIK)
          </Button>
        </div>
      </div>

      {/* Ticket Cutout Footer with Barcode */}
      <div className="bg-[#FFF8E1] p-4 border-t-2 border-dashed border-[#1A1A24]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="electric">SHANGHAI FREE TRADE ZONE</Badge>
          <span className="font-mono text-[10px] text-[#1A1A24]/70">
            HUB: {warehouse.hubCode}
          </span>
        </div>
        <Barcode
          value={`FP-${user?.warehouseCode || "8821"}-SHANGHAI`}
          height={24}
        />
      </div>
    </div>
  );
}
