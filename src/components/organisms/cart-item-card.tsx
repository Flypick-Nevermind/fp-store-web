"use client";

import { ExternalLink, Package, Trash2, Truck } from "lucide-react";
import { QtyControl } from "@/components/molecules";
import { useCartActions } from "@/hooks/use-cart-actions";
import { formatCny, formatIdr } from "@/lib/utils";
import type { BuyForMeItem, CartItem, ForwardingItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeItem, updateQty } = useCartActions();

  const isBuyForMe = item.serviceType === "BUY_FOR_ME";
  const bfmItem = isBuyForMe ? (item as BuyForMeItem) : null;
  const fwdItem = !isBuyForMe ? (item as ForwardingItem) : null;

  // Detect platform name
  let platformLabel = "Taobao";
  let platformBg = "bg-[#FF5000]";
  const lowerUrl = (bfmItem?.sourceUrl || "").toLowerCase();
  if (lowerUrl.includes("pinduoduo") || lowerUrl.includes("yangkeduo")) {
    platformLabel = "Pinduoduo";
    platformBg = "bg-[#E02E24]";
  } else if (lowerUrl.includes("alibaba")) {
    platformLabel = "Alibaba";
    platformBg = "bg-[#FF6A00]";
  } else if (lowerUrl.includes("1688")) {
    platformLabel = "1688";
    platformBg = "bg-[#FF7300]";
  }

  return (
    <div className="relative bg-white rounded-2xl border border-[#DCE4EC] shadow-[0_12px_28px_-6px_rgba(16,53,208,0.08)] flex flex-col md:flex-row overflow-hidden transition-all hover:border-[#1035D0]/30">
      {/* ── Main Body (Flight Details) ───────────────────────────── */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
        {/* Product Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shrink-0 overflow-hidden flex items-center justify-center">
          {isBuyForMe && bfmItem?.imageUrl ? (
            <img
              src={bfmItem.imageUrl}
              alt={bfmItem.productName}
              className="w-full h-full object-cover"
            />
          ) : isBuyForMe ? (
            <Package className="w-8 h-8 text-[#1035D0]" />
          ) : (
            <Truck className="w-8 h-8 text-[#FF5000]" />
          )}

          {/* Platform Badge on Image */}
          <span
            className={`absolute top-1 left-1 ${platformBg} text-white font-sans text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-tight`}
          >
            {platformLabel}
          </span>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[11px] font-bold text-[#1035D0] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
              1 Link = 1 Varian
            </span>

            <span className="font-mono text-[10px] text-[#94A3B8]">
              Ref: {item.id}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-sm sm:text-base text-[#0F172A] leading-snug">
            {isBuyForMe ? bfmItem?.productName : fwdItem?.description}
          </h3>

          {/* Variant attributes & source link */}
          {isBuyForMe && bfmItem && (
            <div className="space-y-1.5 text-xs font-sans">
              {(bfmItem.selectedVariant?.color ||
                bfmItem.selectedVariant?.size) && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#475569]">
                  <span className="bg-[#F1F5F9] px-2.5 py-0.5 rounded-md font-semibold">
                    Varian: {bfmItem.selectedVariant.color || "-"}{" "}
                    {bfmItem.selectedVariant.size
                      ? `(${bfmItem.selectedVariant.size})`
                      : ""}
                  </span>
                </div>
              )}

              {bfmItem.sourceUrl && (
                <a
                  href={bfmItem.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-[#1035D0] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate max-w-[280px]">
                    {bfmItem.sourceUrl}
                  </span>
                </a>
              )}

              {bfmItem.notes && (
                <div className="p-2 bg-[#FFF8E1] rounded-lg border border-amber-200 text-[11px] text-[#854D0E] font-medium leading-relaxed">
                  {bfmItem.notes}
                </div>
              )}
            </div>
          )}

          {/* Quantity Stepper & Remove per link */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Qty:</span>
              <QtyControl
                quantity={item.quantity}
                onIncrease={() => updateQty(item.id, item.quantity + 1)}
                onDecrease={() => updateQty(item.id, item.quantity - 1)}
              />
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 hover:underline cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Perforated Divider ────────────────────────────────────── */}
      <div className="relative hidden md:flex items-center justify-center w-px border-r border-dashed border-[#CBD5E1] my-3">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#CBD5E1]" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#CBD5E1]" />
      </div>

      {/* ── Boarding Pass Stub: Pricing Breakdown ─────────────────── */}
      <div className="w-full md:w-56 p-4 sm:p-5 bg-[#F8FAFC] flex flex-col justify-between shrink-0 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] uppercase">
            <span>INVOICE PRODUK</span>
            <span>SHANGHAI</span>
          </div>

          {isBuyForMe && bfmItem ? (
            <div className="space-y-1 font-sans">
              <div className="flex items-baseline justify-between font-mono text-xs">
                <span className="text-[#64748B]">Harga CNY:</span>
                <span className="font-bold">{formatCny(bfmItem.priceCny)}</span>
              </div>
              <div className="flex items-baseline justify-between font-mono text-[10px]">
                <span className="text-[#94A3B8]">Kurs:</span>
                <span className="text-[#64748B]">
                  Rp {bfmItem.exchangeRate.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="pt-1.5 border-t border-[#E2E8F0] flex items-baseline justify-between">
                <span className="text-xs font-bold text-[#0F172A]">Total:</span>
                <span className="font-mono text-base font-black text-[#1035D0]">
                  {formatIdr(bfmItem.priceIdr * item.quantity)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="inline-block bg-[#00F0FF]/20 text-[#1035D0] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                FORWARDING
              </span>
              <p className="text-[11px] text-[#64748B]">
                Handling: Rp 10.000 / resi
              </p>
            </div>
          )}
        </div>

        {/* Stub Barcode */}
        <div className="pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-[2px] h-4.5 opacity-60">
            <span className="w-1 h-full bg-[#0F172A]" />
            <span className="w-0.5 h-full bg-[#0F172A]" />
            <span className="w-1.5 h-full bg-[#0F172A]" />
            <span className="w-0.5 h-full bg-[#0F172A]" />
            <span className="w-1 h-full bg-[#0F172A]" />
            <span className="w-2 h-full bg-[#0F172A]" />
            <span className="w-0.5 h-full bg-[#0F172A]" />
            <span className="w-1.5 h-full bg-[#0F172A]" />
          </div>
          <p className="text-[9px] font-mono text-center text-[#94A3B8] mt-1 uppercase tracking-widest">
            *PVG-LINK-VARIANT*
          </p>
        </div>
      </div>
    </div>
  );
}
