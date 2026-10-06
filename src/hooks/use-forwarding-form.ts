"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateId } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import {
  type CreateForwardingInput,
  CreateForwardingInputSchema,
} from "@/schemas/forwarding";
import { useCartStore } from "@/store/use-cart-store";

export const PRESET_TRACKINGS = [
  {
    code: "SF188290182991",
    category: "FASHION" as const,
    desc: "Sepatu Boots & Kardus Tambahan",
    courier: "SF Express (顺丰)",
  },
  {
    code: "YT98201948102",
    category: "ELECTRONICS" as const,
    desc: "Wireless Microphone Set 2.4G",
    courier: "Yuantong Express (圆通)",
  },
  {
    code: "JD0019283746",
    category: "BEAUTY" as const,
    desc: "Skincare Ampoule & Cushion Pack",
    courier: "JD Logistics (京东物流)",
  },
];

export function useForwardingForm() {
  const { success } = useToast();
  const addItem = useCartStore((s) => s.addItem);

  const form = useForm<CreateForwardingInput>({
    resolver: zodResolver(CreateForwardingInputSchema),
    defaultValues: {
      serviceType: "FORWARDING",
      chinaTrackingNumber: "",
      itemCategory: "FASHION",
      quantity: 1,
      declaredValueIdr: 250000,
      description: "",
      courierName: "",
    },
  });

  const { setValue, watch, reset } = form;
  const declaredValue = watch("declaredValueIdr") || 0;

  const handleApplyPreset = (preset: (typeof PRESET_TRACKINGS)[number]) => {
    setValue("chinaTrackingNumber", preset.code, { shouldValidate: true });
    setValue("itemCategory", preset.category, { shouldValidate: true });
    setValue("description", preset.desc, { shouldValidate: true });
    setValue("courierName", preset.courier, { shouldValidate: true });
  };

  const onSubmit = (values: CreateForwardingInput) => {
    const newItem = {
      ...values,
      id: generateId("FP-FWD"),
      chinaTrackingNumber: values.chinaTrackingNumber.toUpperCase().trim(),
    };

    addItem(newItem);
    success(
      "Tiket Titip Kirim Berhasil Dibuat!",
      `Resi ${newItem.chinaTrackingNumber} terdaftar di manifest kedatangan Shanghai.`,
    );

    reset({
      serviceType: "FORWARDING",
      chinaTrackingNumber: "",
      itemCategory: "FASHION",
      quantity: 1,
      declaredValueIdr: 0,
      description: "",
      courierName: "",
    });
  };

  return {
    form,
    declaredValue,
    handleApplyPreset,
    onSubmit,
  };
}
