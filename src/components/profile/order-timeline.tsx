import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Package,
  Plane,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Barcode } from "@/components/ui/barcode";
import { formatIdr } from "@/lib/utils";
import type { OrderRecord } from "@/types";
import { TrackingStepper } from "./tracking-stepper";

interface OrderTimelineProps {
  orders: OrderRecord[];
}

export function OrderTimeline({ orders }: OrderTimelineProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null,
  );

  if (orders.length === 0) {
    return (
      <div className="bg-white border-2 border-[#1A1A24] p-8 text-center space-y-3">
        <Package className="w-10 h-10 text-[#1A1A24]/40 mx-auto" />
        <p className="font-mono text-sm font-bold uppercase text-[#1A1A24]">
          Belum Ada Riwayat Pesanan
        </p>
        <p className="text-xs text-[#1A1A24]/70">
          Buat pesanan pertama Anda melalui Intake Hub atau keranjang
          konsolidasi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;

        return (
          <div
            key={order.id}
            className="bg-white border-2 border-[#1A1A24] shadow-[5px_5px_0px_0px_#2323FF] overflow-hidden"
          >
            {/* Boarding Header Banner */}
            <div className="bg-[#1A1A24] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2323FF]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#2323FF] border border-[#00F0FF] flex items-center justify-center font-mono font-black text-xs text-[#FFF8E1]">
                  CARGO
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00F0FF]">
                      NO RESI: {order.trackingCode}
                    </span>
                    <Badge variant="yellow">{order.serviceType}</Badge>
                  </div>
                  <p className="font-mono text-[11px] text-white/70">
                    ID Tiket: {order.id} | Dibuat:{" "}
                    {order.createdAt.substring(0, 10)}
                  </p>
                </div>
              </div>

              {/* Status pill & toggle */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2323FF] text-[#FFF8E1] font-mono text-xs font-bold uppercase border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                  {order.currentStage.replace(/_/g, " ")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedOrderId(isExpanded ? null : order.id)
                  }
                  className="text-white hover:text-[#00F0FF] p-1 border border-white/20 hover:border-[#00F0FF] transition-all cursor-pointer"
                  aria-label="Lihat detail pesanan"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Flight Route Summary Bar */}
            <div className="bg-[#FFF8E1] px-4 py-3 border-b-2 border-dashed border-[#1A1A24]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2323FF]">SHANGHAI (PVG)</span>
                <Plane className="w-3.5 h-3.5 text-[#1A1A24]" />
                <span className="font-bold text-[#2323FF]">JAKARTA (CGK)</span>
                <span className="text-[#1A1A24]/60">
                  via{" "}
                  {order.shippingMethod === "AIR_EXPRESS"
                    ? "AIR FREIGHT (7-10H)"
                    : "SEA FREIGHT (20-28H)"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#1A1A24]/70">
                  Invoice Tahap 1:{" "}
                  <strong className="text-[#1A1A24]">
                    {formatIdr(order.stage1Amount)}
                  </strong>
                </span>
                <span className="text-[#1A1A24]/70">
                  Est. Tahap 2:{" "}
                  <strong className="text-[#2323FF]">
                    {formatIdr(order.stage2EstimatedAmount)}
                  </strong>
                </span>
              </div>
            </div>

            {/* 7-Stage Operational Stepper & Mock QC Unboxing */}
            <div className="p-4 sm:p-6 bg-[#F9F7F1]/50 border-b-2 border-dashed border-[#1A1A24]/20">
              <TrackingStepper order={order} />
            </div>

            {/* Detailed Timeline Events View */}
            <div className="p-5 sm:p-6 space-y-6">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2323FF]" />
                LOG DETAIL AKTIVITAS MANIFEST LOGISTIK
              </h4>

              {/* Vertical timeline steps */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1A1A24]/20">
                {order.timeline.map((event, index) => {
                  const isCurrent = event.isCurrent;
                  const isDone = event.isCompleted;

                  return (
                    <div
                      key={event.title + event.timestamp}
                      className="relative flex items-start gap-4"
                    >
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-none border-2 flex items-center justify-center font-mono text-[10px] font-bold ${
                          isDone
                            ? "bg-[#2323FF] text-white border-[#1A1A24]"
                            : isCurrent
                              ? "bg-[#00F0FF] text-[#1A1A24] border-[#1A1A24] ring-4 ring-[#00F0FF]/30"
                              : "bg-white text-[#1A1A24]/40 border-[#1A1A24]/40"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 p-3 border-2 transition-all ${
                          isCurrent
                            ? "bg-[#FFF8E1] border-[#2323FF] shadow-[2px_2px_0px_0px_#2323FF]"
                            : "bg-white border-[#1A1A24]/20"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <p className="font-mono text-xs font-bold uppercase text-[#1A1A24]">
                            {event.title}
                          </p>
                          <span className="font-mono text-[10px] text-[#1A1A24]/60">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#1A1A24]/80 font-sans">
                          {event.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-[#2323FF]">
                          <MapPin className="w-3 h-3" />
                          <span>Lokasi: {event.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Collapsible Details: Items list & Destination */}
              {isExpanded && (
                <div className="pt-4 border-t-2 border-dashed border-[#1A1A24]/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Item list */}
                    <div className="space-y-2">
                      <p className="font-mono text-xs font-bold uppercase text-[#1A1A24]">
                        Daftar Paket Terkonsolidasi ({order.items.length} item):
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 bg-[#FFF8E1] border border-[#1A1A24] font-mono text-xs flex justify-between items-center"
                          >
                            <div>
                              <p className="font-bold text-[#1A1A24]">
                                {item.serviceType === "BUY_FOR_ME"
                                  ? item.productName
                                  : item.description}
                              </p>
                              <span className="text-[10px] text-[#1A1A24]/60">
                                {item.serviceType} x {item.quantity} pcs
                              </span>
                            </div>
                            <span className="font-bold text-[#2323FF]">
                              {item.serviceType === "BUY_FOR_ME"
                                ? formatIdr(item.priceIdr * item.quantity)
                                : "Forwarding"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery address */}
                    <div className="space-y-2">
                      <p className="font-mono text-xs font-bold uppercase text-[#1A1A24]">
                        Alamat Pengiriman Tujuan:
                      </p>
                      <div className="p-3 bg-white border border-[#1A1A24] text-xs font-sans space-y-1">
                        <p className="font-bold font-mono text-[#1A1A24]">
                          {order.deliveryAddress.recipientName} (
                          {order.deliveryAddress.phone})
                        </p>
                        <p className="text-[#1A1A24]/80">
                          {order.deliveryAddress.streetAddress}
                        </p>
                        <p className="text-[#1A1A24]/80 font-mono text-[11px]">
                          {order.deliveryAddress.district},{" "}
                          {order.deliveryAddress.city},{" "}
                          {order.deliveryAddress.province}{" "}
                          {order.deliveryAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Barcode Footer */}
            <div className="bg-white px-5 py-3 border-t border-[#1A1A24]/20 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#1A1A24]/60">
                PVG-CGK EXPRESS MANIFEST SEAL
              </span>
              <Barcode value={order.trackingCode} height={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
