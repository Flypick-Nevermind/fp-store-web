"use client";

import {
  FileText,
  LogIn,
  LogOut,
  PackageSearch,
  Plane,
  Search,
  Warehouse,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge, Button } from "@/components/atoms";
import {
  LoginModal,
  OrderTimeline,
  VirtualWarehouseCard,
} from "@/components/organisms";
import { UserProductRequestsList } from "@/components/profile/user-product-requests-list";
import { UserSubmissionsList } from "@/components/profile/user-submissions-list";
import { useUserCartsQuery } from "@/hooks/use-cart-api";
import { useOrderTracking } from "@/hooks/use-order-tracking";
import { cn } from "@/lib/utils";
import { useProductRequestStore } from "@/store/use-product-request-store";

type ProfileTab = "SUBMISSIONS" | "REQUESTS" | "MANIFEST" | "WAREHOUSE";

export function ProfileTemplate() {
  const {
    user,
    isAuthenticated,
    orders,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  } = useOrderTracking();

  const { data: serverCarts } = useUserCartsQuery(user?.id);
  const requests = useProductRequestStore((s) => s.requests);
  const [activeTab, setActiveTab] = useState<ProfileTab>("SUBMISSIONS");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "requests" || params.get("tab") === "request") {
        setActiveTab("REQUESTS");
      }
    }
  }, []);

  // User backend carts count
  const mySubmissionsCount =
    isAuthenticated && user ? (serverCarts?.length ?? 0) : 0;

  // User product requests count
  const myRequestsCount = requests.filter((req) => {
    if (isAuthenticated && user) {
      return (
        req.userId === user.id ||
        (user.phone && req.userPhone.includes(user.phone.replace(/\D/g, ""))) ||
        (user.email &&
          req.userEmail &&
          req.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.warehouseCode && req.warehouseCode === user.warehouseCode)
      );
    }
    return true;
  }).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* ── Modern Top Profile Header ───────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-xs text-[#1035D0] font-bold">
            <PackageSearch className="w-4 h-4" />
            <span>FLYPICK TRACK &amp; MANAGE</span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Lacak Pesanan &amp; Cek Link
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-xl">
            Pantau status verifikasi stok produk China dan lacak progres
            penerbangan kargo pesanan Anda.
          </p>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-2 sm:px-3">
              <div className="text-right font-sans">
                <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">
                  Akun Aktif
                </span>
                <span className="text-xs font-bold text-slate-800 block">
                  @{user.username || user.name}
                </span>
                {user.email && (
                  <span className="text-[11px] font-mono text-slate-500 block truncate max-w-[180px]">
                    {user.email}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="paper"
                size="sm"
                onClick={logout}
                className="rounded-xl text-xs text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Keluar
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="electric"
              size="md"
              onClick={openLoginModal}
              className="rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Masuk / Daftar Akun
            </Button>
          )}
        </div>
      </div>

      {/* ── Segmented Navigation Tabs ───────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
            activeTab === "SUBMISSIONS"
              ? "bg-white text-[#1035D0] shadow-xs"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Status Cek Link</span>
          {mySubmissionsCount > 0 && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                activeTab === "SUBMISSIONS"
                  ? "bg-[#1035D0] text-white"
                  : "bg-slate-200 text-slate-700",
              )}
            >
              {mySubmissionsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("REQUESTS")}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
            activeTab === "REQUESTS"
              ? "bg-white text-[#1035D0] shadow-xs"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <Search className="w-4 h-4" />
          <span>Request Produk</span>
          {myRequestsCount > 0 && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                activeTab === "REQUESTS"
                  ? "bg-[#1035D0] text-white"
                  : "bg-slate-200 text-slate-700",
              )}
            >
              {myRequestsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("MANIFEST")}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
            activeTab === "MANIFEST"
              ? "bg-white text-[#1035D0] shadow-xs"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <Plane className="w-4 h-4" />
          <span>Lacak Kargo</span>
          {orders.length > 0 && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                activeTab === "MANIFEST"
                  ? "bg-[#1035D0] text-white"
                  : "bg-slate-200 text-slate-700",
              )}
            >
              {orders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("WAREHOUSE")}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
            activeTab === "WAREHOUSE"
              ? "bg-white text-[#1035D0] shadow-xs"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <Warehouse className="w-4 h-4" />
          <span>Gudang China</span>
        </button>
      </div>

      {/* ── Tab Content Views ────────────────────────────────────── */}
      <div className="transition-all duration-200">
        {/* Tab 1: Cek Link Submissions */}
        {activeTab === "SUBMISSIONS" && (
          <section className="space-y-4">
            <UserSubmissionsList />
          </section>
        )}

        {/* Tab 2: Sourcing Requests */}
        {activeTab === "REQUESTS" && (
          <section className="space-y-4">
            <UserProductRequestsList />
          </section>
        )}

        {/* Tab 2: Cargo Orders & Timeline */}
        {activeTab === "MANIFEST" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
                  Manifest &amp; Timeline Kargo ({orders.length})
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Pantau penerbangan dari Shanghai Pudong ke Jakarta Cengkareng.
                </p>
              </div>
              <Badge variant="neon">{orders.length} TIKET PESANAN</Badge>
            </div>
            <OrderTimeline orders={orders} />
          </section>
        )}

        {/* Tab 3: Virtual Warehouse Card */}
        {activeTab === "WAREHOUSE" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900">
                  Alamat Virtual Gudang Shanghai
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Gunakan alamat ini jika Anda ingin checkout mandiri di Taobao
                  / 1688.
                </p>
              </div>
              <Badge variant="electric">AKTIF &amp; SIAP TERIMA</Badge>
            </div>
            <VirtualWarehouseCard />
          </section>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}
