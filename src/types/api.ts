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

export interface CartCheckPayload {
  user_id: string;
  url_links: string[];
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
