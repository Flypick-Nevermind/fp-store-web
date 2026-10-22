"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type {
  CreateProductRequestInput,
  ProductCategory,
  ProductRequestRecord,
  ProductRequestStatus,
  SourcingResultItem,
} from "@/types/product-request";

const DUMMY_REQUEST_IDS = new Set([
  "REQ-202610-8812",
  "REQ-202610-7734",
  "REQ-202610-9102",
]);

const SEED_PRODUCT_REQUESTS: ProductRequestRecord[] = [];

interface ProductRequestState {
  requests: ProductRequestRecord[];

  // Actions
  createProductRequest: (
    input: CreateProductRequestInput,
  ) => ProductRequestRecord;
  updateRequestStatus: (
    id: string,
    status: ProductRequestStatus,
    adminNotes?: string,
    sourcingResults?: SourcingResultItem[],
  ) => void;
  addSourcingResult: (
    requestId: string,
    result: Omit<SourcingResultItem, "id" | "priceIdr"> & { priceIdr?: number },
  ) => void;
  deleteProductRequest: (id: string) => void;
  getRequestById: (id: string) => ProductRequestRecord | undefined;
  getUserRequests: (phoneOrEmailOrId?: string) => ProductRequestRecord[];
  resetToDefaults: () => void;
}

export const useProductRequestStore = create<ProductRequestState>()(
  persist(
    (set, get) => ({
      requests: SEED_PRODUCT_REQUESTS,

      createProductRequest: (input: CreateProductRequestInput) => {
        const timestamp = new Date();
        const randCode = Math.floor(1000 + Math.random() * 9000);
        const yyyymm = `${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, "0")}`;
        const newId = `REQ-${yyyymm}-${randCode}`;

        const newRecord: ProductRequestRecord = {
          id: newId,
          createdAt: timestamp.toISOString(),
          updatedAt: timestamp.toISOString(),
          userId: input.userId,
          userName: input.userName.trim() || "Pelanggan FLYPICK",
          userPhone: input.userPhone.trim(),
          userEmail: input.userEmail?.trim() || "",
          warehouseCode: input.warehouseCode || `FP-SH-${randCode}`,
          notificationPreference: input.notificationPreference || "WHATSAPP",
          productName: input.productName.trim(),
          category: input.category || "Lainnya",
          referenceImage: input.referenceImage,
          targetBudget: input.targetBudget?.trim() || "",
          targetQuantity: input.targetQuantity?.trim() || "",
          specificationNotes: input.specificationNotes?.trim() || "",
          referenceLink: input.referenceLink?.trim() || "",
          status: "PENDING_SOURCING",
          sourcingResults: [],
        };

        set((state) => ({
          requests: [newRecord, ...state.requests],
        }));

        return newRecord;
      },

      updateRequestStatus: (id, status, adminNotes, sourcingResults) => {
        set((state) => ({
          requests: state.requests.map((req) => {
            if (req.id !== id) return req;
            return {
              ...req,
              status,
              adminNotes: adminNotes ?? req.adminNotes,
              sourcingResults: sourcingResults ?? req.sourcingResults,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addSourcingResult: (requestId, result) => {
        const resultId = `SRC-${Date.now().toString().slice(-6)}`;
        const priceIdr =
          result.priceIdr ||
          Math.round(result.priceCny * BRANDING.exchangeRate.cnyToIdr);

        const newItem: SourcingResultItem = {
          id: resultId,
          url: result.url,
          title: result.title,
          platform: result.platform,
          priceCny: result.priceCny,
          priceIdr,
          minOrder: result.minOrder,
          supplierName: result.supplierName,
          notes: result.notes,
        };

        set((state) => ({
          requests: state.requests.map((req) => {
            if (req.id !== requestId) return req;
            return {
              ...req,
              status: "SOURCED",
              sourcingResults: [...req.sourcingResults, newItem],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteProductRequest: (id) => {
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }));
      },

      getRequestById: (id) => {
        return get().requests.find((r) => r.id === id);
      },

      getUserRequests: (phoneOrEmailOrId) => {
        if (!phoneOrEmailOrId) return [];
        const query = phoneOrEmailOrId.toLowerCase().trim();
        return get().requests.filter(
          (r) =>
            r.userId === phoneOrEmailOrId ||
            r.userPhone.replace(/\D/g, "").includes(query.replace(/\D/g, "")) ||
            (r.userEmail && r.userEmail.toLowerCase().includes(query)) ||
            (r.warehouseCode && r.warehouseCode.toLowerCase() === query),
        );
      },

      resetToDefaults: () => {
        set({ requests: SEED_PRODUCT_REQUESTS });
      },
    }),
    {
      name: "flypick-product-requests-store",
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as
          | { requests?: ProductRequestRecord[] }
          | undefined;
        if (!persisted) return currentState;
        const cleanRequests = Array.isArray(persisted.requests)
          ? persisted.requests.filter(
              (r) => r && !DUMMY_REQUEST_IDS.has(r.id),
            )
          : [];
        return {
          ...currentState,
          requests: cleanRequests,
        };
      },
    },
  ),
);
