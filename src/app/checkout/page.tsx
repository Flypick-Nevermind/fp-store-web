"use client";

import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Lock,
  Receipt,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AddOnsStep } from "@/components/checkout/addons-step";
import { AddressStep } from "@/components/checkout/address-step";
import { FreightStep } from "@/components/checkout/freight-step";
import { PaymentModal } from "@/components/checkout/payment-modal";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";
import { formatIdr } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { useCheckoutStore } from "@/store/use-checkout-store";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getSubtotalIdr = useCartStore((s) => s.getSubtotalIdr);
  const getServiceFeeIdr = useCartStore((s) => s.getServiceFeeIdr);
  const addOns = useCheckoutStore((s) => s.addOns);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Invoice calculations
  const subtotalIdr = getSubtotalIdr();
  const serviceFeeIdr = getServiceFeeIdr();
  const photoQcFee = addOns.photoQc ? BRANDING.serviceFees.photoQcIdr : 0;
  const bubbleWrapFee = addOns.extraBubbleWrap
    ? BRANDING.serviceFees.extraBubbleWrapIdr
    : 0;
  const addOnsTotal = photoQcFee + bubbleWrapFee;
  const grandTotalStage1 = subtotalIdr + serviceFeeIdr + addOnsTotal;

  // Estimated Stage 2 freight
  const freightRate =
    shippingMethod === "AIR_EXPRESS"
      ? BRANDING.shippingRates.airExpress.ratePerKg
      : BRANDING.shippingRates.seaEconomy.ratePerKg;
  const estimatedWeight = 1.5; // Est. 1.5kg
  const estimatedStage2 = Math.round(freightRate * estimatedWeight);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] p-10 space-y-4">
          <AlertCircle className="w-12 h-12 text-[#2323FF] mx-auto" />
          <h2 className="font-mono text-xl font-bold uppercase text-[#1A1A24]">
            Tidak Ada Item untuk Di-Checkout
          </h2>
          <p className="text-xs text-[#1A1A24]/70">
            Keranjang Anda kosong. Silakan tambahkan barang di Intake Hub
            terlebih dahulu.
          </p>
          <Link href="/">
            <Button variant="neon" size="md">
              KEMBALI KE INTAKE HUB
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Top Boarding Bar */}
      <div className="bg-[#FFF8E1] border-2 border-[#1A1A24] p-4 sm:p-6 shadow-[4px_4px_0px_0px_#2323FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1 font-mono text-xs text-[#2323FF] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Keranjang
            </Link>
            <span className="text-[#1A1A24]/40">/</span>
            <span className="font-mono text-xs text-[#1A1A24]/70">
              Proses Tiket Pesanan
            </span>
          </div>
          <h1 className="font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1A24]">
            PENGATURAN PENGIRIMAN & INVOICE TAHAP 1
          </h1>
          <p className="text-xs text-[#1A1A24]/75 mt-1 font-sans">
            Lengkapi data alamat penerima di Indonesia dan opsi rute cargo
            penerbangan.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="electric">CHECKOUT SECURE</Badge>
          <span className="inline-flex items-center gap-1 bg-[#1A1A24] text-white px-2 py-1 border border-[#00F0FF]">
            <Lock className="w-3 h-3 text-[#00F0FF]" />
            SSL 256-BIT
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Step 1, Step 2, Step 3 */}
        <div className="lg:col-span-7 space-y-8 bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] p-6 sm:p-8">
          {/* Step 1: Address */}
          <AddressStep onNext={() => {}} />

          {/* Divider */}
          <div className="border-t-2 border-dashed border-[#1A1A24]/20" />

          {/* Step 2: Freight */}
          <FreightStep />

          {/* Divider */}
          <div className="border-t-2 border-dashed border-[#1A1A24]/20" />

          {/* Step 3: Addons */}
          <AddOnsStep />
        </div>

        {/* Right Sidebar: Step 4 Payment Summary showing Stage 1 invoice */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] overflow-hidden">
            {/* Header */}
            <div className="bg-[#2323FF] text-[#FFF8E1] p-4 flex items-center justify-between border-b-2 border-[#1A1A24]">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  INVOICE TAHAP 1: TALANGAN & LAYANAN
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

                {addOns.photoQc && (
                  <div className="flex justify-between text-[#2323FF]">
                    <span>+ Photo QC Inspeksi:</span>
                    <span className="font-bold">{formatIdr(photoQcFee)}</span>
                  </div>
                )}

                {addOns.extraBubbleWrap && (
                  <div className="flex justify-between text-[#2323FF]">
                    <span>+ Ekstra Bubble Wrap 3 Lapis:</span>
                    <span className="font-bold">
                      {formatIdr(bubbleWrapFee)}
                    </span>
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
                    Pembayaran sekarang (Tahap 1) mencakup talangan barang
                    merchant dan handling warehouse.
                  </p>
                  <p className="leading-snug font-bold">
                    Sisa ongkos kirim kargo internasional (Air Express Rp
                    165rb/kg atau Sea Cargo Rp 45rb/kg) akan ditagihkan setelah
                    seluruh barang tiba, di-QC, dan ditimbang akurat di
                    Shanghai.
                  </p>
                </div>
              </div>

              {/* Main Pay Trigger Button */}
              <Button
                type="button"
                variant="neon"
                size="lg"
                onClick={() => setIsPaymentModalOpen(true)}
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
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        stage1TotalIdr={grandTotalStage1}
      />
    </div>
  );
}
