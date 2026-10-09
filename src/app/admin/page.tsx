import type { Metadata } from "next";
import { AdminDashboardTemplate } from "@/components/templates/admin-dashboard-template";

export const metadata: Metadata = {
  title: "Admin Dashboard - Verifikasi Link & Notifikasi | FLYPICK",
  description:
    "Dashboard operasional admin FLYPICK untuk verifikasi link Taobao, 1688, Tmall dan pengiriman notifikasi ke pelanggan.",
};

export default function AdminPage() {
  return <AdminDashboardTemplate />;
}
