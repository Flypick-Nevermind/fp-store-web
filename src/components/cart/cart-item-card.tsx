"use client";

import {
  ExternalLink,
  Minus,
  Package,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { formatCny, formatIdr } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import type { BuyForMeItem, CartItem, ForwardingItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  const isBuyForMe = item.serviceType === "BUY_FOR_ME";
  const bfmItem = isBuyForMe ? (item as BuyForMeItem) : null;
  const fwdItem = !isBuyForMe ? (item as ForwardingItem) : null;

  return (
    <div className="relative bg-white border-2 border-[#1A1A24] shadow-[4px_4px_0px_0px_#2323FF] flex flex-col md:flex-row overflow-hidden transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
      {/* Service Stripe Badge on extreme left */}
      <div
        className={`w-full md:w-2 ${
          isBuyForMe ? "bg-[#2323FF]" : "bg-[#FF5E1E]"
        }`}
      />

      {/* Main Body (Flight Details) */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
        {/* Product Image / Icon */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#FFF8E1] border-2 border-[#1A1A24] shrink-0 overflow-hidden flex items-center justify-center">
          {isBuyForMe && bfmItem?.imageUrl ? (
            <img
              src={bfmItem.imageUrl}
              alt={bfmItem.productName}
              className="w-full h-full object-cover"
            />
          ) : isBuyForMe ? (
            <Package className="w-8 h-8 text-[#2323FF]" />
          ) : (
            <Truck className="w-8 h-8 text-[#FF5E1E]" />
          )}
          {/* Small service tag */}
          <span className="absolute bottom-0 inset-x-0 bg-[#1A1A24] text-white font-mono text-[8px] text-center py-0.5 uppercase tracking-tighter">
            {isBuyForMe ? "TAOBAO/1688" : "RESI CHINA"}
          </span>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isBuyForMe ? (
              <Badge variant="neon">[TITIP DIBELIIN]</Badge>
            ) : (
              <Badge variant="orange">[TITIP KIRIM / SELF CHECKOUT]</Badge>
            )}

            <span className="font-mono text-[10px] text-[#1A1A24]/60">
              ID: {item.id}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-[#1A1A24] leading-snug">
            {isBuyForMe ? bfmItem?.productName : fwdItem?.description}
          </h3>

          {/* Specific attributes */}
          {isBuyForMe && bfmItem && (
            <div className="space-y-1 text-xs">
              {(bfmItem.selectedVariant?.color ||
                bfmItem.selectedVariant?.size) && (
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#1A1A24]/80">
                  <span className="bg-[#FFF8E1] px-2 py-0.5 border border-[#1A1A24]/30">
                    Varian: {bfmItem.selectedVariant.color || "-"} /{" "}
                    {bfmItem.selectedVariant.size || "-"}
                  </span>
                </div>
              )}
              {bfmItem.sourceUrl && (
                <a
                  href={bfmItem.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-[#2323FF] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Buka Tautan Sumber Merchant
                </a>
              )}
              {bfmItem.notes && (
                <p className="text-[11px] text-[#1A1A24]/70 italic bg-[#FFF8E1] p-1.5 border-l-2 border-[#2323FF]">
                  &quot;{bfmItem.notes}&quot;
                </p>
              )}
            </div>
          )}

          {!isBuyForMe && fwdItem && (
            <div className="space-y-1 text-xs">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="bg-[#FFF8E1] px-2 py-0.5 border border-[#1A1A24] font-bold text-[#1A1A24]">
                  NO RESI: {fwdItem.chinaTrackingNumber}
                </span>
                <span className="bg-white px-2 py-0.5 border border-[#1A1A24]/30 text-[#1A1A24]/70">
                  Kategori: {fwdItem.itemCategory}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#1A1A24]/60">
                Nilai Deklarasi Asuransi: {formatIdr(fwdItem.declaredValueIdr)}
              </p>
            </div>
          )}

          {/* Quantity Controls & Delete */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border-2 border-[#1A1A24] bg-white">
              <button
                type="button"
                onClick={() => updateQty(item.id, item.quantity - 1)}
                className="p-1.5 hover:bg-[#FFF8E1] text-[#1A1A24] transition-colors"
                aria-label="Kurangi kuantitas"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-xs px-3 min-w-[28px] text-center">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="p-1.5 hover:bg-[#FFF8E1] text-[#1A1A24] transition-colors"
                aria-label="Tambah kuantitas"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="font-mono text-xs text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Tiket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Perforated Divider with Cutout Notches */}
      <div className="relative hidden md:flex items-center justify-center w-px border-r-2 border-dashed border-[#1A1A24]/30 my-2">
        {/* Top Notch Cutout */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#1A1A24]" />
        {/* Bottom Notch Cutout */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#1A1A24]" />
      </div>

      {/* Mobile Horizontal Divider */}
      <div className="relative md:hidden border-b-2 border-dashed border-[#1A1A24]/30 my-1">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#1A1A24]" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#1A1A24]" />
      </div>

      {/* Boarding Pass Stub: Pricing Breakdown */}
      <div className="w-full md:w-56 p-4 sm:p-5 bg-[#FFF8E1] flex flex-col justify-between shrink-0 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#1A1A24]/60 uppercase">
            <span>INVOICE TAHAP 1</span>
            <span>SHANGHAI HUB</span>
          </div>

          {isBuyForMe && bfmItem ? (
            <div className="space-y-1">
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xs text-[#1A1A24]/70">Harga CNY:</span>
                <span className="text-xs font-bold">
                  {formatCny(bfmItem.priceCny)}
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-[10px] text-[#1A1A24]/60">
                  Kurs CNY➔IDR:
                </span>
                <span className="text-[10px]">
                  Rp {bfmItem.exchangeRate.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="pt-1 border-t border-[#1A1A24]/20 flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold text-[#1A1A24]">
                  Total IDR:
                </span>
                <span className="font-mono text-sm font-black text-[#2323FF]">
                  {formatIdr(bfmItem.priceIdr * item.quantity)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="inline-block bg-[#00F0FF] text-[#1A1A24] font-mono text-[10px] font-bold px-1.5 py-0.5 border border-[#1A1A24]">
                BEBAS TALANGAN PRODUK
              </span>
              <p className="text-[11px] font-mono text-[#1A1A24]/70">
                Handling Shanghai: Rp 10.000 / resi
              </p>
              <div className="pt-1 border-t border-[#1A1A24]/20 flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold text-[#1A1A24]">
                  Tahap 1:
                </span>
                <span className="font-mono text-sm font-black text-[#FF5E1E]">
                  Rp 10.000
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stub Barcode */}
        <div className="pt-2 border-t border-[#1A1A24]/20">
          <Barcode
            value={`FP-${item.id.replace("FP-", "")}`}
            height={22}
            showText={false}
          />
          <p className="text-[9px] font-mono text-center text-[#1A1A24]/60 mt-1 uppercase tracking-widest">
            *PVG-BOARDING-TICKET*
          </p>
        </div>
      </div>
    </div>
  );
}
