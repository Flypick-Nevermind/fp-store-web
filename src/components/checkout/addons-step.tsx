import { CheckSquare, ShieldCheck, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BRANDING } from "@/config/branding";
import { formatIdr } from "@/lib/utils";
import { useCheckoutStore } from "@/store/use-checkout-store";

export function AddOnsStep() {
  const addOns = useCheckoutStore((s) => s.addOns);
  const setAddOns = useCheckoutStore((s) => s.setAddOns);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-[#1A1A24]/10">
        <ShieldCheck className="w-5 h-5 text-[#2323FF]" />
        <div>
          <h3 className="font-mono text-sm font-bold uppercase text-[#1A1A24]">
            Langkah 3: Layanan Tambahan Gudang Shanghai (Add-ons)
          </h3>
          <p className="text-xs text-[#1A1A24]/70">
            Perlindungan maksimal sebelum paket terbang ke Indonesia.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Addon 1: Photo QC */}
        <button
          type="button"
          onClick={() => setAddOns({ photoQc: !addOns.photoQc })}
          className={`w-full text-left p-3.5 border-2 transition-all cursor-pointer flex items-center justify-between ${
            addOns.photoQc
              ? "bg-[#FFF8E1] border-[#2323FF] shadow-[2px_2px_0px_0px_#2323FF]"
              : "bg-white border-[#1A1A24]/30 hover:border-[#1A1A24]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {addOns.photoQc ? (
                <CheckSquare className="w-5 h-5 text-[#2323FF]" />
              ) : (
                <Square className="w-5 h-5 text-[#1A1A24]/40" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs font-bold uppercase text-[#1A1A24]">
                  PHOTO QC & INSPEKSI FISIK GUDANG SHANGHAI
                </p>
                <Badge variant="electric">DIREKOMENDASIKAN</Badge>
              </div>
              <p className="text-xs text-[#1A1A24]/75 mt-0.5 font-sans">
                Tim gudang membuka paket luar, memeriksa kecocokan warna &
                ukuran, dan mengunggah foto laporan unboxing sebelum paket
                diterbangkan.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#2323FF] shrink-0 pl-3">
            {formatIdr(BRANDING.serviceFees.photoQcIdr)}
          </span>
        </button>

        {/* Addon 2: Extra Bubble Wrap */}
        <button
          type="button"
          onClick={() =>
            setAddOns({ extraBubbleWrap: !addOns.extraBubbleWrap })
          }
          className={`w-full text-left p-3.5 border-2 transition-all cursor-pointer flex items-center justify-between ${
            addOns.extraBubbleWrap
              ? "bg-[#FFF8E1] border-[#2323FF] shadow-[2px_2px_0px_0px_#2323FF]"
              : "bg-white border-[#1A1A24]/30 hover:border-[#1A1A24]"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {addOns.extraBubbleWrap ? (
                <CheckSquare className="w-5 h-5 text-[#2323FF]" />
              ) : (
                <Square className="w-5 h-5 text-[#1A1A24]/40" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs font-bold uppercase text-[#1A1A24]">
                  EKSTRA BUBBLE WRAP 3 LAPIS & LAKBAN KUNING
                </p>
              </div>
              <p className="text-xs text-[#1A1A24]/75 mt-0.5 font-sans">
                Pelapisan tebal ekstra untuk barang rentan benturan, kotak
                sepatu, barang pecah belah, atau kosmetik.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#2323FF] shrink-0 pl-3">
            {formatIdr(BRANDING.serviceFees.extraBubbleWrapIdr)}
          </span>
        </button>
      </div>
    </div>
  );
}
