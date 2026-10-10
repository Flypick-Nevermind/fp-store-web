"use client";

import {
  ChevronDown,
  LogOut,
  Search,
  ShieldCheck,
  ShoppingBag,
  Warehouse,
  X,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { LoginModal } from "@/components/profile/login-modal";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";

export function Navbar() {
  const pathname = usePathname();
  const { info, success } = useToast();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const rawItemCount = useCartStore((s) => s.getItemCount());
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const itemCount = isMounted ? rawItemCount : 0;
  const isUserLoggedIn = isMounted && isAuthenticated && !!user;

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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    success("Berhasil Keluar", "Sesi Anda telah diakhiri.");
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

            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                pathname === "/admin"
                  ? "bg-[#1035D0] text-white shadow-xs"
                  : "bg-blue-50 text-[#1035D0] hover:bg-blue-100 border border-blue-200/80",
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1035D0]" />
              <span>Admin Cek Link</span>
            </Link>
          </nav>

          {/* ── Right Actions: Search, Cart, Masuk / User Profile Menu ──────── */}
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

            {/* User Account Controls */}
            {isUserLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:border-[#1035D0] text-slate-800 hover:text-[#1035D0] font-sans text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer select-none group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-tight">
                    {user.warehouseCode}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isUserMenuOpen ? "rotate-180" : "",
                    )}
                  />
                </button>

                {/* Dropdown Menu for Logged In User */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* User Info Header */}
                    <div className="border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#1035D0] font-sans text-[10px] font-bold rounded-full border border-blue-200">
                          Member Terverifikasi
                        </span>
                      </div>
                      <p className="font-sans font-bold text-sm text-[#0F172A] truncate">
                        {user.name}
                      </p>
                      <p className="font-mono text-xs text-[#64748B] truncate">
                        {user.email || user.phone}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
                        <span className="text-[#64748B] text-[11px]">
                          ID GUDANG:
                        </span>
                        <span className="font-bold text-[#1035D0]">
                          {user.warehouseCode}
                        </span>
                      </div>
                    </div>

                    {/* Nav Links */}
                    <div className="space-y-1 font-sans text-xs font-semibold">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#1035D0] transition-all"
                      >
                        <Warehouse className="w-4 h-4 text-[#1035D0]" />
                        <span>Lacak Pesanan &amp; Gudang</span>
                      </Link>

                      <Link
                        href="/cart"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#1035D0] transition-all"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#1035D0]" />
                        <span>Keranjang Belanja</span>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1035D0] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 transition-all font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#1035D0]" />
                        <span>Dashboard Admin (Cek Link)</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-slate-100 pt-2 mt-3">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2 rounded-full bg-[#1035D0] hover:bg-[#0A2699] text-white font-sans text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer select-none"
              >
                Masuk / Daftar
              </button>
            )}
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
