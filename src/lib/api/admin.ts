import { apiClient } from "@/lib/api-client";
import type {
  AdminCartCreationSummary,
  AdminUpdateCartPayload,
  CartWithImagesItem,
  OrderWithDetails,
  VerifyOrderPaymentPayload,
} from "@/types/api";

/**
 * Admin: Fetch all pending link submissions (cart creations)
 * Calls GET /api/v1/admin/cart/creations (with fallback to /api/v1/cart/creations)
 */
export async function getAdminCartCreationsApi(
  token?: string,
): Promise<AdminCartCreationSummary[]> {
  try {
    return await apiClient<AdminCartCreationSummary[]>(
      "/api/v1/admin/cart/creations",
      {
        method: "GET",
        token,
      },
    );
  } catch {
    return apiClient<AdminCartCreationSummary[]>("/api/v1/cart/creations", {
      method: "GET",
      token,
    });
  }
}

/**
 * Admin: Update product details, CNY price, title, and availability status for a cart item
 * Calls PUT /api/v1/admin/cart/:cartId (with fallback to PATCH /api/v1/carts/:cartId)
 */
export async function updateAdminCartItemApi(
  cartId: string,
  payload: AdminUpdateCartPayload,
  token?: string,
): Promise<CartWithImagesItem> {
  try {
    return await apiClient<CartWithImagesItem>(`/api/v1/admin/cart/${cartId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      token,
    });
  } catch {
    return apiClient<CartWithImagesItem>(`/api/v1/carts/${cartId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    });
  }
}

/**
 * Admin: Update status of a cart creation batch (e.g. from ON_PROGRESS to REVIEWED)
 * Calls PATCH /api/v1/admin/cart/creations/:creationId/status
 */
export async function updateAdminCartCreationStatusApi(
  creationId: string,
  status: "ON_PROGRESS" | "REVIEWED" | "COMPLETED" | string,
  token?: string,
): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(
    `/api/v1/admin/cart/creations/${creationId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
      token,
    },
  );
}

/**
 * Finance Admin: Verify and approve order payment transfer receipt
 * Calls PATCH /api/v1/admin/orders/:orderId/verify-payment
 */
export async function verifyOrderPaymentAdminApi(
  orderId: string,
  payload: VerifyOrderPaymentPayload,
  token?: string,
): Promise<OrderWithDetails> {
  return apiClient<OrderWithDetails>(
    `/api/v1/admin/orders/${orderId}/verify-payment`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      token,
    },
  );
}
