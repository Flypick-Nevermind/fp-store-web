"use client";

import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroAviationVisualProps {
  className?: string;
}

export function HeroAviationVisual({ className }: HeroAviationVisualProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className,
      )}
      aria-hidden="true"
    >
      {/* ── Flight Path SVG (Curved Dashed Loop Trail) ──────────── */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Flight Path Line</title>
        <defs>
          <linearGradient
            id="flightTrailGrad"
            x1="120"
            y1="360"
            x2="1320"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#2563EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer subtle guide arc */}
        <path
          d="M 180 340 C 200 480, 360 560, 520 560 C 800 560, 1100 560, 1260 520 C 1380 480, 1380 320, 1260 280 C 1180 250, 1150 320, 1210 360 C 1270 400, 1340 320, 1310 240"
          stroke="url(#flightTrailGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="8 8"
          fill="none"
          opacity="0.85"
        />

        {/* Small loop rings & navigation dots */}
        <circle cx="1205" cy="345" r="3.5" fill="#2563EB" opacity="0.7" />
        <circle cx="1235" cy="310" r="2.5" fill="#60A5FA" opacity="0.6" />
      </svg>

      {/* ── Left Element: Floating Boarding Pass Ticket ─────────── */}
      <div className="absolute left-4 sm:left-8 md:left-14 lg:left-20 top-24 sm:top-28 -rotate-12 transition-transform duration-700 hover:rotate-0">
        <div className="relative w-44 sm:w-56 h-22 sm:h-26 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_16px_36px_-6px_rgba(16,53,208,0.12)] p-2.5 sm:p-3 flex items-center justify-between overflow-hidden">
          {/* Ticket notches */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E2E8F0]" />
          <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E2E8F0]" />

          {/* Left section: Brand & Barcode */}
          <div className="flex-1 pr-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black italic text-xs tracking-tight text-[#1035D0]">
                FLYPICK
              </span>
              <span className="text-[8px] font-mono text-[#94A3B8] uppercase">
                PASS
              </span>
            </div>

            {/* Tiny flight details */}
            <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-[#64748B]">
              <span>PVG</span>
              <span className="text-[#3B82F6]">➔</span>
              <span>CGK</span>
            </div>

            {/* Realistic barcode illustration */}
            <div className="flex items-center gap-[2px] h-4.5 pt-0.5 overflow-hidden opacity-85">
              <span className="w-1 h-full bg-[#1E293B]" />
              <span className="w-0.5 h-full bg-[#1E293B]" />
              <span className="w-1.5 h-full bg-[#1E293B]" />
              <span className="w-0.5 h-full bg-[#1E293B]" />
              <span className="w-1 h-full bg-[#1E293B]" />
              <span className="w-2 h-full bg-[#1E293B]" />
              <span className="w-0.5 h-full bg-[#1E293B]" />
              <span className="w-1 h-full bg-[#1E293B]" />
              <span className="w-0.5 h-full bg-[#1E293B]" />
              <span className="w-1.5 h-full bg-[#1E293B]" />
              <span className="w-1 h-full bg-[#1E293B]" />
              <span className="w-0.5 h-full bg-[#1E293B]" />
              <span className="w-2 h-full bg-[#1E293B]" />
              <span className="w-0.5 h-full bg-[#1E293B]" />
              <span className="w-1 h-full bg-[#1E293B]" />
            </div>
          </div>

          {/* Perforated vertical line divider */}
          <div className="h-full border-r border-dashed border-[#CBD5E1] mx-1" />

          {/* Right section: Airplane stamp cutout */}
          <div className="w-10 sm:w-12 h-full flex flex-col items-center justify-center pl-1 text-[#3B82F6]">
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
              <Plane className="w-4 h-4 text-[#1035D0] -rotate-45" />
            </div>
            <span className="text-[7px] font-mono font-bold text-[#64748B] uppercase mt-1">
              AIR CARGO
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Element: Soaring Passenger Jet Airplane ─────────── */}
      <div className="absolute right-4 sm:right-10 md:right-16 lg:right-24 top-20 sm:top-24 rotate-[28deg] transition-transform duration-700 hover:scale-105">
        <svg
          width="135"
          height="135"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_18px_24px_rgba(16,53,208,0.22)]"
        >
          <title>Passenger Jet Airplane</title>
          <defs>
            <linearGradient
              id="planeFuselage"
              x1="40"
              y1="20"
              x2="120"
              y2="140"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient
              id="planeWingBlue"
              x1="20"
              y1="40"
              x2="140"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#00C8FF" />
              <stop offset="50%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#1035D0" />
            </linearGradient>
          </defs>

          {/* Airplane shadow/layer */}
          <path
            d="M78 12C81 12 83 15 83 20L84 64L150 94C153 95 154 98 152 101L144 108C142 110 139 110 137 109L84 84L85 120L102 135C104 137 104 140 102 142L96 146C94 147 92 147 90 146L79 138L68 146C66 147 64 147 62 146L56 142C54 140 54 137 56 135L73 120L74 84L21 109C19 110 16 110 14 108L6 101C4 98 5 95 8 94L74 64L75 20C75 15 77 12 78 12Z"
            fill="url(#planeWingBlue)"
          />

          {/* Main White Aerodynamic Fuselage overlay */}
          <path
            d="M78 14C79.5 14 81 16 81 22L81.5 68L76.5 68L77 22C77 16 77.5 14 78 14Z"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* Cockpit windshield & cabin windows */}
          <ellipse cx="78" cy="22" rx="2.5" ry="4" fill="#0F172A" />
          <line
            x1="77"
            y1="32"
            x2="77"
            y2="62"
            stroke="#00C8FF"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.75"
          />
          <line
            x1="81"
            y1="32"
            x2="81"
            y2="62"
            stroke="#00C8FF"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.75"
          />
        </svg>
      </div>
    </div>
  );
}
