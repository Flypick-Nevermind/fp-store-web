import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BRANDING } from "@/config/branding";
import type {
  AddOns,
  CartItem,
  CheckoutStep,
  DeliveryAddress,
  OrderRecord,
  PaymentStatus,
  QcInspectionData,
  ShippingMethod,
  TimelineEvent,
} from "@/types";

interface CheckoutState {
  activeStep: CheckoutStep;
  shippingMethod: ShippingMethod;
  addOns: AddOns;
  paymentStatus: PaymentStatus;
  deliveryAddress: DeliveryAddress;
  orders: OrderRecord[];
  currentOrderId: string | null;

  // Actions
  setActiveStep: (step: CheckoutStep) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setAddOns: (addOns: Partial<AddOns>) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  createOrder: (items: CartItem[], stage1Amount: number) => OrderRecord;
  payStage2: (orderId: string) => void;
  getOrderById: (id: string) => OrderRecord | undefined;
}

const DEFAULT_ADDRESS: DeliveryAddress = {
  recipientName: "Ahmad Fikri",
  phone: "+6281299887766",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  district: "Tebet",
  postalCode: "12810",
  streetAddress: "Jl. Tebet Timur Dalam Raya No. 42B, RT 04 / RW 07",
};

const DEFAULT_ADDONS: AddOns = {
  photoQc: true,
  extraBubbleWrap: true,
};

const MOCK_QC_DATA: QcInspectionData = {
  photoUrls: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
  ],
  weightKg: 1.15,
  dimensionsCm: "32 x 24 x 12 cm",
  inspectedAt: "05 Okt 2026, 11:20 CST (Shanghai Hub)",
  inspectorName: "Officer Wang Lin (PVG-QC-07)",
  qcNotes:
    "Barang dibuka & dicek di meja inspeksi B3. Jahitan rapi, resleting berfungsi halus, warna olive green sesuai gambar merchant Taobao. Diberi segel label FLYPICK dan bubble wrap 3 lapis.",
  isApproved: true,
  checklist: {
    labelMatch: true,
    colorMatch: true,
    boxIntact: true,
    quantityMatch: true,
  },
};

const INITIAL_MOCK_ORDER: OrderRecord = {
  id: "FP-ORD-882190",
  trackingCode: "FP-CGK-771290",
  createdAt: "2026-10-04T09:30:00Z",
  serviceType: "CONSOLIDATED",
  items: [
    {
      id: "FP-DEMO-01",
      serviceType: "BUY_FOR_ME",
      sourceUrl: "https://detail.tmall.com/item.htm?id=68192019",
      productName: "Minimalist Canvas Tote Bag Japanese Design",
      priceCny: 128.0,
      exchangeRate: 2250,
      priceIdr: 288000,
      selectedVariant: { color: "Ecru Off-White", size: "Large" },
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
    },
  ],
  deliveryAddress: DEFAULT_ADDRESS,
  shippingMethod: "AIR_EXPRESS",
  addOns: { photoQc: true, extraBubbleWrap: true },
  stage1Amount: 313000,
  stage1PaymentStatus: "PAID",
  stage2EstimatedAmount: 189750, // 1.15kg * 165000
  stage2ActualAmount: 189750,
  stage2PaymentStatus: "PENDING", // Ready to be paid by user in Screen 4!
  currentStage: "IN_TRANSIT_PVG_CGK",
  qcData: MOCK_QC_DATA,
  timeline: [
    {
      stage: "ORDER_PLACED",
      title: "Order Placed (Pesanan Dibuat)",
      description:
        "Tiket pesanan dan pembayaran Tahap 1 terkonfirmasi di sistem FLYPICK.",
      timestamp: "04 Okt 2026, 09:30 WIB",
      location: "FLYPICK Intake Cloud",
      isCompleted: true,
    },
    {
      stage: "PURCHASED_INBOUND",
      title: "Purchased / Inbound (Dalam Pembelian Merchant)",
      description:
        "Pesanan telah dicheckout ke merchant Taobao. Paket dalam perjalanan kurir domestik China ke Shanghai.",
      timestamp: "04 Okt 2026, 14:15 WIB",
      location: "Hangzhou / Domestic China",
      isCompleted: true,
    },
    {
      stage: "ARRIVED_CHINA_HUB",
      title: "Arrived at China Hub (Tiba di Gudang Shanghai)",
      description:
        "Paket diterima di Pudong FTZ Hub (PVG-01). Penimbangan aktual: 1.15 kg. Photo QC unboxing selesai. Invoice Tahap 2 diterbitkan.",
      timestamp: "05 Okt 2026, 11:20 WIB",
      location: "Shanghai Pudong Hub (PVG-01)",
      isCompleted: true,
    },
    {
      stage: "IN_TRANSIT_PVG_CGK",
      title: "In Transit PVG ➔ CGK (Penerbangan Kargo Udara)",
      description:
        "Paket telah dimuat ke penerbangan kargo Boeing 777F rute Shanghai (PVG) ke Jakarta (CGK). Menunggu pelunasan Tahap 2 untuk rilis langsung ke kurir.",
      timestamp: "06 Okt 2026, 03:15 WIB",
      location: "Airspace Cargo Flight",
      isCompleted: false,
      isCurrent: true,
    },
    {
      stage: "CUSTOMS_CLEARANCE",
      title: "Customs Clearance (Proses Bea Cukai Indonesia)",
      description:
        "Pemeriksaan dokumen impor kargo resmi & pelunasan pajak bea cukai di Bandara Soekarno-Hatta.",
      timestamp: "Est. 07 Okt 2026",
      location: "Soekarno-Hatta Int'l Airport (CGK)",
      isCompleted: false,
    },
    {
      stage: "DISPATCHED",
      title: "Dispatched (Pengiriman Domestik Terjadwal)",
      description:
        "Paket diserahkan ke kurir ekspedisi lokal untuk diantar ke alamat rumah penerima.",
      timestamp: "Est. 08 Okt 2026",
      location: "Jakarta Sorting Center",
      isCompleted: false,
    },
    {
      stage: "DELIVERED",
      title: "Delivered (Diterima Sobat FLYPICK)",
      description:
        "Paket berhasil sampai dan diserahterimakan di alamat tujuan Tebet, Jakarta Selatan.",
      timestamp: "Est. 09 Okt 2026",
      location: "Alamat Penerima",
      isCompleted: false,
    },
  ],
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      activeStep: "CHECKOUT",
      shippingMethod: "AIR_EXPRESS",
      addOns: DEFAULT_ADDONS,
      paymentStatus: "IDLE",
      deliveryAddress: DEFAULT_ADDRESS,
      orders: [INITIAL_MOCK_ORDER],
      currentOrderId: INITIAL_MOCK_ORDER.id,

      setActiveStep: (step) => set({ activeStep: step }),
      setShippingMethod: (shippingMethod) => set({ shippingMethod }),
      setAddOns: (addOns) =>
        set((state) => ({ addOns: { ...state.addOns, ...addOns } })),
      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),

      createOrder: (items, stage1Amount) => {
        const orderId = `FP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        const trackingCode = `FP-CGK-${Math.floor(100000 + Math.random() * 900000)}`;
        const state = get();

        const hasBuyForMe = items.some((i) => i.serviceType === "BUY_FOR_ME");
        const hasForwarding = items.some((i) => i.serviceType === "FORWARDING");
        const serviceType =
          hasBuyForMe && hasForwarding
            ? "CONSOLIDATED"
            : hasBuyForMe
              ? "BUY_FOR_ME"
              : "FORWARDING";

        const now = new Date();
        const dateStr = now.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const timeline: TimelineEvent[] = [
          {
            stage: "ORDER_PLACED",
            title: "Order Placed (Pesanan Dibuat)",
            description: `Tiket konsolidasi ${orderId} diterbitkan. Pembayaran Tahap 1 terverifikasi.`,
            timestamp: `${dateStr} WIB`,
            location: "FLYPICK Intake Cloud",
            isCompleted: true,
            isCurrent: true,
          },
          {
            stage: "PURCHASED_INBOUND",
            title: "Purchased / Inbound (Dalam Pembelian Merchant)",
            description:
              "Tim buyer Shanghai menghubungi seller dan memproses pembelian barang.",
            timestamp: "Dalam Antrean",
            location: "China Domestic Lane",
            isCompleted: false,
          },
          {
            stage: "ARRIVED_CHINA_HUB",
            title: "Arrived at China Hub (Tiba di Gudang Shanghai)",
            description:
              "Barang tiba di Shanghai Hub (PVG-01). Inspeksi unboxing Photo QC & penimbangan aktual.",
            timestamp: "Menunggu Kedatangan",
            location: "Shanghai Pudong Hub (PVG-01)",
            isCompleted: false,
          },
          {
            stage: "IN_TRANSIT_PVG_CGK",
            title: "In Transit PVG ➔ CGK (Penerbangan Kargo Udara)",
            description:
              state.shippingMethod === "AIR_EXPRESS"
                ? "Penerbangan kargo internasional rute Shanghai (PVG) ke Jakarta (CGK)."
                : "Pelayaran kapal kontainer rute Pelabuhan Shanghai ke Tanjung Priok.",
            timestamp: "Menunggu Jadwal Terbang",
            location: "Air / Maritime Freight Route",
            isCompleted: false,
          },
          {
            stage: "CUSTOMS_CLEARANCE",
            title: "Customs Clearance (Proses Bea Cukai Indonesia)",
            description:
              "Proses clearance impor resmi, pembayaran PPN/PPH, dan rilis SPPB kargo.",
            timestamp: "Menunggu Kedatangan CGK",
            location: "Jakarta Gateway (CGK-01)",
            isCompleted: false,
          },
          {
            stage: "DISPATCHED",
            title: "Dispatched (Pengiriman Domestik)",
            description: `Kargo dioper ke ekspedisi lokal untuk penjemputan rute ${state.deliveryAddress.city}.`,
            timestamp: "Menunggu Rilis Kargo",
            location: "Jakarta Hub",
            isCompleted: false,
          },
          {
            stage: "DELIVERED",
            title: "Delivered (Diterima Sobat FLYPICK)",
            description: `Paket tiba dengan aman di alamat ${state.deliveryAddress.streetAddress}.`,
            timestamp: "Estimasi Pengantaran",
            location: state.deliveryAddress.city,
            isCompleted: false,
          },
        ];

        const rate =
          state.shippingMethod === "AIR_EXPRESS"
            ? BRANDING.shippingRates.airExpress.ratePerKg
            : BRANDING.shippingRates.seaEconomy.ratePerKg;

        const stage2Estimated = Math.round(rate * 1.5);

        const newOrder: OrderRecord = {
          id: orderId,
          trackingCode,
          createdAt: now.toISOString(),
          serviceType,
          items,
          deliveryAddress: state.deliveryAddress,
          shippingMethod: state.shippingMethod,
          addOns: state.addOns,
          stage1Amount,
          stage1PaymentStatus: "PAID",
          stage2EstimatedAmount: stage2Estimated,
          stage2ActualAmount: stage2Estimated,
          stage2PaymentStatus: "PENDING",
          currentStage: "ORDER_PLACED",
          timeline,
          qcData: state.addOns.photoQc ? MOCK_QC_DATA : undefined,
        };

        set((s) => ({
          orders: [newOrder, ...s.orders],
          currentOrderId: orderId,
          activeStep: "SUCCESS",
          paymentStatus: "PAID",
        }));

        return newOrder;
      },

      payStage2: (orderId: string) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            return {
              ...order,
              stage2PaymentStatus: "PAID",
              stage2PaidAt: `${dateStr} WIB`,
              timeline: order.timeline.map((event) => {
                if (event.stage === "CUSTOMS_CLEARANCE") {
                  return {
                    ...event,
                    description:
                      "Pelunasan Tahap 2 diterima. Dokumen SPPB kargo rilis dari bea cukai Bandara CGK.",
                    isCompleted: true,
                  };
                }
                return event;
              }),
            };
          }),
        }));
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },
    }),
    {
      name: "flypick-checkout-storage",
    },
  ),
);
