"use client";

import { Link2, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { FlypickLogoIcon } from "@/components/branding/flypick-logo-icon";
import { HeroAviationVisual } from "@/components/home/hero-aviation-visual";
import { MultiLinkIntakeForm } from "@/components/intake/multi-link-intake-form";
import { ProductRequestForm } from "@/components/intake/product-request-form";
import { cn } from "@/lib/utils";

export function LandingTemplate() {
  const [activeTab, setActiveTab] = useState<"LINK" | "REQUEST">("LINK");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "request" || params.get("tab") === "requests") {
        setActiveTab("REQUEST");
      }
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden bg-[#FAF8F5]">
      {/* ── Background Aviation Visuals (Ticket, dashed flight trail, airplane) ── */}
      <HeroAviationVisual />

      {/* ── Center Content Container ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center items-center text-center space-y-4 sm:space-y-5 my-auto">
        {/* Center Stylized F Logo Icon */}
        <div className="flex justify-center transition-transform hover:scale-105 duration-300">
          <FlypickLogoIcon
            size={60}
            priority
            className="w-12 h-12 sm:w-15 sm:h-15"
          />
        </div>

        {/* Main Headline & Tagline */}
        <div className="space-y-1.5 max-w-2xl mx-auto">
          <h1 className="font-sans font-black tracking-tight text-3xl sm:text-5xl md:text-6xl uppercase leading-none">
            <span className="block text-[#1035D0] drop-shadow-xs">
              FROM CHINA TO
            </span>
            <span className="block bg-gradient-to-r from-[#00C2FF] via-[#00B4D8] to-[#1035D0] bg-clip-text text-transparent mt-0.5">
              YOUR DOORSTEP
            </span>
          </h1>

          <p className="text-[#475569] text-xs sm:text-sm md:text-base font-normal max-w-lg mx-auto pt-0.5 font-sans">
            {activeTab === "LINK"
              ? "Kirim link belanja Taobao/1688 kamu. Admin kami cek ketersediaan stok & kirim ke depan pintu rumahmu."
              : "Belum punya link? Beritahu barang yang kamu cari, tim sourcing China kami bantu carikan supplier tangan pertama."}
          </p>
        </div>

        {/* ── Segmented Service Switcher ────────────────────────────── */}
        <div className="inline-flex items-center p-1.5 bg-[#EDE8E0] border border-[#DDD6CB] rounded-2xl shadow-inner max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("LINK")}
            className={cn(
              "flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none",
              activeTab === "LINK"
                ? "bg-white text-[#1035D0] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]",
            )}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Tempel Link Belanja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REQUEST")}
            className={cn(
              "flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none",
              activeTab === "REQUEST"
                ? "bg-white text-[#1035D0] shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]",
            )}
          >
            <Search className="w-3.5 h-3.5 text-[#1035D0]" />
            <span>Request Cari Produk</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              Gratis
            </span>
          </button>
        </div>

        {/* ── Direct Unified Intake Form ───────────────────────────── */}
        <div className="w-full max-w-2xl px-2">
          {activeTab === "LINK" ? (
            <MultiLinkIntakeForm />
          ) : (
            <ProductRequestForm />
          )}
        </div>
      </div>
    </div>
  );
}
