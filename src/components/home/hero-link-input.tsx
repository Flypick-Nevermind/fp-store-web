"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useSubmissionStore } from "@/store/use-submission-store";
import { SubmissionConfirmationModal } from "@/components/intake/submission-confirmation-modal";
import type { SubmissionRecord } from "@/types/submission";

export interface PlatformConfig {
  id: string;
  name: string;
  placeholder: string;
  badgeBg: string;
  symbol: string;
  sampleUrl: string;
  sampleProduct: {
    name: string;
    cny: number;
    color: string;
    size: string;
    imageUrl: string;
  };
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "taobao",
    name: "Taobao",
    placeholder: "Tempel link produk Taobao di sini...",
    badgeBg: "bg-[#FF5000]",
    symbol: "淘",
    sampleUrl: "https://item.taobao.com/item.htm?id=726194812301",
    sampleProduct: {
      name: "Retro Vintage Cargo Jacket Unisex Washed Canvas",
      cny: 189.0,
      color: "Olive Green",
      size: "XL Loose Fit",
      imageUrl:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "pinduoduo",
    name: "Pinduoduo",
    placeholder: "Tempel link produk Pinduoduo di sini...",
    badgeBg: "bg-[#E02E24]",
    symbol: "拼",
    sampleUrl: "https://mobile.yangkeduo.com/goods.html?goods_id=89127819",
    sampleProduct: {
      name: "Minimalist Japanese Canvas Tote Bag with Inner Pocket",
      cny: 68.0,
      color: "Cream Off-White",
      size: "Large (38x32 cm)",
      imageUrl:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "alibaba",
    name: "Alibaba",
    placeholder: "Tempel link produk Alibaba di sini...",
    badgeBg: "bg-[#FF6A00]",
    symbol: "a",
    sampleUrl:
      "https://www.alibaba.com/product-detail/smart-gadget_160029.html",
    sampleProduct: {
      name: "Wireless Mechanical Keyboard Retro RGB Hot-Swap",
      cny: 156.0,
      color: "Cyber Silver",
      size: "75% Layout",
      imageUrl:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "1688",
    name: "1688",
    placeholder: "Tempel link grosir 1688 di sini...",
    badgeBg: "bg-[#FF7300]",
    symbol: "16",
    sampleUrl: "https://detail.1688.com/offer/68192019.html",
    sampleProduct: {
      name: "Chunky Low-Top Dad Sneaker Leather Stitching",
      cny: 120.0,
      color: "Panda Black-White",
      size: "EU 42",
      imageUrl:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    },
  },
];

interface HeroLinkInputProps {
  className?: string;
  autoFocus?: boolean;
}

export function HeroLinkInput({ className }: HeroLinkInputProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig>(
    PLATFORMS[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationRecord, setConfirmationRecord] =
    useState<SubmissionRecord | null>(null);

  const user = useAuthStore((s) => s.user);
  const createSubmission = useSubmissionStore((s) => s.createSubmission);

  const handleSubmit = async (overrideUrl?: string) => {
    const rawUrl = (overrideUrl !== undefined ? overrideUrl : inputUrl).trim();
    const finalUrl = rawUrl || selectedPlatform.sampleUrl;

    if (!finalUrl) {
      error(
        "Link Kosong",
        "Silakan masukkan atau tempel link produk terlebih dahulu.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newRecord = createSubmission({
        userName: user?.name || "Tamu FLYPICK",
        userPhone: user?.phone || "081288992211",
        userEmail: user?.email,
        userId: user?.id,
        warehouseCode: user?.warehouseCode,
        links: [
          {
            url: finalUrl,
            userNotes: `Input via ${selectedPlatform.name}`,
          },
        ],
      });

      setInputUrl("");
      setConfirmationRecord(newRecord);
      setIsConfirmationOpen(true);
    } catch (_err) {
      error(
        "Gagal Memproses Link",
        "Mohon periksa kembali tautan yang dimasukkan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn("relative w-full max-w-3xl mx-auto space-y-3", className)}
    >
      {/* ── Main Floating Pill Bar ──────────────────────────────── */}
      <div className="relative flex items-center bg-white rounded-full border border-[#DCE4EC] p-1.5 sm:p-2 shadow-[0_16px_40px_-8px_rgba(16,53,208,0.14)] hover:border-[#1035D0]/40 transition-all">
        {/* Left Platform Selector Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-2 sm:pl-3 pr-2.5 sm:pr-3 py-2 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer select-none"
            aria-label="Pilih Platform"
          >
            {/* Platform Icon Badge */}
            <span
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs",
                selectedPlatform.badgeBg,
              )}
            >
              {selectedPlatform.symbol}
            </span>
            <span className="font-sans font-bold text-xs sm:text-sm text-[#0F172A]">
              {selectedPlatform.name}
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-[#64748B] transition-transform",
                isDropdownOpen ? "rotate-180 text-[#1035D0]" : "",
              )}
            />
          </button>

          {/* Floating Dropdown Popup (matching screenshot) */}
          {isDropdownOpen && (
            <>
              {/* Backdrop closer */}
              <button
                type="button"
                aria-label="Tutup Pilihan Platform"
                className="fixed inset-0 z-40 cursor-default bg-transparent border-0"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 z-50 w-52 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_20px_48px_-8px_rgba(15,23,42,0.18)] p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="space-y-0.5">
                  {PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatform.id === platform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer",
                          isSelected
                            ? "bg-[#EFF6FF] text-[#1035D0]"
                            : "hover:bg-[#F8FAFC] text-[#1E293B]",
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                              platform.badgeBg,
                            )}
                          >
                            {platform.symbol}
                          </span>
                          <span>{platform.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#1035D0]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-[#E2E8F0] mx-1 sm:mx-2 shrink-0" />

        {/* Center Input */}
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={selectedPlatform.placeholder}
          className="flex-1 bg-transparent px-2 sm:px-3 py-2 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none min-w-0"
        />

        {/* Right Round Blue Action Button (with arrow) */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit()}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1035D0] hover:bg-[#0A2699] active:scale-95 text-white flex items-center justify-center shrink-0 transition-all shadow-[0_8px_20px_-4px_rgba(16,53,208,0.4)] cursor-pointer"
          aria-label="Proses Link ke Keranjang"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Quick Clickable Demo Links (Under Bar) ─────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-[#64748B]">
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-[#3B82F6]" /> Coba contoh link:
        </span>
        <button
          type="button"
          onClick={() => {
            setSelectedPlatform(PLATFORMS[0]);
            setInputUrl(PLATFORMS[0].sampleUrl);
            handleSubmit(PLATFORMS[0].sampleUrl);
          }}
          className="px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] hover:border-[#1035D0] hover:text-[#1035D0] transition-colors shadow-2xs cursor-pointer font-medium"
        >
          🧥 Taobao Vintage Jacket (¥189)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedPlatform(PLATFORMS[1]);
            setInputUrl(PLATFORMS[1].sampleUrl);
            handleSubmit(PLATFORMS[1].sampleUrl);
          }}
          className="px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] hover:border-[#1035D0] hover:text-[#1035D0] transition-colors shadow-2xs cursor-pointer font-medium"
        >
          👜 Pinduoduo Canvas Tote (¥68)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedPlatform(PLATFORMS[2]);
            setInputUrl(PLATFORMS[2].sampleUrl);
            handleSubmit(PLATFORMS[2].sampleUrl);
          }}
          className="px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] hover:border-[#1035D0] hover:text-[#1035D0] transition-colors shadow-2xs cursor-pointer font-medium"
        >
          ⌨️ Alibaba Mechanical Keyboard (¥156)
        </button>
      </div>

      {/* Confirmation Modal */}
      <SubmissionConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        submission={confirmationRecord}
      />
    </div>
  );
}
