import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge, Barcode, RubberStamp } from "@/components/atoms";

export function HeroFlightBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-[#FFF8E1] border-3 border-[#2323FF] shadow-[8px_8px_0px_0px_#1A1A24] p-6 sm:p-10 overflow-hidden">
        {/* Top Notch Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b-2 border-dashed border-[#1A1A24]/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00F0FF] border border-[#1A1A24]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]">
              BOARDING PASS FLIGHT NO. FP-2026-X
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <Badge variant="neon">SHANGHAI PVG</Badge>
            <span className="text-[#2323FF] font-black">➔➔➔</span>
            <Badge variant="electric">JAKARTA CGK</Badge>
          </div>
        </div>

        {/* Hero Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#1A1A24] text-white px-3 py-1 font-mono text-xs uppercase border border-[#00F0FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              CROSS-BORDER FREIGHT & JASTIP REVOLUTION
            </div>

            <h1 className="font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1A1A24] leading-none">
              Belanja Taobao & 1688{" "}
              <span className="text-[#2323FF]">Tanpa Rekening China</span>
            </h1>

            <p className="text-sm sm:text-base text-[#1A1A24]/80 max-w-2xl font-sans leading-relaxed">
              Punya barang impian di Taobao, Tmall, atau pabrik 1688? Cukup
              tempel link atau kirim ke alamat Gudang Shanghai kami. Kami yang
              urus pembayaran RMB, inspeksi fisik, dan pengiriman kargo resmi
              sampai depan pintu Anda.
            </p>

            {/* Guarantees Pill Badges */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <RubberStamp color="blue">100% BEBAS REDLINE</RubberStamp>
              <RubberStamp color="charcoal">PHOTO QC SHANGHAI</RubberStamp>
              <RubberStamp color="orange">AIR 7-10 HARI</RubberStamp>
            </div>
          </div>

          {/* Quick Luggage Tag Flight Card */}
          <div className="lg:col-span-4 bg-white border-2 border-[#1A1A24] shadow-[4px_4px_0px_0px_#2323FF] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A24]/10">
              <span className="font-mono text-[10px] uppercase font-bold text-[#1A1A24]/60">
                KURS LIVE KONSOLIDASI
              </span>
              <Badge variant="electric">AKTIF</Badge>
            </div>

            <div className="text-center py-2 bg-[#FFF8E1] border border-[#1A1A24]">
              <p className="font-mono text-2xl font-black text-[#2323FF]">
                1 CNY = Rp 2.250
              </p>
              <p className="font-mono text-[10px] text-[#1A1A24]/70 mt-0.5">
                Flat Transparan • Tanpa Biaya Tersembunyi
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#1A1A24]/80">
                <span>Gudang Asal:</span>
                <span className="font-bold">Shanghai Pudong (PVG)</span>
              </div>
              <div className="flex justify-between text-[#1A1A24]/80">
                <span>Hub Tujuan:</span>
                <span className="font-bold">Jakarta Cengkareng (CGK)</span>
              </div>
              <div className="flex justify-between text-[#1A1A24]/80">
                <span>Jadwal Cargo:</span>
                <span className="font-bold text-[#2323FF]">3x Seminggu</span>
              </div>
            </div>

            <Link
              href="/profile"
              className="block text-center bg-[#2323FF] text-white py-2 px-3 font-mono text-xs font-bold uppercase hover:bg-[#1a1aff] transition-colors border border-[#1A1A24]"
            >
              LIHAT ALAMAT GUDANG CHINA ➔
            </Link>
          </div>
        </div>

        {/* Cutout footer stamp */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-[#1A1A24]/30 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase">
            OFFICIAL TERMINAL SYSTEM CODE: FP-GATEWAY-2026-OK
          </span>
          <Barcode value="FLYPICK-CHINA-EXPRESS" height={22} />
        </div>
      </div>
    </section>
  );
}
