export const BRANDING = {
  name: "FLYPICK",
  tagline: "China-to-Indonesia Cross-Border Jastip & Freight Hub",
  shortCode: "FP",
  defaultWarehouseCode: "FP-8821",
  colors: {
    cream: "#FFF8E1",
    neonBlue: "#2323FF",
    electricBlue: "#00F0FF",
    darkCharcoal: "#1A1A24",
    surface: "#FFFFFF",
    tagOrange: "#FF5E1E",
    tagYellow: "#FFDE00",
    border: "#2323FF",
  },
  exchangeRate: {
    cnyToIdr: 2250,
    label: "¥1 CNY = Rp 2.250 IDR",
    updatedAt: "Live Interbank Rate",
  },
  shippingRates: {
    cargo: {
      name: "Tiket Jasa Cargo",
      ratePerKg: 165000,
      eta: "7-10 Hari Kerja",
      minWeightKg: 0.5,
      carrier: "FLYPICK Air & Sea Cargo Hub",
      badge: "CARGO FREIGHT",
      description:
        "Jalur kargo resmi Shanghai (PVG) ke Jakarta (CGK). Biaya ongkir ditimbang transparan di gudang Shanghai saat tiba (Invoice Tahap 2).",
    },
    handcarry: {
      name: "Tiket Jasa Handcarry",
      ratePerItem: 95000,
      eta: "3-5 Hari Kerja",
      carrier: "FLYPICK VIP Traveler Luggage",
      badge: "VIP HANDCARRY",
      description:
        "Dibawa langsung dalam bagasi kabin traveler VIP. Super cepat, bebas antre pelabuhan kargo, tarif all-in Rp 95.000/pcs langsung di Tahap 1.",
    },
    airExpress: {
      ratePerKg: 165000,
      eta: "7-10 Hari Kerja",
      minWeightKg: 0.5,
      carrier: "FLYPICK Air Flight Cargo",
      badge: "AIR FREIGHT",
    },
    seaEconomy: {
      ratePerKg: 45000,
      eta: "20-28 Hari Kerja",
      minWeightKg: 2,
      carrier: "FLYPICK Sea Container Liner",
      badge: "SEA CARGO",
    },
  },
  serviceFees: {
    handlingFeeIdr: 15000,
    photoQcIdr: 10000,
    extraBubbleWrapIdr: 12000,
  },
  warehouse: {
    shanghai: {
      hubCode: "PVG-SH-01",
      recipientName: "FLYPICK [Nama User / FP-8821]",
      phone: "+86 138 1827 9901",
      province: "Shanghai (上海市)",
      city: "Shanghai City (上海市)",
      district: "Pudong New Area (浦东新区)",
      streetAddress:
        "No. 888 Haigang Avenue, Free Trade Zone Logistics Park, Warehouse B3",
      postalCode: "201306",
    },
  },
  contacts: {
    whatsapp: "+6281299887766",
    instagram: "@flypick.id",
    email: "support@flypick.com",
  },
} as const;

export type BrandingConfig = typeof BRANDING;
