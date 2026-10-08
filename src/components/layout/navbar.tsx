"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { LoginModal } from "@/components/profile/login-modal";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";

export function Navbar() {
  const pathname = usePathname();
  const { info } = useToast();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rawItemCount = useCartStore((s) => s.getItemCount());
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const itemCount = isMounted ? rawItemCount : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      info(
        "Pencarian Produk",
        `Mencari "${searchQuery}". Anda juga dapat langsung menempelkan link produk China di halaman utama.`,
      );
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* ── Left: Brand Logo ─────────────────────────────────── */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <BrandLogo iconSize={36} />
          </Link>

          {/* ── Center: Minimal Navigation ───────────────────────── */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold text-[#1E293B]">
            <button
              type="button"
              onClick={() =>
                info(
                  "Tentang FLYPICK",
                  "FLYPICK adalah platform jasa titip & logistik kargo terpercaya rute China ke Indonesia dengan transparansi biaya tanpa perantara.",
                )
              }
              className="hover:text-[#1035D0] transition-colors cursor-pointer"
            >
              About
            </button>

            <Link
              href="/profile"
              className={cn(
                "hover:text-[#1035D0] transition-colors cursor-pointer",
                pathname === "/profile" ? "text-[#1035D0] font-bold" : "",
              )}
            >
              Track Order
            </Link>

            <button
              type="button"
              onClick={() =>
                info(
                  "Promo Aktif",
                  "🎉 Gratis biaya packing ekstra bubble wrap 3-lapis untuk pesanan pertama Anda!",
                )
              }
              className="hover:text-[#1035D0] transition-colors cursor-pointer"
            >
              Promo
            </button>
          </nav>

          {/* ── Right Actions: Search, Cart, Masuk / Daftar ──────── */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="p-2 text-[#334155] hover:text-[#1035D0] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-[#334155] hover:text-[#1035D0] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[#1035D0] text-white font-mono font-bold text-[10px] flex items-center justify-center rounded-full shadow-xs animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Masuk / Daftar Rounded Pill Button */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2 rounded-full border border-[#1035D0] text-[#1035D0] hover:bg-[#1035D0] hover:text-white font-sans text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer select-none"
            >
              {isMounted && isAuthenticated && user
                ? user.warehouseCode
                : "Masuk / Daftar"}
            </button>
          </div>
        </div>

        {/* ── Collapsible Search Bar Overlay ───────────────────── */}
        {isSearchOpen && (
          <div className="border-t border-[#E8E2D9] bg-white px-4 py-3 animate-in slide-in-from-top-2 duration-150">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama produk Taobao, 1688, atau kategori..."
                className="flex-1 bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* WhatsApp OTP / Auth Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
