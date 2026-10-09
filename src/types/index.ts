import type {
  AddOns,
  AuthInput,
  AuthPhoneInput,
  BuyForMeItem,
  CheckoutFormValues,
  DeliveryAddress,
  ForwardingCategory,
  ForwardingItem,
  ShippingMethod,
} from "@/schemas";

export type CartItem = BuyForMeItem | ForwardingItem;

export interface ChinaWarehouseAddress {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  streetAddress: string;
  postalCode: string;
  hubCode: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  warehouseCode: string; // e.g. 'FP-8821'
  addressChina: ChinaWarehouseAddress;
  createdAt: string;
}

// 7 operational stages: [Order Placed] -> [Purchased/Inbound] -> [Arrived at China Hub] -> [In Transit PVG➔CGK] -> [Customs Clearance] -> [Dispatched] -> [Delivered]
export type OrderOperationalStage =
  | "ORDER_PLACED"
  | "PURCHASED_INBOUND"
  | "ARRIVED_CHINA_HUB"
  | "IN_TRANSIT_PVG_CGK"
  | "CUSTOMS_CLEARANCE"
  | "DISPATCHED"
  | "DELIVERED";

export interface QcInspectionData {
  photoUrls: string[];
  weightKg: number;
  dimensionsCm: string;
  inspectedAt: string;
  inspectorName: string;
  qcNotes: string;
  isApproved: boolean;
  checklist: {
    labelMatch: boolean;
    colorMatch: boolean;
    boxIntact: boolean;
    quantityMatch: boolean;
  };
}

export interface TimelineEvent {
  stage: OrderOperationalStage;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export type StagePaymentStatus = "PENDING" | "PAID";

export interface OrderRecord {
  id: string; // Order reference, e.g. 'FP-ORD-882190'
  trackingCode: string;
  createdAt: string;
  serviceType: "BUY_FOR_ME" | "FORWARDING" | "CONSOLIDATED";
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  shippingMethod: ShippingMethod;
  addOns: AddOns;
  stage1Amount: number;
  stage1PaymentStatus: StagePaymentStatus;
  stage2EstimatedAmount: number;
  stage2ActualAmount: number;
  stage2PaymentStatus: StagePaymentStatus;
  stage2PaidAt?: string;
  currentStage: OrderOperationalStage;
  timeline: TimelineEvent[];
  qcData?: QcInspectionData;
}

export type CheckoutStep = "CART" | "CHECKOUT" | "PAYMENT" | "SUCCESS";
export type PaymentStatus = "IDLE" | "PROCESSING" | "PAID" | "FAILED";

export type {
  AddOns,
  AuthInput,
  AuthPhoneInput,
  BuyForMeItem,
  CheckoutFormValues,
  DeliveryAddress,
  ForwardingCategory,
  ForwardingItem,
  ShippingMethod,
};

export * from "./submission";
