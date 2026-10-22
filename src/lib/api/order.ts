import { resolveCartImageUrl } from "@/lib/api/cart";
import { apiClient } from "@/lib/api-client";
import type {
  CartItem,
  DeliveryAddress,
  OrderOperationalStage,
  OrderRecord,
  ShippingMethod,
  StagePaymentStatus,
  TimelineEvent,
} from "@/types";
import type {
  CheckoutRequest,
  CheckoutResponseData,
  OrderWithDetails,
  VerifyOrderPaymentPayload,
} from "@/types/api";

/**
 * Checkout selected cart items into an order
 * Calls POST /api/v1/orders/checkout
 */
export async function checkoutOrderApi(
  payload: CheckoutRequest,
  token?: string,
): Promise<CheckoutResponseData> {
  return apiClient<CheckoutResponseData>("/api/v1/orders/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

/**
 * Get order details by order ID
 * Calls GET /api/v1/orders/:id
 */
export async function getOrderDetailApi(
  orderId: string,
  token?: string,
): Promise<OrderWithDetails> {
  return apiClient<OrderWithDetails>(`/api/v1/orders/${orderId}`, {
    method: "GET",
    token,
  });
}

/**
 * Get all orders for a specific user
 * Calls GET /api/v1/orders/user/:user_id
 */
export async function getUserOrdersApi(
  userId: string,
  token?: string,
): Promise<OrderWithDetails[]> {
  return apiClient<OrderWithDetails[]>(`/api/v1/orders/user/${userId}`, {
    method: "GET",
    token,
  });
}

/**
 * Finance Admin: Verify customer payment transfer receipt
 * Calls PATCH /api/v1/admin/orders/:id/verify-payment
 */
export async function verifyOrderPaymentApi(
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

/**
 * Map backend order payload to frontend OrderRecord format for timeline & tracking views
 */
export function mapBackendOrderToOrderRecord(
  order: OrderWithDetails,
): OrderRecord {
  const statusUpper = (order.order_status || "").toUpperCase();
  const paymentStatusUpper = (order.payment_status || "").toUpperCase();

  const isPaid =
    paymentStatusUpper === "PAID" || statusUpper !== "WAITING_PAYMENT";
  const stage1PaymentStatus: StagePaymentStatus = isPaid ? "PAID" : "PENDING";

  let currentStage: OrderOperationalStage = "ORDER_PLACED";
  if (statusUpper === "PAID") {
    currentStage = "PURCHASED_INBOUND";
  } else if (statusUpper === "PROCESSING") {
    currentStage = "ARRIVED_CHINA_HUB";
  } else if (statusUpper === "SHIPPED") {
    currentStage = "IN_TRANSIT_PVG_CGK";
  } else if (statusUpper === "DELIVERED" || statusUpper === "COMPLETED") {
    currentStage = "DELIVERED";
  }

  const stageOrder: OrderOperationalStage[] = [
    "ORDER_PLACED",
    "PURCHASED_INBOUND",
    "ARRIVED_CHINA_HUB",
    "IN_TRANSIT_PVG_CGK",
    "CUSTOMS_CLEARANCE",
    "DISPATCHED",
    "DELIVERED",
  ];

  const currentStageIdx = stageOrder.indexOf(currentStage);

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Baru saja";

  const timeline: TimelineEvent[] = [
    {
      stage: "ORDER_PLACED",
      title: isPaid
        ? "Pesanan Dibuat (Pembayaran Terverifikasi)"
        : "Pesanan Dibuat (Menunggu Verifikasi Admin)",
      description: isPaid
        ? `Nomor Order ${order.order_number} telah diverifikasi lunas. Data pesanan siap diteruskan ke tim pembelian Shanghai.`
        : `Nomor Order ${order.order_number} telah dibuat. Menunggu verifikasi mutasi struk pembayaran oleh Finance Admin.`,
      timestamp: `${formattedDate} WIB`,
      location: "FLYPICK Intake Cloud",
      isCompleted: isPaid,
      isCurrent: !isPaid,
    },
    {
      stage: "PURCHASED_INBOUND",
      title: "Purchased / Inbound (Dalam Pembelian Merchant)",
      description:
        "Tim buyer Shanghai menghubungi seller dan memproses pembelian barang ke gudang hub.",
      timestamp:
        currentStageIdx >= 1 ? "Diproses" : "Menunggu Verifikasi Pembayaran",
      location: "China Domestic Lane",
      isCompleted: currentStageIdx >= 1,
      isCurrent: currentStageIdx === 1,
    },
    {
      stage: "ARRIVED_CHINA_HUB",
      title: "Arrived at China Hub (Tiba di Gudang Shanghai)",
      description:
        "Barang tiba di Shanghai Hub (PVG-01). Dilakukan unboxing, penimbangan aktual, dan Photo QC.",
      timestamp:
        currentStageIdx >= 2 ? "Selesai Inspeksi" : "Menunggu Kedatangan",
      location: "Shanghai Pudong Hub (PVG-01)",
      isCompleted: currentStageIdx >= 2,
      isCurrent: currentStageIdx === 2,
    },
    {
      stage: "IN_TRANSIT_PVG_CGK",
      title: "In Transit PVG ➔ CGK (Penerbangan Kargo Udara)",
      description:
        "Paket dimuat ke penerbangan kargo internasional rute Shanghai (PVG) ke Bandara Soekarno-Hatta (CGK).",
      timestamp:
        currentStageIdx >= 3 ? "Sedang Terbang" : "Menunggu Jadwal Penerbangan",
      location: "Air Cargo Lane",
      isCompleted: currentStageIdx >= 3,
      isCurrent: currentStageIdx === 3,
    },
    {
      stage: "CUSTOMS_CLEARANCE",
      title: "Customs Clearance (Proses Bea Cukai Indonesia)",
      description:
        "Pemeriksaan dokumen impor resmi & kepabeanan kargo di Bandara Soekarno-Hatta.",
      timestamp:
        currentStageIdx >= 4 ? "Selesai Clearance" : "Menunggu Kedatangan CGK",
      location: "Jakarta Gateway (CGK-01)",
      isCompleted: currentStageIdx >= 4,
      isCurrent: currentStageIdx === 4,
    },
    {
      stage: "DISPATCHED",
      title: "Dispatched (Pengiriman Domestik Terjadwal)",
      description: `Paket diserahkan ke kurir lokal untuk diantar ke alamat ${order.shipping_city || "tujuan"}.`,
      timestamp:
        currentStageIdx >= 5 ? "Dalam Pengantaran" : "Menunggu Rilis Kargo",
      location: "Jakarta Sorting Center",
      isCompleted: currentStageIdx >= 5,
      isCurrent: currentStageIdx === 5,
    },
    {
      stage: "DELIVERED",
      title: "Delivered (Diterima Sobat FLYPICK)",
      description: `Paket telah diterima dengan aman di alamat tujuan ${order.shipping_address}.`,
      timestamp: currentStageIdx >= 6 ? "Terkirim" : "Estimasi Pengantaran",
      location: order.shipping_city || "Alamat Penerima",
      isCompleted: currentStageIdx >= 6,
      isCurrent: currentStageIdx === 6,
    },
  ];

  const items: CartItem[] = (order.items || []).map((detail) => ({
    id: detail.order_detail_id || detail.cart_id,
    cartId: detail.cart_id,
    serviceType: "BUY_FOR_ME",
    sourceUrl: detail.product_url,
    productName: detail.product_title || "Produk Import Marketplace China",
    priceCny: 0,
    exchangeRate: 2350,
    priceIdr: detail.product_price,
    selectedVariant: {
      color: "Default",
      size: "Standard",
    },
    quantity: detail.quantity || 1,
    imageUrl: resolveCartImageUrl(detail.product_image),
    notes: detail.notes,
  }));

  const deliveryAddress: DeliveryAddress = {
    recipientName: order.recipient_name || "Penerima",
    phone: order.recipient_phone || "",
    streetAddress: order.shipping_address || "",
    city: order.shipping_city || "",
    province: "Indonesia",
    district: "",
    postalCode: order.shipping_postal_code || "",
  };

  // Determine shipping method dynamically
  let shippingMethod: ShippingMethod = "AIR_EXPRESS";
  const rawShipType = (order.shipping_service_type || "").toUpperCase();
  if (rawShipType.includes("HANDCARRY")) {
    shippingMethod = "HANDCARRY";
  } else if (rawShipType.includes("SEA")) {
    shippingMethod = "SEA_ECONOMY";
  }

  return {
    id: order.order_number || order.order_id,
    trackingCode: order.order_number,
    createdAt: order.created_at,
    serviceType: "BUY_FOR_ME",
    items,
    deliveryAddress,
    shippingMethod,
    addOns: { photoQc: true, extraBubbleWrap: true },
    stage1Amount: order.total_amount,
    stage1PaymentStatus,
    stage2EstimatedAmount: 0,
    stage2ActualAmount: 0,
    stage2PaymentStatus: isPaid ? "PAID" : "PENDING",
    currentStage,
    timeline,
    paymentProofUrl: order.payment_proof_url ? resolveCartImageUrl(order.payment_proof_url) : undefined,
    actualWeightKg: order.actual_weight_kg,
    airWaybillNo: order.air_waybill_no,
    domesticCourier: order.domestic_courier,
    domesticTrackingNo: order.domestic_tracking_no,
  };
}
