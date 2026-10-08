"use client";

import { CheckCircle, Clock, Plane, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Barcode } from "@/components/ui/barcode";
import { BRANDING } from "@/config/branding";

export function Footer() {
  const pathname = usePathname();

  // On the home landing page, suppress the large footer to match the clean single-screen screenshot aesthetic
  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="mt-20 bg-[#1A1A24] text-white border-t-4 border-[#1035D0]">
      {/* Top Banner Guarantees */}
      <div className="border-b border-white/10 bg-[#14141d] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase">
                100% Bebas Redline
              </p>
              <p className="text-white/60 text-[11px]">
                Jalur resmi kargo udara & laut bergaransi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#FFDE00] flex items-center justify-center text-[#FFDE00] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase">
                Air Express 7-10 Hari
              </p>
              <p className="text-white/60 text-[11px]">
                Jadwal penerbangan rutin tiap minggu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase">Photo QC Gratis</p>
              <p className="text-white/60 text-[11px]">
                Foto bukti barang saat tiba di Shanghai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-[#FF5E1E] flex items-center justify-center text-[#FF5E1E] shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white uppercase">
                Konsolidasi Bebas Repot
              </p>
              <p className="text-white/60 text-[11px]">
                Gabung paket banyak toko jadi 1 resi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-xs text-white/70 max-w-md font-sans leading-relaxed">
              Platform layanan jasa titip (Jastip) dan freight forwarding
              terpercaya dari Taobao, Tmall, dan 1688 Tiongkok langsung ke depan
              pintu rumah Anda di seluruh Indonesia.
            </p>
            <div className="pt-2">
              <Barcode value="FP-SYSTEM-STAMP-2026" height={28} />
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold text-[#00F0FF] uppercase tracking-wider">
              TERMINAL GUDANG
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>Shanghai Pudong Free Trade Zone (PVG-01)</li>
              <li>Guangzhou Baiyun Consolidation Hub (CAN-02)</li>
              <li>Yiwu Small Commodity Port (YIW-03)</li>
              <li>Jakarta Cengkareng Gateway Hub (CGK-01)</li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold text-[#00F0FF] uppercase tracking-wider">
              BANTUAN & CS
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>WhatsApp CS: {BRANDING.contacts.whatsapp}</li>
              <li>Instagram: {BRANDING.contacts.instagram}</li>
              <li>Email: {BRANDING.contacts.email}</li>
              <li>Jam Operasional: 09:00 - 22:00 WIB</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/50 gap-4">
          <p>© 2026 FLYPICK CROSS-BORDER LOGISTICS. ALL RIGHTS RESERVED.</p>
          <p className="text-[#00F0FF]">
            TRAVEL PAPER SPEC 1.0 &bull; SHANGHAI - JAKARTA EXPRESS
          </p>
        </div>
      </div>
    </footer>
  );
}
