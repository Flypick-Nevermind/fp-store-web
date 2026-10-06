import { z } from "zod";

// Regex allowing URLs from taobao.com, tmall.com, and 1688.com
export const chinaMarketplaceUrlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*(taobao\.com|tmall\.com|1688\.com)(\/.*)?$/i;

export const VariantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  skuId: z.string().optional(),
});

export const BuyForMeItemSchema = z.object({
  id: z.string().min(1, "ID item diperlukan"),
  serviceType: z.literal("BUY_FOR_ME"),
  sourceUrl: z
    .string()
    .url("Masukkan tautan URL yang valid")
    .regex(
      chinaMarketplaceUrlRegex,
      "Hanya mendukung tautan produk dari Taobao, Tmall, atau 1688",
    ),
  productName: z.string().min(3, "Nama barang minimal 3 karakter"),
  priceCny: z.number().positive("Harga CNY harus lebih dari 0"),
  exchangeRate: z.number(),
  priceIdr: z.number().nonnegative(),
  selectedVariant: VariantSchema,
  quantity: z.number().int().min(1, "Jumlah pesanan minimal 1"),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const CreateBuyForMeInputSchema = z.object({
  serviceType: z.literal("BUY_FOR_ME"),
  sourceUrl: z
    .string()
    .url("Masukkan tautan URL yang valid")
    .regex(
      chinaMarketplaceUrlRegex,
      "Hanya mendukung tautan produk dari Taobao, Tmall, atau 1688",
    ),
  productName: z.string().min(3, "Nama barang minimal 3 karakter"),
  priceCny: z.number().positive("Harga CNY harus lebih dari 0"),
  exchangeRate: z.number(),
  selectedVariant: VariantSchema,
  quantity: z.number().int().min(1, "Jumlah pesanan minimal 1"),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type Variant = z.infer<typeof VariantSchema>;
export type BuyForMeItem = z.infer<typeof BuyForMeItemSchema>;
export type CreateBuyForMeInput = z.infer<typeof CreateBuyForMeInputSchema>;
