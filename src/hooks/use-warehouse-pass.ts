"use client";

import { useState } from "react";
import { BRANDING } from "@/config/branding";
import { useToast } from "@/providers/toast-provider";
import { useAuthStore } from "@/store/use-auth-store";

export function useWarehousePass() {
  const user = useAuthStore((s) => s.user);
  const { success } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const warehouse = user?.addressChina || {
    recipientName: `Ahmad Fikri [${BRANDING.defaultWarehouseCode}]`,
    phone: BRANDING.warehouse.shanghai.phone,
    province: BRANDING.warehouse.shanghai.province,
    city: BRANDING.warehouse.shanghai.city,
    district: BRANDING.warehouse.shanghai.district,
    streetAddress: `${BRANDING.warehouse.shanghai.streetAddress} (User ID: ${BRANDING.defaultWarehouseCode})`,
    postalCode: BRANDING.warehouse.shanghai.postalCode,
    hubCode: BRANDING.warehouse.shanghai.hubCode,
  };

  const fullAddressText = `收件人 (Nama): ${warehouse.recipientName}
电话 (Telepon): ${warehouse.phone}
省市区 (Provinsi/Kota/Distrik): ${warehouse.province} ${warehouse.city} ${warehouse.district}
详细地址 (Alamat Lengkap): ${warehouse.streetAddress}
邮政编码 (Kode Pos): ${warehouse.postalCode}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    success("Berhasil Disalin!", `${label} disalin ke clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return {
    user,
    warehouse,
    copiedField,
    fullAddressText,
    copyToClipboard,
  };
}
