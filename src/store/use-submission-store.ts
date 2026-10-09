"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type {
  CreateSubmissionInput,
  NotificationChannel,
  NotificationLog,
  SubmissionItemLink,
  SubmissionRecord,
} from "@/types/submission";

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("taobao")) return "Taobao";
    if (parsed.hostname.includes("tmall")) return "Tmall";
    if (parsed.hostname.includes("1688")) return "1688";
    if (
      parsed.hostname.includes("pinduoduo") ||
      parsed.hostname.includes("yangkeduo")
    )
      return "Pinduoduo";
    if (parsed.hostname.includes("alibaba")) return "Alibaba";
    return parsed.hostname.replace("www.", "");
  } catch {
    return "Toko China";
  }
}

const SEED_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: "SUB-202610-8912",
    createdAt: "2026-10-09T08:15:00.000Z",
    updatedAt: "2026-10-09T08:15:00.000Z",
    userName: "Budi Santoso",
    userPhone: "081288992211",
    userEmail: "budi.santoso@gmail.com",
    warehouseCode: "FP-SH-8821",
    status: "PENDING_REVIEW",
    links: [
      {
        id: "LINK-8912-1",
        url: "https://item.taobao.com/item.htm?id=726194812301",
        domain: "Taobao",
        userNotes: "Mau warna Hitam Washed, Ukuran XL (Loose Fit), Qty 1 pcs",
        status: "PENDING",
        isChecked: false,
      },
      {
        id: "LINK-8912-2",
        url: "https://detail.tmall.com/item.htm?id=691238475920",
        domain: "Tmall",
        userNotes:
          "Sneaker putih strip biru, Ukuran EU 42. Minta box sepatu utuh.",
        status: "PENDING",
        isChecked: false,
      },
    ],
    notifications: [],
  },
  {
    id: "SUB-202610-7450",
    createdAt: "2026-10-09T07:20:00.000Z",
    updatedAt: "2026-10-09T08:45:00.000Z",
    userName: "Siti Rahmawati",
    userPhone: "085712345678",
    userEmail: "siti.rahma@gmail.com",
    warehouseCode: "FP-SH-9142",
    status: "REVIEWED",
    reviewedAt: "2026-10-09T08:45:00.000Z",
    reviewerName: "Admin Shanghai Ops",
    overallAdminNotes:
      "Semua link sudah kami cek ke seller Taobao. Barang siap di-order.",
    links: [
      {
        id: "LINK-7450-1",
        url: "https://item.taobao.com/item.htm?id=68192019",
        domain: "Taobao",
        userNotes: "Tas Canvas Selempang warna Cream Khaki",
        status: "AVAILABLE",
        adminNotes:
          "Stok ready warna cream khaki. Harga promo seller ¥78 (~Rp 187.200).",
        priceCny: 78,
        priceIdr: 187200,
        isChecked: true,
      },
      {
        id: "LINK-7450-2",
        url: "https://detail.1688.com/offer/712398471234.html",
        domain: "1688",
        userNotes: "Minimal order berapa pcs ya min? Mau beli 3 pcs.",
        status: "AVAILABLE",
        adminNotes:
          "Bisa eceran 3 pcs via toko relasi kami di Shanghai. Harga ¥45/pcs.",
        priceCny: 135,
        priceIdr: 324000,
        isChecked: true,
      },
    ],
    notifications: [],
  },
  {
    id: "SUB-202610-6104",
    createdAt: "2026-10-08T15:30:00.000Z",
    updatedAt: "2026-10-08T16:10:00.000Z",
    userName: "Hendro Wijaya",
    userPhone: "081900112233",
    userEmail: "hendro.w@yahoo.com",
    warehouseCode: "FP-SH-6320",
    status: "NOTIFIED",
    reviewedAt: "2026-10-08T16:00:00.000Z",
    reviewerName: "Admin Fikri",
    overallAdminNotes:
      "Cek link selesai, notifikasi WhatsApp sudah dikirim ke user.",
    links: [
      {
        id: "LINK-6104-1",
        url: "https://item.taobao.com/item.htm?id=782910382901",
        domain: "Taobao",
        userNotes: "Hoodie Heavyweight 460GSM Charcoal Grey XL",
        status: "AVAILABLE",
        adminNotes: "Stok tersedia, bahan tebal 460GSM asli. Harga ¥169.",
        priceCny: 169,
        priceIdr: 405600,
        isChecked: true,
      },
    ],
    notifications: [
      {
        id: "NOTIF-6104-1",
        sentAt: "2026-10-08T16:10:00.000Z",
        channels: ["WHATSAPP", "EMAIL"],
        message:
          "Halo Hendro Wijaya, pengajuan cek link SUB-202610-6104 selesai dicek. Stok tersedia (¥169).",
        recipientPhone: "081900112233",
        recipientEmail: "hendro.w@yahoo.com",
      },
    ],
  },
];

interface SubmissionState {
  submissions: SubmissionRecord[];

  // Actions
  createSubmission: (input: CreateSubmissionInput) => SubmissionRecord;
  updateLinkReview: (
    submissionId: string,
    linkId: string,
    updates: Partial<
      Pick<
        SubmissionItemLink,
        "status" | "adminNotes" | "priceCny" | "priceIdr" | "isChecked"
      >
    >,
  ) => void;
  markSubmissionAsReviewed: (
    submissionId: string,
    reviewerName?: string,
    overallNotes?: string,
  ) => void;
  notifyUser: (
    submissionId: string,
    channels: NotificationChannel[],
    message: string,
  ) => NotificationLog;
  deleteSubmission: (submissionId: string) => void;
  getSubmissionById: (id: string) => SubmissionRecord | undefined;
  getUserSubmissions: (phoneOrEmailOrId?: string) => SubmissionRecord[];
  resetToDefaults: () => void;
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set, get) => ({
      submissions: SEED_SUBMISSIONS,

      createSubmission: (input: CreateSubmissionInput) => {
        const timestamp = new Date();
        const randCode = Math.floor(1000 + Math.random() * 9000);
        const yyyymm = `${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, "0")}`;
        const newId = `SUB-${yyyymm}-${randCode}`;

        const formattedLinks: SubmissionItemLink[] = input.links.map(
          (l, idx) => ({
            id: `LINK-${randCode}-${idx + 1}`,
            url: l.url.trim(),
            domain: extractDomain(l.url),
            userNotes: l.userNotes?.trim() || "",
            status: "PENDING",
            isChecked: false,
          }),
        );

        const newRecord: SubmissionRecord = {
          id: newId,
          createdAt: timestamp.toISOString(),
          updatedAt: timestamp.toISOString(),
          userId: input.userId,
          userName: input.userName.trim() || "Pelanggan FLYPICK",
          userPhone: input.userPhone.trim(),
          userEmail: input.userEmail?.trim() || "",
          warehouseCode: input.warehouseCode || `FP-SH-${randCode}`,
          links: formattedLinks,
          status: "PENDING_REVIEW",
          notifications: [],
        };

        set((state) => ({
          submissions: [newRecord, ...state.submissions],
        }));

        return newRecord;
      },

      updateLinkReview: (submissionId, linkId, updates) => {
        set((state) => ({
          submissions: state.submissions.map((sub) => {
            if (sub.id !== submissionId) return sub;

            const updatedLinks = sub.links.map((link) => {
              if (link.id !== linkId) return link;
              const nextPriceCny = updates.priceCny ?? link.priceCny;
              const nextPriceIdr =
                updates.priceIdr ??
                (nextPriceCny !== undefined
                  ? Math.round(nextPriceCny * BRANDING.exchangeRate.cnyToIdr)
                  : link.priceIdr);

              return {
                ...link,
                ...updates,
                priceCny: nextPriceCny,
                priceIdr: nextPriceIdr,
              };
            });

            return {
              ...sub,
              links: updatedLinks,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      markSubmissionAsReviewed: (
        submissionId,
        reviewerName = "Admin FLYPICK",
        overallNotes,
      ) => {
        set((state) => ({
          submissions: state.submissions.map((sub) => {
            if (sub.id !== submissionId) return sub;

            // Automatically mark all links as checked if marking entire submission as reviewed
            const linksMarked = sub.links.map((l) => ({
              ...l,
              isChecked: true,
              status:
                l.status === "PENDING" ? ("AVAILABLE" as const) : l.status,
            }));

            return {
              ...sub,
              status: "REVIEWED",
              reviewedAt: new Date().toISOString(),
              reviewerName,
              overallAdminNotes: overallNotes ?? sub.overallAdminNotes,
              links: linksMarked,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      notifyUser: (submissionId, channels, message) => {
        const notifId = `NOTIF-${Date.now().toString().slice(-6)}`;
        const now = new Date().toISOString();

        let createdNotif: NotificationLog = {
          id: notifId,
          sentAt: now,
          channels,
          message,
        };

        set((state) => ({
          submissions: state.submissions.map((sub) => {
            if (sub.id !== submissionId) return sub;

            createdNotif = {
              id: notifId,
              sentAt: now,
              channels,
              message,
              recipientPhone: sub.userPhone,
              recipientEmail: sub.userEmail,
            };

            return {
              ...sub,
              status: "NOTIFIED",
              updatedAt: now,
              notifications: [createdNotif, ...sub.notifications],
            };
          }),
        }));

        return createdNotif;
      },

      deleteSubmission: (submissionId) => {
        set((state) => ({
          submissions: state.submissions.filter((s) => s.id !== submissionId),
        }));
      },

      getSubmissionById: (id) => {
        return get().submissions.find((s) => s.id === id);
      },

      getUserSubmissions: (phoneOrEmailOrId) => {
        if (!phoneOrEmailOrId) return [];
        const query = phoneOrEmailOrId.toLowerCase().trim();
        return get().submissions.filter(
          (s) =>
            s.userId === phoneOrEmailOrId ||
            s.userPhone.replace(/\D/g, "").includes(query.replace(/\D/g, "")) ||
            (s.userEmail && s.userEmail.toLowerCase().includes(query)) ||
            (s.warehouseCode && s.warehouseCode.toLowerCase() === query),
        );
      },

      resetToDefaults: () => {
        set({ submissions: SEED_SUBMISSIONS });
      },
    }),
    {
      name: "flypick-submissions-store",
    },
  ),
);
