"use client";

import { Plane, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { Badge, Barcode } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { BuyForMeForm } from "./buy-for-me-form";
import { ForwardingForm } from "./forwarding-form";

export function IntakeTabs() {
  const [activeTab, setActiveTab] = useState<"BUY_FOR_ME" | "FORWARDING">(
    "BUY_FOR_ME",
  );

  return (
    <div className="relative bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF]">
      {/* Flight Ticket Top Header */}
      <div className="bg-[#2323FF] text-[#FFF8E1] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A24]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00F0FF] text-[#1A1A24] border-2 border-[#1A1A24] flex items-center justify-center font-mono font-black text-sm">
            01
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00F0FF] font-bold">
                CROSS-BORDER INTAKE TERMINAL
              </span>
              <Badge variant="yellow">FAST-TRACK</Badge>
            </div>
            <h2 className="font-mono text-base sm:text-lg font-black tracking-tight text-white uppercase">
              Pilih Layanan Impor Tiongkok Anda
            </h2>
          </div>
        </div>

        {/* Airport Route Indicator */}
        <div className="flex items-center gap-3 bg-[#1A1A24] px-3 py-1.5 border border-[#00F0FF] font-mono text-xs text-white shrink-0">
          <span className="text-[#00F0FF] font-black">PVG</span>
          <span className="text-white/60">➔</span>
          <Plane className="w-3.5 h-3.5 text-[#FFDE00]" />
          <span className="text-white/60">➔</span>
          <span className="text-[#00F0FF] font-black">CGK</span>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="grid grid-cols-2 p-3 gap-2 bg-[#FFF8E1] border-b-2 border-[#1A1A24]">
        <button
          type="button"
          onClick={() => setActiveTab("BUY_FOR_ME")}
          className={cn(
            "p-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer",
            activeTab === "BUY_FOR_ME"
              ? "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24]"
              : "bg-white text-[#1A1A24] border-[#1A1A24]/30 hover:border-[#1A1A24]",
          )}
        >
          <ShoppingBag className="w-4 h-4 text-[#00F0FF]" />
          <span>1. TITIP DIBELIIN</span>
          <span className="hidden lg:inline text-[10px] text-white/70 font-normal">
            (Paste Link)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FORWARDING")}
          className={cn(
            "p-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all cursor-pointer",
            activeTab === "FORWARDING"
              ? "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24]"
              : "bg-white text-[#1A1A24] border-[#1A1A24]/30 hover:border-[#1A1A24]",
          )}
        >
          <Truck className="w-4 h-4 text-[#00F0FF]" />
          <span>2. TITIP KIRIM</span>
          <span className="hidden lg:inline text-[10px] text-white/70 font-normal">
            (Input Resi China)
          </span>
        </button>
      </div>

      {/* Form Area */}
      <div className="p-4 sm:p-6">
        {activeTab === "BUY_FOR_ME" ? (
          <div>
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-[#1A1A24]/10">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-[#2323FF]">
                  Layanan Beli Bersih (Buy For Me)
                </p>
                <p className="text-xs text-[#1A1A24]/70">
                  Cukup tempel tautan Taobao / 1688 / Tmall. Tim gudang FLYPICK
                  di Shanghai yang akan membelikan dan menginspeksi barang Anda.
                </p>
              </div>
              <Badge variant="stamp">ZERO RMB ACC</Badge>
            </div>
            <BuyForMeForm />
          </div>
        ) : (
          <div>
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-[#1A1A24]/10">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-[#2323FF]">
                  Layanan Gudang &amp; Kargo (Self Checkout Forwarding)
                </p>
                <p className="text-xs text-[#1A1A24]/70">
                  Anda checkout sendiri menggunakan alamat Shanghai FLYPICK,
                  lalu daftarkan nomor resi kurir lokal di sini untuk
                  dikonsolidasi.
                </p>
              </div>
              <Badge variant="stamp">WAREHOUSE PASS</Badge>
            </div>
            <ForwardingForm />
          </div>
        )}
      </div>

      {/* Ticket Bottom Perforation & Barcode */}
      <div className="border-t-2 border-dashed border-[#1A1A24]/30 px-6 py-4 bg-[#FFF8E1] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] border border-[#1A1A24]" />
          <span className="font-mono text-[11px] text-[#1A1A24]/70">
            DOKUMEN MANIFEST KONSOLIDASI RESMI FLYPICK INDONESIA
          </span>
        </div>
        <Barcode value="FP-INTAKE-FORM-2026" height={26} />
      </div>
    </div>
  );
}
