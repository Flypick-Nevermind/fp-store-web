"use client";

import { Clock, Layers, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { FlypickLogoIcon } from "@/components/branding/flypick-logo-icon";
import { HeroAviationVisual } from "@/components/home/hero-aviation-visual";
import { HeroLinkInput } from "@/components/home/hero-link-input";
import { MultiLinkIntakeForm } from "@/components/intake/multi-link-intake-form";
import { cn } from "@/lib/utils";

export function LandingTemplate() {
  const [inputMode, setInputMode] = useState<"multi" | "quick">("multi");

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden bg-[#FAF8F5]">
      {/* ── Background Aviation Visuals (Ticket, dashed flight trail, airplane) ── */}
      <HeroAviationVisual />

      {/* ── Center Content Container ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center text-center my-auto space-y-6 sm:space-y-8">
        {/* Center Stylized F Logo Icon */}
        <div className="flex justify-center transition-transform hover:scale-105 duration-300">
          <FlypickLogoIcon
            size={68}
            priority
            className="w-14 h-14 sm:w-18 sm:h-18"
          />
        </div>

        {/* Main Headline & Tagline */}
        <div className="space-y-2.5 max-w-2xl mx-auto">
          <h1 className="font-sans font-black tracking-tight text-3xl sm:text-5xl md:text-6xl uppercase leading-none">
            <span className="block text-[#1035D0] drop-shadow-xs">
              FROM CHINA TO
            </span>
            <span className="block bg-gradient-to-r from-[#00C2FF] via-[#00B4D8] to-[#1035D0] bg-clip-text text-transparent mt-1">
              YOUR DOORSTEP
            </span>
          </h1>

          <p className="text-[#475569] text-xs sm:text-sm md:text-base font-normal max-w-md mx-auto pt-1 font-sans">
            Kirim link belanja China kamu. Admin kami cek langsung ketersediaan
            &amp; kirim ke depan pintu rumahmu.
          </p>
        </div>

        {/* ── Mode Switcher & Form Container ───────────────────────── */}
        <div className="w-full max-w-2xl px-2 space-y-4">
          <div className="inline-flex items-center justify-center p-1 bg-white/80 backdrop-blur-sm rounded-full border border-[#DCE4EC] shadow-2xs">
            <button
              type="button"
              onClick={() => setInputMode("multi")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                inputMode === "multi"
                  ? "bg-[#1035D0] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Form Multi-Link (Tambah Baris)</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode("quick")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                inputMode === "quick"
                  ? "bg-[#1035D0] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]",
              )}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Input 1 Link Cepat</span>
            </button>
          </div>

          {/* Form Render */}
          {inputMode === "multi" ? (
            <MultiLinkIntakeForm className="animate-in fade-in zoom-in-95 duration-200" />
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <HeroLinkInput />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom 3 Trust Badges (Aman, Mudah, Cepat) ───────────── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto pt-6 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 text-[#1035D0]">
          {/* Badge 1: Aman */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1035D0]" />
            </div>
            <div className="text-left">
              <p className="font-sans font-bold text-xs sm:text-sm text-[#0F172A] leading-tight">
                Aman
              </p>
              <p className="font-sans text-[11px] text-[#64748B]">
                Dari China ke Indonesia
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#CBD5E1]" />

          {/* Badge 2: Mudah */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#1035D0]" />
            </div>
            <div className="text-left">
              <p className="font-sans font-bold text-xs sm:text-sm text-[#0F172A] leading-tight">
                Mudah
              </p>
              <p className="font-sans text-[11px] text-[#64748B]">
                Cukup 1 link
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#CBD5E1]" />

          {/* Badge 3: Cepat */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#1035D0]" />
            </div>
            <div className="text-left">
              <p className="font-sans font-bold text-xs sm:text-sm text-[#0F172A] leading-tight">
                Cepat
              </p>
              <p className="font-sans text-[11px] text-[#64748B]">
                Proses transparan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
