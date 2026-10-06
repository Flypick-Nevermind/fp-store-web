import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type { ChinaWarehouseAddress, UserProfile } from "@/types";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (phone: string, name?: string) => void;
  loginWithGoogle: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const buildDefaultAddress = (
  code: string,
  name: string,
): ChinaWarehouseAddress => ({
  recipientName: `${name} [${code}]`,
  phone: BRANDING.warehouse.shanghai.phone,
  province: BRANDING.warehouse.shanghai.province,
  city: BRANDING.warehouse.shanghai.city,
  district: BRANDING.warehouse.shanghai.district,
  streetAddress: `${BRANDING.warehouse.shanghai.streetAddress} (User ID: ${code})`,
  postalCode: BRANDING.warehouse.shanghai.postalCode,
  hubCode: BRANDING.warehouse.shanghai.hubCode,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "usr_guest_8821",
        name: "Ahmad Fikri",
        phone: "+6281299887766",
        warehouseCode: BRANDING.defaultWarehouseCode,
        addressChina: buildDefaultAddress(
          BRANDING.defaultWarehouseCode,
          "Ahmad Fikri",
        ),
        createdAt: "2026-10-04T00:00:00.000Z",
      },
      isAuthenticated: true,

      login: (phone: string, name = "Sobat FLYPICK") => {
        const code = `FP-${Math.floor(1000 + Math.random() * 9000)}`;
        const user: UserProfile = {
          id: `usr_${Date.now()}`,
          name,
          phone,
          warehouseCode: code,
          addressChina: buildDefaultAddress(code, name),
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true });
      },

      loginWithGoogle: (email: string, name: string) => {
        const code = `FP-${Math.floor(1000 + Math.random() * 9000)}`;
        const user: UserProfile = {
          id: `usr_g_${Date.now()}`,
          name,
          email,
          phone: "+6281200001111",
          warehouseCode: code,
          addressChina: buildDefaultAddress(code, name),
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };
          return { user: updatedUser };
        });
      },
    }),
    {
      name: "flypick-auth-storage",
    },
  ),
);
