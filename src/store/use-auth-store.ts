import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type { ChinaWarehouseAddress, UserProfile } from "@/types";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  setToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  login: (phone: string, name?: string) => void;
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
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token: string, user: UserProfile) => {
        set({ token, user, isAuthenticated: true });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      setUser: (user: UserProfile | null) => {
        set({ user, isAuthenticated: !!user });
      },

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
        set({ user, token: null, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
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
