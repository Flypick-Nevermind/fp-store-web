"use client";

import { Box, Camera, CheckCircle2, Scale, UserCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { QcInspectionData } from "@/types";

interface QcUnboxingCardProps {
  qcData: QcInspectionData;
  orderId: string;
}

export function QcUnboxingCard({ qcData, orderId }: QcUnboxingCardProps) {
  const [activePhoto, setActivePhoto] = useState(qcData.photoUrls[0]);

  return (
    <div className="bg-[#FFF8E1] border-2 border-[#2323FF] shadow-[4px_4px_0px_0px_#1A1A24] p-4 sm:p-6 space-y-5">
      {/* QC Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-[#1A1A24]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2323FF] text-[#00F0FF] flex items-center justify-center border border-[#1A1A24] shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-[#2323FF]">
                LAPORAN INSPEKSI PHOTO QC SHANGHAI
              </span>
              <Badge variant="electric">LOLOS QC GUDANG</Badge>
            </div>
            <p className="font-mono text-[11px] text-[#1A1A24]/70">
              Diperiksa di Pudong FTZ Hub (PVG-01) pada {qcData.inspectedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rubber-stamp text-[#2323FF] border-[#2323FF] text-[10px] bg-white">
            PASSED &amp; SEALED
          </span>
        </div>
      </div>

      {/* QC Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Photos Gallery */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Photo View */}
          <div className="relative aspect-4/3 bg-white border-2 border-[#1A1A24] overflow-hidden group">
            <img
              src={activePhoto}
              alt="Bukti Foto QC Shanghai"
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            {/* Watermark Tag */}
            <div className="absolute bottom-2 left-2 bg-[#1A1A24]/85 text-[#00F0FF] px-2 py-1 font-mono text-[10px] border border-[#00F0FF]/40">
              SHANGHAI PVG QC SEAL • {orderId}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {qcData.photoUrls.map((url, idx) => (
              <button
                type="button"
                key={url}
                onClick={() => setActivePhoto(url)}
                className={`relative w-20 h-16 border-2 transition-all shrink-0 cursor-pointer overflow-hidden ${
                  activePhoto === url
                    ? "border-[#2323FF] ring-2 ring-[#00F0FF]"
                    : "border-[#1A1A24]/40 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Physical Attributes & Checklist */}
        <div className="lg:col-span-5 space-y-4">
          {/* Weight & Dimension Badge Box */}
          <div className="bg-white border-2 border-[#1A1A24] p-3 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1A1A24]/10">
              <span className="text-[#1A1A24]/70 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-[#2323FF]" /> Berat Timbang
                Riil:
              </span>
              <span className="font-black text-[#2323FF] text-sm">
                {qcData.weightKg} kg
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-[#1A1A24]/10">
              <span className="text-[#1A1A24]/70 flex items-center gap-1">
                <Box className="w-3.5 h-3.5 text-[#2323FF]" /> Dimensi Paket:
              </span>
              <span className="font-bold text-[#1A1A24]">
                {qcData.dimensionsCm}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#1A1A24]/70 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#2323FF]" /> Petugas QC:
              </span>
              <span className="font-bold text-[#1A1A24]">
                {qcData.inspectorName}
              </span>
            </div>
          </div>

          {/* Checklist Verification Items */}
          <div className="bg-white border-2 border-[#1A1A24] p-3.5 space-y-2">
            <p className="font-mono text-[11px] font-bold uppercase text-[#1A1A24] tracking-wider">
              CHECKLIST PEMERIKSAAN FISIK:
            </p>
            <ul className="space-y-1.5 text-xs font-sans text-[#1A1A24]/85">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2323FF] shrink-0" />
                <span>Kesesuaian Label &amp; SKU Toko Taobao</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2323FF] shrink-0" />
                <span>Warna &amp; Ukuran Fisik Sesuai Pesanan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2323FF] shrink-0" />
                <span>Kondisi Kotak Utuh Tanpa Cacat Mayor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2323FF] shrink-0" />
                <span>Ekstra Bubble Wrap 3-Lapis Terpasang</span>
              </li>
            </ul>
          </div>

          {/* Inspector Notes */}
          <div className="p-3 bg-white/70 border border-[#2323FF] text-[11px] font-sans text-[#1A1A24]/90 space-y-1">
            <p className="font-mono font-bold text-[#2323FF] uppercase text-[10px]">
              Catatan Lapangan Petugas:
            </p>
            <p className="italic leading-relaxed">
              &quot;{qcData.qcNotes}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
