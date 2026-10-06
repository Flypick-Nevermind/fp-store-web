import { z } from "zod";

export const ForwardingCategoryEnum = z.enum([
  "FASHION",
  "BEAUTY",
  "ELECTRONICS",
  "ACCESSORIES",
  "OTHER",
]);

// China domestic tracking number regex (min 5 uppercase alphanumeric chars, e.g., SF1234567, YT998877, JD0001)
export const chinaTrackingNumberRegex = /^[A-Z0-9]{5,35}$/;

export const ForwardingItemSchema = z.object({
  id: z.string().min(1, "ID item diperlukan"),
  serviceType: z.literal("FORWARDING"),
  chinaTrackingNumber: z
    .string()
    .min(5, "Nomor resi China minimal 5 karakter")
    .max(35, "Nomor resi China maksimal 35 karakter")
    .regex(
      chinaTrackingNumberRegex,
      "Format resi harus huruf kapital dan angka tanpa spasi (misal: SF12389028, YT992100)",
    ),
  itemCategory: ForwardingCategoryEnum,
  quantity: z.number().int().min(1, "Jumlah paket minimal 1"),
  declaredValueIdr: z.number().min(0, "Nilai deklarasi minimal Rp 0"),
  description: z.string().min(3, "Deskripsi isi paket minimal 3 karakter"),
  courierName: z.string().optional(),
});

export const CreateForwardingInputSchema = ForwardingItemSchema.omit({
  id: true,
}).extend({
  id: z.string().optional(),
});

export type ForwardingCategory = z.infer<typeof ForwardingCategoryEnum>;
export type ForwardingItem = z.infer<typeof ForwardingItemSchema>;
export type CreateForwardingInput = z.infer<typeof CreateForwardingInputSchema>;
