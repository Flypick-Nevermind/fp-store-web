"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIdr } from "@/lib/utils";
import type { OrderRecord } from "@/types";

interface Stage2PaymentCardProps {
  order: OrderRecord;
  onOpenPaymentModal?: () => void;
}

export function Stage2PaymentCard({ order }: Stage2PaymentCardProps) {
  const isPaid = order.stage1PaymentStatus === "PAID";

  const waMessage = encodeURIComponent(
    `Halo Admin Flypick, saya ingin konfirmasi pembayaran untuk pesanan:\n` +
      `• No. Order: ${order.id}\n` +
      `• Total: ${formatIdr(order.stage1Amount)}\n\n` +
      `Mohon dibantu cek mutasi rekeningnya. Terima kasih!`,
  );
  const waUrl = `https://api.whatsapp.com/send?phone=6281299887766&text=${waMessage}`;

  // 1. Pending Verification State (Manual Bank Transfer)
  if (!isPaid) {
    return (
      <div className="bg-gradient-to-r from-[#FFFBEB] to-white border-2 border-amber-300 p-4 sm:p-5 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase text-amber-900 tracking-wide">
                STATUS BIAYA: MENUNGGU VERIFIKASI ADMIN
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                PENDING VERIFIKASI
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Bukti transfer pembayaran manual Anda sedang dicocokkan dengan
              mutasi bank oleh Finance Admin Flypick. Setelah diverifikasi, barang
              akan langsung dibeli ke seller China.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Konfirmasi via WA</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Already Verified & Paid (All-In Guarantee)
  return (
    <div className="bg-gradient-to-r from-[#ECFDF5] to-white border-2 border-emerald-300 p-4 sm:p-5 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.04)] relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-emerald-800 tracking-wide">
              STATUS BIAYA: LUNAS ALL-IN (1X BAYAR)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              LUNAS / VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Seluruh biaya talangan produk, proteksi pengiriman, dan ongkir internasional
            telah lunas dibayar 1x di awal (Total:{" "}
            <strong className="font-mono text-emerald-700">
              {formatIdr(order.stage1Amount)}
            </strong>
            ). Tidak ada tagihan susulan saat barang tiba di Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl border border-emerald-400 bg-white font-mono text-xs font-black text-emerald-700 flex items-center gap-1 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ALL-IN PAID</span>
          </span>
        </div>
      </div>
    </div>
  );
}

