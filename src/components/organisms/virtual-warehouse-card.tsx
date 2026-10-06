"use client";

import { Copy, MapPin, Phone, User, Warehouse } from "lucide-react";
import { Badge, Barcode, Button } from "@/components/atoms";
import { AddressCopyRow } from "@/components/molecules";
import { BRANDING } from "@/config/branding";
import { useWarehousePass } from "@/hooks/use-warehouse-pass";

export function VirtualWarehouseCard() {
  const { user, warehouse, copiedField, fullAddressText, copyToClipboard } =
    useWarehousePass();

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

        {/* Structured Address Breakdown Fields with AddressCopyRow molecule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddressCopyRow
            label="收件人 / Nama Penerima"
            value={warehouse.recipientName}
            icon={<User className="w-3 h-3 text-[#2323FF]" />}
            isCopied={copiedField === "Nama Penerima"}
            onCopy={() =>
              copyToClipboard(warehouse.recipientName, "Nama Penerima")
            }
          />

          <AddressCopyRow
            label="电话 / Nomor HP Gudang China"
            value={warehouse.phone}
            icon={<Phone className="w-3 h-3 text-[#2323FF]" />}
            isCopied={copiedField === "Nomor HP"}
            onCopy={() => copyToClipboard(warehouse.phone, "Nomor HP")}
          />

          <AddressCopyRow
            label="所在地区 / Wilayah"
            value={`${warehouse.province} ${warehouse.city} ${warehouse.district}`}
            icon={<MapPin className="w-3 h-3 text-[#2323FF]" />}
            isCopied={copiedField === "Wilayah Provinsi & Kota"}
            onCopy={() =>
              copyToClipboard(
                `${warehouse.province} ${warehouse.city} ${warehouse.district}`,
                "Wilayah Provinsi & Kota",
              )
            }
          />

          <AddressCopyRow
            label="邮编 / Kode Pos"
            value={warehouse.postalCode}
            isCopied={copiedField === "Kode Pos"}
            onCopy={() => copyToClipboard(warehouse.postalCode, "Kode Pos")}
          />

          <AddressCopyRow
            label="详细地址 / Alamat Lengkap Jalan & Gudang"
            value={warehouse.streetAddress}
            isCopied={copiedField === "Alamat Jalan"}
            onCopy={() =>
              copyToClipboard(warehouse.streetAddress, "Alamat Jalan")
            }
            fullWidth
          />
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
