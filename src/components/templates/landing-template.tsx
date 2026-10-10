"use client";

import { FlypickLogoIcon } from "@/components/branding/flypick-logo-icon";
import { HeroAviationVisual } from "@/components/home/hero-aviation-visual";
import { MultiLinkIntakeForm } from "@/components/intake/multi-link-intake-form";

export function LandingTemplate() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden bg-[#FAF8F5]">
      {/* ── Background Aviation Visuals (Ticket, dashed flight trail, airplane) ── */}
      <HeroAviationVisual />

      {/* ── Center Content Container ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center items-center text-center space-y-5 sm:space-y-6 my-auto">
        {/* Center Stylized F Logo Icon */}
        <div className="flex justify-center transition-transform hover:scale-105 duration-300">
          <FlypickLogoIcon
            size={64}
            priority
            className="w-13 h-13 sm:w-16 sm:h-16"
          />
        </div>

        {/* Main Headline & Tagline */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <h1 className="font-sans font-black tracking-tight text-3xl sm:text-5xl md:text-6xl uppercase leading-none">
            <span className="block text-[#1035D0] drop-shadow-xs">
              FROM CHINA TO
            </span>
            <span className="block bg-gradient-to-r from-[#00C2FF] via-[#00B4D8] to-[#1035D0] bg-clip-text text-transparent mt-0.5">
              YOUR DOORSTEP
            </span>
          </h1>

          <p className="text-[#475569] text-xs sm:text-sm md:text-base font-normal max-w-md mx-auto pt-0.5 font-sans">
            Kirim link belanja China kamu. Admin kami cek langsung ketersediaan
            &amp; kirim ke depan pintu rumahmu.
          </p>
        </div>

        {/* ── Direct Unified Intake Form ───────────────────────────── */}
        <div className="w-full max-w-2xl px-2">
          <MultiLinkIntakeForm />
        </div>
      </div>
    </div>
  );
}
