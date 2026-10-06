import { Plane, Ship } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BRANDING } from "@/config/branding";
import { formatIdr } from "@/lib/utils";
import { useCheckoutStore } from "@/store/use-checkout-store";

export function FreightStep() {
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);

  const air = BRANDING.shippingRates.airExpress;
  const sea = BRANDING.shippingRates.seaEconomy;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-[#1A1A24]/10">
        <Plane className="w-5 h-5 text-[#2323FF]" />
        <div>
          <h3 className="font-mono text-sm font-bold uppercase text-[#1A1A24]">
            Langkah 2: Pilih Metode Pengiriman Internasional (Shanghai ➔
            Jakarta)
          </h3>
          <p className="text-xs text-[#1A1A24]/70">
            Jalur resmi freight forwarder tanpa biaya siluman & bebas redline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Air Express Card */}
        <button
          type="button"
          onClick={() => setShippingMethod("AIR_EXPRESS")}
          className={`w-full text-left p-4 border-2 transition-all cursor-pointer relative ${
            shippingMethod === "AIR_EXPRESS"
              ? "bg-[#FFF8E1] border-[#2323FF] shadow-[4px_4px_0px_0px_#2323FF]"
              : "bg-white border-[#1A1A24]/30 hover:border-[#1A1A24]"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#2323FF] text-[#00F0FF] flex items-center justify-center border border-[#1A1A24]">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-xs font-black uppercase text-[#1A1A24]">
                  AIR EXPRESS CARGO
                </p>
                <p className="text-[11px] font-mono text-[#2323FF] font-bold">
                  {air.eta}
                </p>
              </div>
            </div>
            {shippingMethod === "AIR_EXPRESS" ? (
              <Badge variant="neon">TERPILIH</Badge>
            ) : (
              <Badge variant="paper">PILIH</Badge>
            )}
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#1A1A24]/70">Tarif Kargo:</span>
              <span className="font-bold text-[#1A1A24]">
                {formatIdr(air.ratePerKg)} / kg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1A1A24]/70">Min. Berat:</span>
              <span>{air.minWeightKg} kg (Cocok eceran & fashion)</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#2323FF]">
              <span>Frekuensi Terbang:</span>
              <span>3x Seminggu</span>
            </div>
          </div>
        </button>

        {/* Sea Economy Card */}
        <button
          type="button"
          onClick={() => setShippingMethod("SEA_ECONOMY")}
          className={`w-full text-left p-4 border-2 transition-all cursor-pointer relative ${
            shippingMethod === "SEA_ECONOMY"
              ? "bg-[#FFF8E1] border-[#2323FF] shadow-[4px_4px_0px_0px_#2323FF]"
              : "bg-white border-[#1A1A24]/30 hover:border-[#1A1A24]"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#1A1A24] text-[#FFDE00] flex items-center justify-center border border-[#1A1A24]">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <p className="font-mono text-xs font-black uppercase text-[#1A1A24]">
                  SEA ECONOMY FREIGHT
                </p>
                <p className="text-[11px] font-mono text-[#FF5E1E] font-bold">
                  {sea.eta}
                </p>
              </div>
            </div>
            {shippingMethod === "SEA_ECONOMY" ? (
              <Badge variant="neon">TERPILIH</Badge>
            ) : (
              <Badge variant="paper">PILIH</Badge>
            )}
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#1A1A24]/70">Tarif Kargo:</span>
              <span className="font-bold text-[#1A1A24]">
                {formatIdr(sea.ratePerKg)} / kg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1A1A24]/70">Min. Berat:</span>
              <span>{sea.minWeightKg} kg (Hemat barang berat)</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#1A1A24]/70">
              <span>Keberangkatan Kapal:</span>
              <span>Tiap Hari Rabu</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
