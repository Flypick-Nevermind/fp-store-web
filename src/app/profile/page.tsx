"use client";

import { LogIn, LogOut, Plane, Warehouse } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "@/components/profile/login-modal";
import { OrderTimeline } from "@/components/profile/order-timeline";
import { VirtualWarehouseCard } from "@/components/profile/virtual-warehouse-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { useCheckoutStore } from "@/store/use-checkout-store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const orders = useCheckoutStore((s) => s.orders);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Banner */}
      <div className="bg-[#FFF8E1] border-2 border-[#1A1A24] p-4 sm:p-6 shadow-[4px_4px_0px_0px_#2323FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 font-mono text-xs text-[#1A1A24]/70">
            <span>FLYPICK WAREHOUSE PASS & TRACKING</span>
            <span>/</span>
            <span className="text-[#2323FF] font-bold">TERMINAL PELANGGAN</span>
          </div>
          <h1 className="font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1A1A24]">
            KARTU GUDANG SHANGHAI & LACAK PESANAN
          </h1>
          <p className="text-xs text-[#1A1A24]/75 mt-1 font-sans">
            Gunakan alamat virtual Anda saat checkout mandiri di Taobao/1688 dan
            pantau perjalanan penerbangan kargo Anda.
          </p>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block font-mono">
                <span className="text-[10px] text-[#1A1A24]/60 block uppercase">
                  LOGIN SEBAGAI
                </span>
                <span className="text-xs font-bold text-[#1A1A24]">
                  {user.name}
                </span>
              </div>
              <Button
                type="button"
                variant="paper"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:border-red-600"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Keluar
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="neon"
              size="md"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              MASUK DENGAN WHATSAPP / GOOGLE
            </Button>
          )}
        </div>
      </div>

      {/* Main Section 1: Virtual Warehouse Card */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#2323FF]" />
            <h2 className="font-mono text-base sm:text-lg font-black uppercase text-[#1A1A24]">
              1. Kartu Identitas Gudang Shanghai (Virtual Luggage Pass)
            </h2>
          </div>
          <Badge variant="electric">AKTIF & SIAP TERIMA PAKET</Badge>
        </div>

        {/* Render Virtual Warehouse Luggage Card */}
        <VirtualWarehouseCard />
      </section>

      {/* Main Section 2: Order Timeline & Cargo Status */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#2323FF]" />
            <h2 className="font-mono text-base sm:text-lg font-black uppercase text-[#1A1A24]">
              2. Manifest Pesanan & Timeline Pelacakan Kargo
            </h2>
          </div>
          <Badge variant="neon">{orders.length} TIKET PESANAN</Badge>
        </div>

        {/* Render Order Timeline */}
        <OrderTimeline orders={orders} />
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
