"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType =
  | "ORDER"
  | "LOGISTICS"
  | "PAYMENT"
  | "SYSTEM"
  | "PROMO";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  linkUrl?: string;
  badgeText?: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Paket Tiba di Gudang Shanghai",
    message:
      "Pesanan FP-SH-8821 telah diterima di gudang Shanghai. Petugas sedang melakukan foto QC unboxing & penimbangan kargo.",
    type: "LOGISTICS",
    badgeText: "Gudang Shanghai",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isRead: false,
    linkUrl: "/profile",
  },
  {
    id: "notif-2",
    title: "Pengecekan Link Selesai",
    message:
      "2 link produk Taobao Anda (SUB-202610-7450) telah diverifikasi oleh tim Admin. Stok tersedia dan siap diproses ke pembayaran.",
    type: "ORDER",
    badgeText: "Cek Link",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isRead: false,
    linkUrl: "/profile",
  },
  {
    id: "notif-3",
    title: "Tagihan Kargo Siap Dibayar",
    message:
      "Kargo penerbangan Shanghai-Jakarta telah dijadwalkan. Silakan selesaikan pembayaran biaya kirim internasional Tahap 2.",
    type: "PAYMENT",
    badgeText: "Tahap 2",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    isRead: true,
    linkUrl: "/profile",
  },
  {
    id: "notif-4",
    title: "Promo Gratis Packing Bubble Wrap",
    message:
      "Nikmati proteksi ekstra gratis bubble wrap 3-lapis tebal untuk semua pembelian barang Anda tanpa biaya tambahan!",
    type: "PROMO",
    badgeText: "Promo Spesial",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isRead: true,
    linkUrl: "/",
  },
];

interface NotificationState {
  notifications: AppNotification[];
  getUnreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (
    item: Omit<AppNotification, "id" | "createdAt" | "isRead"> & {
      isRead?: boolean;
    },
  ) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
        }));
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      addNotification: (item) => {
        const newNotif: AppNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: item.title,
          message: item.message,
          type: item.type,
          createdAt: new Date().toISOString(),
          isRead: item.isRead ?? false,
          linkUrl: item.linkUrl,
          badgeText: item.badgeText,
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },
    }),
    {
      name: "fp_notifications_storage",
    },
  ),
);
