"use client";

import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms";
import { EmptyState } from "@/components/molecules";
import {
  AddOnsStep,
  AddressStep,
  FreightStep,
  InvoiceSummary,
  PaymentModal,
} from "@/components/organisms";
import { useCheckoutFlow } from "@/hooks/use-checkout-flow";

export function CheckoutTemplate() {
  const {
    items,
    shippingMethod,
    addOns,
    subtotalIdr,
    serviceFeeIdr,
    photoQcFee,
    bubbleWrapFee,
    grandTotalStage1,
    estimatedStage2,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
  } = useCheckoutFlow();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-[#2323FF]" />}
          title="Tidak Ada Item untuk Di-Checkout"
          description="Keranjang Anda kosong. Silakan tambahkan barang di Intake Hub terlebih dahulu."
          actionText="KEMBALI KE INTAKE HUB"
          actionHref="/"
        />
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
            PENGATURAN PENGIRIMAN &amp; INVOICE TAHAP 1
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
          <AddressStep onNext={() => {}} />
          <div className="border-t-2 border-dashed border-[#1A1A24]/20" />
          <FreightStep />
          <div className="border-t-2 border-dashed border-[#1A1A24]/20" />
          <AddOnsStep />
        </div>

        {/* Right Sidebar: Step 4 Payment Summary showing Stage 1 invoice */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <InvoiceSummary
            items={items}
            subtotalIdr={subtotalIdr}
            serviceFeeIdr={serviceFeeIdr}
            photoQcFee={photoQcFee}
            bubbleWrapFee={bubbleWrapFee}
            grandTotalStage1={grandTotalStage1}
            estimatedStage2={estimatedStage2}
            hasPhotoQc={addOns.photoQc}
            hasBubbleWrap={addOns.extraBubbleWrap}
            shippingMethod={shippingMethod}
            onProceedPayment={openPaymentModal}
          />
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        stage1TotalIdr={grandTotalStage1}
      />
    </div>
  );
}
