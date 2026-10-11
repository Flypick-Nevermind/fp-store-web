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

const SEED_PRODUCT_REQUESTS: ProductRequestRecord[] = [
  {
    id: "REQ-202610-8812",
    createdAt: "2026-10-09T09:30:00.000Z",
    updatedAt: "2026-10-09T14:20:00.000Z",
    userName: "Budi Santoso",
    userPhone: "081288992211",
    userEmail: "budi.santoso@gmail.com",
    warehouseCode: "FP-SH-8821",
    notificationPreference: "BOTH",
    productName: "Mesin Heat Press Sablon DTF Portable 12x10 Inch",
    category: "Elektronik & Gadget",
    targetBudget: "Maksimal Rp 1.500.000 / unit",
    targetQuantity: "2 unit",
    specificationNotes:
      "Tegangan 220V cocok untuk listrik Indonesia. Layar sentuh digital temperatur & timer.",
    referenceLink:
      "https://shopee.co.id/search?keyword=heat%20press%20portable",
    status: "SOURCED",
    adminNotes:
      "Tim sourcing Shanghai telah menghubungi pabrik OEM di Zhejiang. Barang ready stock 220V standard colokan EU/Indo. Harga sangat hemat dibanding lokal.",
    sourcingResults: [
      {
        id: "SRC-8812-1",
        url: "https://detail.1688.com/offer/73291823901.html",
        title: "Pabrik Zhejiang EasyPress Portable 12x10 Inch 220V",
        platform: "1688",
        priceCny: 380,
        priceIdr: Math.round(380 * BRANDING.exchangeRate.cnyToIdr),
        minOrder: "1 unit",
        supplierName: "Zhejiang Printing Tech Co., Ltd.",
        notes: "Rating pabrik 4.9/5, garansi komponen seller 1 tahun.",
      },
    ],
  },
  {
    id: "REQ-202610-7734",
    createdAt: "2026-10-09T11:15:00.000Z",
    updatedAt: "2026-10-09T11:15:00.000Z",
    userName: "Siti Rahmawati",
    userPhone: "085712345678",
    userEmail: "siti.rahma@gmail.com",
    warehouseCode: "FP-SH-9142",
    notificationPreference: "WHATSAPP",
    productName: "Tumbler Termos Gradient Aesthetic 1000ml Stainless 316",
    category: "Peralatan Rumah Tangga",
    targetBudget: "Rp 35.000 / pcs",
    targetQuantity: "100 pcs (Grosir Reseller)",
    specificationNotes:
      "Warna pastel gradasi (Matcha Green, Lilac, Rose Cream). Material stainless steel 316 food grade, tahan dingin 24 jam.",
    status: "SOURCING_IN_PROGRESS",
    adminNotes:
      "Sedang negosiasi penawaran grosir MOQ 100 pcs langsung ke 2 pabrik termos di Yongkang.",
    sourcingResults: [],
  },
  {
    id: "REQ-202610-9102",
    createdAt: "2026-10-10T07:45:00.000Z",
    updatedAt: "2026-10-10T07:45:00.000Z",
    userName: "Hendro Wijaya",
    userPhone: "081900112233",
    userEmail: "hendro.w@yahoo.com",
    warehouseCode: "FP-SH-6320",
    notificationPreference: "WHATSAPP",
    productName: "Vintage Leather Varsity Jacket Washed Grey",
    category: "Fashion & Pakaian",
    targetBudget: "Maksimal ¥180",
    targetQuantity: "1 pcs (Size XL)",
    specificationNotes:
      "Bahan kulit sintetis washed matte, bordir patch dada tebal, inner furing satin.",
    status: "PENDING_SOURCING",
    adminNotes: "Menunggu giliran pengecekan kurator fashion China.",
    sourcingResults: [],
  },
];

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
    },
  ),
);
