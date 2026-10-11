import type { NotificationPreference } from "./submission";

export type ProductRequestStatus =
  | "PENDING_SOURCING"
  | "SOURCING_IN_PROGRESS"
  | "SOURCED"
  | "UNAVAILABLE";

export type ProductCategory =
  | "Fashion & Pakaian"
  | "Sepatu & Sandal"
  | "Tas & Aksesoris"
  | "Elektronik & Gadget"
  | "Peralatan Rumah Tangga"
  | "Mainan & Hobi"
  | "Kecantikan & Kosmetik"
  | "Grosir Pabrik 1688"
  | "Lainnya";

export interface SourcingResultItem {
  id: string;
  url: string;
  title: string;
  platform: "1688" | "Taobao" | "Tmall" | "Pabrik Langsung";
  priceCny: number;
  priceIdr: number;
  minOrder?: string;
  supplierName?: string;
  notes?: string;
}

export interface ProductRequestRecord {
  id: string; // e.g. "REQ-202610-4821"
  createdAt: string;
  updatedAt: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  warehouseCode?: string;
  notificationPreference: NotificationPreference;
  productName: string;
  category: ProductCategory | string;
  referenceImage?: string; // Data URL or URL
  targetBudget?: string;
  targetQuantity?: string;
  specificationNotes?: string;
  referenceLink?: string; // Optional external reference (Shopee/TikTok/IG)
  status: ProductRequestStatus;
  adminNotes?: string;
  sourcingResults: SourcingResultItem[];
}

export interface CreateProductRequestInput {
  userName: string;
  userPhone: string;
  userEmail?: string;
  userId?: string;
  warehouseCode?: string;
  notificationPreference?: NotificationPreference;
  productName: string;
  category?: ProductCategory | string;
  referenceImage?: string;
  targetBudget?: string;
  targetQuantity?: string;
  specificationNotes?: string;
  referenceLink?: string;
}
