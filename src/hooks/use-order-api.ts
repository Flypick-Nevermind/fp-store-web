"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkoutOrderApi,
  getOrderDetailApi,
  getUserOrdersApi,
} from "@/lib/api/order";
import { useAuthStore } from "@/store/use-auth-store";
import type { CartItem, DeliveryAddress } from "@/types";
import type { CheckoutRequest } from "@/types/api";

/**
 * Extracts a clean UUID cart_id from a CartItem.
 * Strips any frontend prefix like "FP-BFM-".
 */
export function extractCleanCartId(item: CartItem): string {
  if (item.serviceType === "BUY_FOR_ME" && item.cartId) {
    return item.cartId.trim();
  }
  const clean = item.id.replace(/^FP-BFM-/, "").trim();
  return clean;
}

interface CheckoutMutationVariables {
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: "BANK_TRANSFER" | "QRIS" | "MANUAL" | string;
  paymentProofUrl?: string;
  shippingServiceType?: string;
  addOns?: {
    photoQc?: boolean;
    extraBubbleWrap?: boolean;
  };
  shippingNotes?: string;
  userId?: string;
}

/**
 * Hook to submit checkout to POST /api/v1/orders/checkout
 */
export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: async (vars: CheckoutMutationVariables) => {
      const activeUserId = vars.userId || currentUser?.id;

      if (!activeUserId) {
        throw new Error(
          "Silakan masuk ke akun Anda terlebih dahulu untuk menyelesaikan pesanan.",
        );
      }

      if (!vars.items || vars.items.length === 0) {
        throw new Error("Keranjang belanja Anda masih kosong.");
      }

      // Build items payload with clean cart_id UUID
      const checkoutItems = vars.items.map((item) => {
        const cleanCartId = extractCleanCartId(item);
        const packagingNote =
          item.packagingOption === "NO_BOX"
            ? "Opsi Kemasan: NO_BOX (Lepas kardus)"
            : "Opsi Kemasan: WITH_BOX (Kardus utuh)";

        const baseNote =
          item.serviceType === "BUY_FOR_ME" ? item.notes : item.description;

        const itemNote = baseNote
          ? `${packagingNote} • ${baseNote}`
          : packagingNote;

        return {
          cart_id: cleanCartId,
          quantity: item.quantity > 0 ? item.quantity : 1,
          notes: itemNote,
        };
      });

      // Construct detailed shipping address string
      const addr = vars.deliveryAddress;
      const fullStreet = addr.streetAddress || "";
      const district = addr.district ? `Kec. ${addr.district}` : "";
      const province = addr.province || "";
      const addressParts = [fullStreet, district, province].filter(Boolean);
      const fullShippingAddress = addressParts.join(", ");

      // Backwards-compatible shipping notes appending proof url and shipping method
      const metaTags = [
        vars.shippingNotes,
        vars.shippingServiceType
          ? `[METODE_PENGIRIMAN: ${vars.shippingServiceType}]`
          : "",
        vars.paymentProofUrl ? `[BUKTI_TRANSFER: ${vars.paymentProofUrl}]` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const payload: CheckoutRequest = {
        user_id: activeUserId,
        items: checkoutItems,
        shipping_address: {
          recipient_name: addr.recipientName.trim(),
          recipient_phone: addr.phone.trim(),
          shipping_address: fullShippingAddress,
          shipping_city: addr.city.trim(),
          shipping_postal_code: addr.postalCode?.trim() || undefined,
          shipping_notes: metaTags || undefined,
        },
        payment_method: vars.paymentMethod,
        payment_proof_url: vars.paymentProofUrl,
        shipping_service_type: vars.shippingServiceType,
        add_ons: vars.addOns
          ? {
              photo_qc: vars.addOns.photoQc,
              extra_bubble_wrap: vars.addOns.extraBubbleWrap,
            }
          : undefined,
      };

      const result = await checkoutOrderApi(payload, token || undefined);
      return result;
    },
    onSuccess: (_data, vars) => {
      const activeUserId = vars.userId || currentUser?.id;
      if (activeUserId) {
        queryClient.invalidateQueries({
          queryKey: ["user-orders", activeUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-carts", activeUserId],
        });
      }
    },
  });
}

/**
 * Hook to verify order payment by Finance Admin
 */
export function useVerifyOrderPaymentMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: async ({
      orderId,
      paymentStatus = "PAID",
      orderStatus = "PROCESSING",
      verificationNotes,
    }: {
      orderId: string;
      paymentStatus?: string;
      orderStatus?: string;
      verificationNotes?: string;
    }) => {
      const { verifyOrderPaymentApi } = await import("@/lib/api/order");
      return verifyOrderPaymentApi(
        orderId,
        {
          payment_status: paymentStatus,
          order_status: orderStatus,
          verification_notes: verificationNotes,
        },
        token || undefined,
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-orders"],
      });
      if (data?.order_id) {
        queryClient.invalidateQueries({
          queryKey: ["order-detail", data.order_id],
        });
      }
    },
  });
}

/**
 * Hook to fetch order history for a user from GET /api/v1/orders/user/:user_id
 */
export function useUserOrdersQuery(userId?: string) {
  const currentUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const activeUserId = userId || currentUser?.id;

  return useQuery({
    queryKey: ["user-orders", activeUserId],
    queryFn: async () => {
      if (!activeUserId) return [];
      return getUserOrdersApi(activeUserId, token || undefined);
    },
    enabled: !!activeUserId,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a single order's details by ID from GET /api/v1/orders/:id
 */
export function useOrderDetailQuery(orderId?: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID diperlukan.");
      return getOrderDetailApi(orderId, token || undefined);
    },
    enabled: !!orderId,
  });
}
