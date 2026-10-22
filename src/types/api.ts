export interface ApiResponse<T = unknown> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
  errors?:
    | Record<string, unknown>
    | Array<{ field: string; message: string; tag: string }>;
  timestamp?: string;
  request_id?: string;
}

export interface LoginPayload {
  user_email: string;
  user_password: string;
}

export interface LoginResponseData {
  access_token: string;
}

export interface RegisterPayload {
  user_name: string;
  user_email: string;
  user_password: string;
  user_phone: string;
}

export interface RegisterResponseData {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  created_at: string;
  updated_at: string;
}

export interface VerifyOtpPayload {
  user_email: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  user_id: string;
  user_name: string;
  is_active: boolean;
}

export interface ResendOtpPayload {
  user_email: string;
}

export interface ResendOtpResponseData {
  user_id: string;
  user_name: string;
}

export interface ResetPasswordPayload {
  user_email: string;
}

export interface ResetPasswordResponseData {
  user_email: string;
}

export interface ConfirmResetPasswordPayload {
  user_email: string;
  otp: string;
  new_password: string;
}

export interface ConfirmResetPasswordResponseData {
  user_id: string;
}

export interface ApiUserData {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_auth?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartImageItem {
  cart_id: string;
  cart_image_id: string;
  cart_image_value: string;
  created_at: string;
  updated_at: string;
}

export interface CartWithImagesItem {
  cart_id: string;
  cart_images: CartImageItem[];
  cart_price: string;
  cart_title: string;
  cart_url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_reject?: boolean;
  detail_notes?: string;
}

export interface CartLookupPayload {
  cart_url: string;
  user_id: string;
}

export interface CartLookupResponseData {
  cart_id: string;
  cart_images: CartImageItem[] | string[];
  cart_price: string;
  cart_title: string;
  cart_url: string;
}

export interface CartCheckItemPayload {
  url: string;
  notes?: string;
  detail_notes?: string;
}

export interface CartCheckPayload {
  user_id: string;
  items: CartCheckItemPayload[];
}

export interface CartCreationDetailWithCart {
  detail_id?: string;
  cart_id?: string;
  detail_notes?: string;
  is_reject?: boolean;
  created_at?: string;
  updated_at?: string;
  cart?: {
    cart_id: string;
    cart_price: string;
    cart_title: string;
    cart_url: string;
    user_id: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CartCreationResponseData {
  cart_creation_id: string;
  status: string; // e.g. "ON_PROGRESS"
  user_id: string;
  details?: CartCreationDetailWithCart[];
  created_at: string;
  updated_at: string;
}

// ── Order & Checkout API Types ────────────────────────────────────
export interface CheckoutItemRequest {
  cart_id: string;
  quantity: number;
  notes?: string;
}

export interface ShippingAddressRequest {
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  shipping_notes?: string;
}

export interface CheckoutRequest {
  user_id: string;
  items: CheckoutItemRequest[];
  shipping_address: ShippingAddressRequest;
  payment_method: "BANK_TRANSFER" | "QRIS" | "MANUAL" | string;
  payment_proof_url?: string;
  shipping_service_type?: "CARGO_AIR" | "CARGO_SEA" | "HANDCARRY_VIP" | string;
  add_ons?: {
    photo_qc?: boolean;
    extra_bubble_wrap?: boolean;
  };
}

export interface MsFlypickOrderDetail {
  order_detail_id: string;
  order_id: string;
  cart_id: string;
  product_url: string;
  product_title: string;
  product_price: number;
  product_image: string;
  quantity: number;
  notes: string;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface MsFlypickOrder {
  order_id: string;
  order_number: string;
  user_id: string;
  order_status:
    | "WAITING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED"
    | string;
  total_item_price: number;
  service_fee: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: "PENDING" | "PAID" | "FAILED" | string;
  payment_proof_url?: string;
  shipping_service_type?: string;
  actual_weight_kg?: number;
  air_waybill_no?: string;
  domestic_courier?: string;
  domestic_tracking_no?: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  shipping_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderWithDetails extends MsFlypickOrder {
  items: MsFlypickOrderDetail[];
}

export interface CheckoutResponseData {
  order: OrderWithDetails;
  payment_instructions?: string;
}

export interface UploadImageResponseData {
  url?: string;
  file_url?: string;
  media_key?: string;
  object_key?: string;
  key?: string;
}

export interface VerifyOrderPaymentPayload {
  payment_status: "PAID" | "REJECTED" | string;
  order_status?: "PROCESSING" | "CANCELLED" | string;
  verification_notes?: string;
}

export interface AdminUpdateCartPayload {
  cart_price?: string;
  cart_title?: string;
  cart_images?: string[];
  is_reject?: boolean;
  detail_notes?: string;
}

export interface AdminCartCreationSummary {
  cart_creation_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  status: "ON_PROGRESS" | "REVIEWED" | "COMPLETED" | string;
  details?: CartCreationDetailWithCart[];
  created_at: string;
  updated_at: string;
}
