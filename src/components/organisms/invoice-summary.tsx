import { CreditCard, Receipt, Scale } from "lucide-react";
import { Badge, Barcode, Button } from "@/components/atoms";
import { formatIdr } from "@/lib/utils";
import type { CartItem } from "@/types";

interface InvoiceSummaryProps {
  items: CartItem[];
  subtotalIdr: number;
  serviceFeeIdr: number;
  photoQcFee: number;
  bubbleWrapFee: number;
  grandTotalStage1: number;
  estimatedStage2: number;
  hasPhotoQc: boolean;
  hasBubbleWrap: boolean;
  shippingMethod: string;
  onProceedPayment: () => void;
}

export function InvoiceSummary({
  items,
  subtotalIdr,
  serviceFeeIdr,
  photoQcFee,
  bubbleWrapFee,
  grandTotalStage1,
  estimatedStage2,
  hasPhotoQc,
  hasBubbleWrap,
  shippingMethod,
  onProceedPayment,
}: InvoiceSummaryProps) {
  return (
    <div className="bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] overflow-hidden">
      {/* Header */}
      <div className="bg-[#2323FF] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#1A1A24]">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            INVOICE TAHAP 1: TALANGAN &amp; LAYANAN
          </h3>
        </div>
        <Badge variant="yellow">OFFICIAL INVOICE</Badge>
      </div>

      <div className="p-5 space-y-5">
        {/* Items Breakdown list */}
        <div className="space-y-2 text-xs font-mono">
          <span className="text-[#1A1A24]/60 uppercase block text-[10px]">
            Daftar Barang ({items.length} Paket):
          </span>
          {items.map((it) => (
            <div
              key={it.id}
              className="flex justify-between items-baseline py-1 border-b border-[#1A1A24]/10"
            >
              <span className="truncate max-w-[220px]">
                {it.serviceType === "BUY_FOR_ME"
                  ? it.productName
                  : it.description}
                <span className="text-[10px] text-[#1A1A24]/60 ml-1">
                  x{it.quantity}
                </span>
              </span>
              <span className="font-bold shrink-0">
                {it.serviceType === "BUY_FOR_ME"
                  ? formatIdr(it.priceIdr * it.quantity)
                  : "Forwarding (Rp 0)"}
              </span>
            </div>
          ))}
        </div>

        {/* Cost Calculation */}
        <div className="space-y-2 text-xs font-mono pt-2">
          <div className="flex justify-between text-[#1A1A24]/80">
            <span>Subtotal Talangan Produk:</span>
            <span className="font-bold text-[#1A1A24]">
              {formatIdr(subtotalIdr)}
            </span>
          </div>

          <div className="flex justify-between text-[#1A1A24]/80">
            <span>Biaya Handling Konsolidasi Shanghai:</span>
            <span className="font-bold text-[#1A1A24]">
              {formatIdr(serviceFeeIdr)}
            </span>
          </div>

          {hasPhotoQc && (
            <div className="flex justify-between text-[#2323FF]">
              <span>+ Photo QC Inspeksi:</span>
              <span className="font-bold">{formatIdr(photoQcFee)}</span>
            </div>
          )}

          {hasBubbleWrap && (
            <div className="flex justify-between text-[#2323FF]">
              <span>+ Ekstra Bubble Wrap 3 Lapis:</span>
              <span className="font-bold">{formatIdr(bubbleWrapFee)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-3 border-t-2 border-dashed border-[#1A1A24]/30 flex items-baseline justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#1A1A24] uppercase block">
                TOTAL DIBAYAR SEKARANG:
              </span>
              <span className="text-[10px] font-sans text-[#1A1A24]/60">
                (Invoice Tahap 1)
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-2xl font-black text-[#2323FF]">
                {formatIdr(grandTotalStage1)}
              </span>
            </div>
          </div>
        </div>

        {/* Explicit Disclaimer for International Freight Balance */}
        <div className="p-3.5 bg-[#FFF8E1] border-2 border-[#1A1A24] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[#1A1A24]">
            <span className="font-black uppercase flex items-center gap-1.5 text-[#2323FF]">
              <Scale className="w-4 h-4" />
              ESTIMASI ONGKIR TAHAP 2:
            </span>
            <span className="font-black text-[#2323FF]">
              ± {formatIdr(estimatedStage2)}
            </span>
          </div>
          <div className="text-[11px] font-sans text-[#1A1A24]/85 bg-white p-2.5 border border-[#1A1A24]/30 space-y-1">
            <p className="font-bold font-mono text-[10px] uppercase text-[#FF5E1E]">
              ⚠️ DISCLAIMER TAGIHAN INTERNASIONAL (TAHAP 2):
            </p>
            <p className="leading-snug">
              Pembayaran sekarang (Tahap 1) mencakup talangan barang merchant
              dan handling warehouse.
            </p>
            <p className="leading-snug font-bold">
              Sisa ongkos kirim kargo internasional (
              {shippingMethod === "AIR_EXPRESS"
                ? "Air Express Rp 165rb/kg"
                : "Sea Cargo Rp 45rb/kg"}
              ) akan ditagihkan setelah seluruh barang tiba, di-QC, dan
              ditimbang akurat di Shanghai.
            </p>
          </div>
        </div>

        {/* Main Pay Trigger Button */}
        <Button
          type="button"
          variant="neon"
          size="lg"
          onClick={onProceedPayment}
          className="w-full flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5 text-[#00F0FF]" />
          <span>LANJUT KE PEMBAYARAN TAHAP 1</span>
        </Button>

        <div className="pt-2 flex justify-center">
          <Barcode value="FP-STAGE-1-PAYMENT" height={22} />
        </div>
      </div>
    </div>
  );
}
