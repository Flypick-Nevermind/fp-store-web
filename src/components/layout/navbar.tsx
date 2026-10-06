"use client";

import { Compass, PlaneTakeoff, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/branding/brand-logo";
import { BRANDING } from "@/config/branding";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";

export function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF8E1] border-b-2 border-[#1A1A24] shadow-[0_2px_0_0_#2323FF]">
      {/* Top Ticker: Live Cargo Exchange Rate & Shanghai PVG Status */}
      <div className="bg-[#1A1A24] text-white py-1 px-4 text-[11px] font-mono flex items-center justify-between overflow-x-auto border-b border-[#2323FF]">
        <div className="flex items-center gap-4 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[#00F0FF]">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            SHANGHAI HUB [PVG-01]: AKTIF & TERIMA PAKET
          </span>
          <span className="hidden sm:inline text-white/50">|</span>
          <span className="hidden sm:inline text-white/80">
            KURS KONSOLIDASI:{" "}
            <strong className="text-[#FFDE00]">
              {BRANDING.exchangeRate.label}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 pl-4">
          <span className="text-[#00F0FF] hidden md:inline">
            FLIGHT CARGO PVG ➔ CGK: 7-10 HARI
          </span>
          <span className="bg-[#2323FF] text-[#FFF8E1] px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold">
            STAGE 1 & 2 TRANSPARAN
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <BrandLogo showSubtitle />
        </Link>

        {/* Navigation Tabs Styled as Boarding Gate Selectors */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 border-2 transition-all font-bold tracking-wider uppercase flex items-center gap-1.5",
              pathname === "/"
                ? "bg-[#2323FF] text-white border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
                : "bg-white text-[#1A1A24] border-transparent hover:border-[#1A1A24] hover:bg-[#FFF8E1]",
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            INTAKE HUB
          </Link>

          <Link
            href="/cart"
            className={cn(
              "px-3 py-1.5 border-2 transition-all font-bold tracking-wider uppercase flex items-center gap-1.5 relative",
              pathname === "/cart"
                ? "bg-[#2323FF] text-white border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
                : "bg-white text-[#1A1A24] border-transparent hover:border-[#1A1A24] hover:bg-[#FFF8E1]",
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            KERANJANG KONSOLIDASI
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-[#00F0FF] text-[#1A1A24] font-bold text-[10px] border border-[#1A1A24]">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            className={cn(
              "px-3 py-1.5 border-2 transition-all font-bold tracking-wider uppercase flex items-center gap-1.5",
              pathname === "/profile"
                ? "bg-[#2323FF] text-white border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
                : "bg-white text-[#1A1A24] border-transparent hover:border-[#1A1A24] hover:bg-[#FFF8E1]",
            )}
          >
            <PlaneTakeoff className="w-3.5 h-3.5" />
            GUDANG & LACAK
          </Link>
        </nav>

        {/* Right Action: User Luggage Pass & Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-2 bg-white border-2 border-[#1A1A24] px-2.5 py-1 shadow-[2px_2px_0px_0px_#1A1A24] hover:bg-[#FFF8E1] transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-[#2323FF]" />
            <div className="flex flex-col text-left">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#1A1A24]/60">
                LUGGAGE PASS
              </span>
              <span className="font-mono text-xs font-black text-[#2323FF]">
                {user ? user.warehouseCode : "MASUK"}
              </span>
            </div>
          </Link>

          <Link
            href="/cart"
            className="md:hidden relative p-2 bg-[#2323FF] text-white border-2 border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
            aria-label="Keranjang"
          >
            <ShoppingBag className="w-5 h-5 text-[#00F0FF]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#FFDE00] text-[#1A1A24] font-mono font-bold text-[10px] flex items-center justify-center border border-[#1A1A24]">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
