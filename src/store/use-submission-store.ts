"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import { extractCartImageUrl, parsePrice } from "@/lib/api/cart";
import type { CartWithImagesItem } from "@/types/api";
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

const DUMMY_SUBMISSION_IDS = new Set([
  "SUB-202610-8912",
  "SUB-202610-7450",
  "SUB-202610-6104",
]);

const SEED_SUBMISSIONS: SubmissionRecord[] = [];

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
  syncWithServerCarts: (carts: CartWithImagesItem[]) => void;
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
          notificationPreference: input.notificationPreference || "WHATSAPP",
          links: formattedLinks,
          status: "PENDING_REVIEW",
          notifications: [],
          serverCartCreationId: input.serverCartCreationId,
          serverStatus: input.serverStatus,
          isServerSynced: input.isServerSynced ?? !!input.serverCartCreationId,
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

      syncWithServerCarts: (carts: CartWithImagesItem[]) => {
        if (!carts || carts.length === 0) return;

        set((state) => {
          let hasChanges = false;

          const normalizeUrl = (u: string) =>
            u
              .trim()
              .toLowerCase()
              .replace(/\/+$/, "")
              .replace(/^https?:\/\/(www\.)?/, "");

          const updatedSubmissions = state.submissions.map((sub) => {
            let subModified = false;
            let availableLinksCount = 0;

            const nextLinks = sub.links.map((link) => {
              const matchedCart = carts.find((c) => {
                const normCartUrl = normalizeUrl(c.cart_url || "");
                const normLinkUrl = normalizeUrl(link.url || "");
                return (
                  normCartUrl === normLinkUrl ||
                  (normCartUrl &&
                    normLinkUrl &&
                    (normCartUrl.includes(normLinkUrl) ||
                      normLinkUrl.includes(normCartUrl)))
                );
              });

              if (!matchedCart) {
                if (link.status === "AVAILABLE") availableLinksCount++;
                return link;
              }

              const { priceIdr, priceCny } = parsePrice(matchedCart.cart_price);
              const imageUrl = extractCartImageUrl(matchedCart.cart_images);
              const title = matchedCart.cart_title;
              const isValidated =
                priceCny > 0 ||
                (title && !title.includes("Marketplace China"));

              if (isValidated) {
                subModified = true;
                availableLinksCount++;
                return {
                  ...link,
                  status: "AVAILABLE" as const,
                  isChecked: true,
                  cartId: matchedCart.cart_id,
                  productName: title || link.productName,
                  priceCny: priceCny || link.priceCny,
                  priceIdr: priceIdr || link.priceIdr,
                  imageUrl: imageUrl || link.imageUrl,
                  adminNotes: title
                    ? `Terverifikasi Admin: ${title}`
                    : link.adminNotes,
                };
              }

              return link;
            });

            if (
              subModified ||
              (availableLinksCount > 0 && sub.status === "PENDING_REVIEW")
            ) {
              hasChanges = true;
              return {
                ...sub,
                links: nextLinks,
                status: "REVIEWED" as const,
                serverStatus: "DONE",
                isServerSynced: true,
                reviewedAt: sub.reviewedAt || new Date().toISOString(),
                reviewerName:
                  sub.reviewerName || "Admin FLYPICK (Terverifikasi Server)",
                updatedAt: new Date().toISOString(),
              };
            }

            return sub;
          });

          // Check if there are carts from server that don't match any local submission
          const allKnownUrls = new Set(
            updatedSubmissions.flatMap((s) =>
              s.links.map((l) => normalizeUrl(l.url)),
            ),
          );

          const unlinkedCarts = carts.filter(
            (c) => c.cart_url && !allKnownUrls.has(normalizeUrl(c.cart_url)),
          );

          if (unlinkedCarts.length > 0) {
            hasChanges = true;
            const newServerSub: SubmissionRecord = {
              id: `SUB-SRV-${unlinkedCarts[0].cart_id.slice(0, 8).toUpperCase()}`,
              createdAt:
                unlinkedCarts[0].created_at || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: unlinkedCarts[0].user_id,
              userName: "Pelanggan FLYPICK",
              userPhone: "",
              status: "REVIEWED",
              reviewedAt: new Date().toISOString(),
              reviewerName: "Admin FLYPICK (Sync Server)",
              isServerSynced: true,
              serverStatus: "DONE",
              notifications: [],
              links: unlinkedCarts.map((c, idx) => {
                const { priceIdr, priceCny } = parsePrice(c.cart_price);
                const imageUrl = extractCartImageUrl(c.cart_images);
                return {
                  id: `LINK-SRV-${c.cart_id.slice(0, 8)}-${idx + 1}`,
                  url: c.cart_url,
                  domain: extractDomain(c.cart_url),
                  cartId: c.cart_id,
                  productName: c.cart_title,
                  userNotes: "Pengecekan Akun Server",
                  status: "AVAILABLE",
                  adminNotes: c.cart_title
                    ? `Terverifikasi Admin: ${c.cart_title}`
                    : undefined,
                  priceCny,
                  priceIdr,
                  imageUrl,
                  isChecked: true,
                };
              }),
            };

            updatedSubmissions.unshift(newServerSub);
          }

          if (!hasChanges) return state;

          return {
            submissions: updatedSubmissions,
          };
        });
      },

      resetToDefaults: () => {
        set({ submissions: SEED_SUBMISSIONS });
      },
    }),
    {
      name: "flypick-submissions-store",
      merge: (persistedState: unknown, currentState: SubmissionState) => {
        const persisted = persistedState as
          | Partial<SubmissionState>
          | undefined;
        const rawSubs = Array.isArray(persisted?.submissions)
          ? persisted.submissions.filter((s) => !DUMMY_SUBMISSION_IDS.has(s.id))
          : [];
        return {
          ...currentState,
          submissions: rawSubs,
        };
      },
    },
  ),
);
