import { z } from "zod";
import { phoneRegex } from "./auth";

export const DeliveryAddressSchema = z.object({
  recipientName: z.string().min(2, "Nama penerima minimal 2 karakter"),
  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(16, "Nomor HP maksimal 16 digit")
    .regex(
      phoneRegex,
      "Format nomor harus diawali +62 (contoh: +6281234567890)",
    ),
  province: z.string().min(2, "Provinsi wajib diisi"),
  city: z.string().min(2, "Kota/Kabupaten wajib diisi"),
  district: z.string().min(2, "Kecamatan wajib diisi"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Kode pos harus 5 digit angka"),
  streetAddress: z.string().min(8, "Alamat lengkap minimal 8 karakter"),
});

export const ShippingMethodEnum = z.enum(["AIR_EXPRESS", "SEA_ECONOMY"]);

export const AddOnsSchema = z.object({
  photoQc: z.boolean().default(false),
  extraBubbleWrap: z.boolean().default(false),
});

export const CheckoutSchema = z.object({
  deliveryAddress: DeliveryAddressSchema,
  shippingMethod: ShippingMethodEnum,
  addOns: AddOnsSchema,
  notes: z.string().optional(),
});

export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>;
export type ShippingMethod = z.infer<typeof ShippingMethodEnum>;
export type AddOns = z.infer<typeof AddOnsSchema>;
export type CheckoutFormValues = z.infer<typeof CheckoutSchema>;
