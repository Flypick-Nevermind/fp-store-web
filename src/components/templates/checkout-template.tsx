"use client";

import { AlertCircle, ArrowLeft, Lock, PlusCircle } from "lucide-react";
import Link from "next/link";
import { ResultBiayaCard } from "@/components/checkout/result-biaya-card";
import { ShippingTicketsSelector } from "@/components/checkout/shipping-tickets-selector";
import { EmptyState } from "@/components/molecules";
import { AddOnsStep, AddressStep, PaymentModal } from "@/components/organisms";
import { useCheckoutFlow } from "@/hooks/use-checkout-flow";

export function CheckoutTemplate() {
  const {
    items,
    totalItemCount,
    shippingMethod,
    setShippingMethod,
    addOns,
    subtotalIdr,
    serviceFeeIdr,
    photoQcFee,
    bubbleWrapFee,
    isHandcarry,
    handcarryShippingFee,
    cargoEstimatedStage2,
    grandTotalStage1,
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
  } = useCheckoutFlow();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={<AlertCircle className="w-12 h-12 text-[#1035D0]" />}
          title="Tidak Ada Link Produk untuk Di-Checkout"
          description="Keranjang Anda masih kosong. Silakan tempel link Taobao / 1688 di halaman depan terlebih dahulu."
          actionText="KEMBALI KE HALAMAN DEPAN"
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* ── Top Bar: Navigation & Tambah Link Lagi ───────────────── */}
      <div className="bg-white rounded-2xl border border-[#DCE4EC] p-4 sm:p-6 shadow-[0_12px_28px_-6px_rgba(16,53,208,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1 font-sans text-xs text-[#1035D0] hover:underline font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Keranjang
            </Link>
            <span className="text-[#94A3B8]">/</span>
            <span className="font-sans text-xs text-[#64748B]">
              Pemilihan Jasa Kirim &amp; Checkout
            </span>
          </div>

          <h1 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0F172A]">
            Checkout &amp; Pemilihan Jasa Pengiriman
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Pilih tiket penerbangan (Cargo vs Handcarry) dan konfirmasi alamat
            penerima.
          </p>
        </div>

        {/* Action: Tambah Link Lagi ke Depan + Security Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1035D0] border border-[#BFDBFE] text-xs font-bold transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#1035D0]" />
            <span>+ Tambah Link Lagi ke Depan</span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1 bg-[#0F172A] text-white px-3 py-2 rounded-xl text-xs font-mono font-bold">
            <Lock className="w-3 h-3 text-[#00F0FF]" />
            SSL 256-BIT
          </span>
        </div>
      </div>

      {/* ── Split Layout: Kiri (Jasa Kirim & Alamat) | Kanan (Result Biaya) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 2 Tiket Pengiriman + Alamat + Add-ons */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: 2 Tiket Pengiriman (Cargo vs Handcarry) */}
          <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-[0_12px_28px_-6px_rgba(16,53,208,0.08)] p-5 sm:p-6">
            <ShippingTicketsSelector
              selectedMethod={shippingMethod}
              onSelectMethod={setShippingMethod}
              totalItemCount={totalItemCount}
            />
          </div>

          {/* Card 2: Alamat Pengiriman ke Rumah */}
          <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-[0_12px_28px_-6px_rgba(16,53,208,0.08)] p-5 sm:p-6">
            <AddressStep onNext={() => {}} />
          </div>

          {/* Card 3: Layanan Proteksi Tambahan (Add-ons) */}
          <div className="bg-white rounded-2xl border border-[#DCE4EC] shadow-[0_12px_28px_-6px_rgba(16,53,208,0.08)] p-5 sm:p-6">
            <AddOnsStep />
          </div>
        </div>

        {/* Right Column: Result Biaya (Live Calculation) */}
        <div className="lg:col-span-5">
          <ResultBiayaCard
            items={items}
            totalItemCount={totalItemCount}
            shippingMethod={shippingMethod}
            subtotalIdr={subtotalIdr}
            serviceFeeIdr={serviceFeeIdr}
            photoQcFee={photoQcFee}
            bubbleWrapFee={bubbleWrapFee}
            isHandcarry={isHandcarry}
            handcarryShippingFee={handcarryShippingFee}
            cargoEstimatedStage2={cargoEstimatedStage2}
            grandTotalStage1={grandTotalStage1}
            hasPhotoQc={addOns.photoQc}
            hasBubbleWrap={addOns.extraBubbleWrap}
            onProceedPayment={openPaymentModal}
          />
        </div>
      </div>

      {/* ── Payment Menu Modal ────────────────────────────────────── */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        stage1TotalIdr={grandTotalStage1}
      />
    </div>
  );
}
