import {
  CheckCircle2,
  PackageCheck,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Warehouse,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import type { OrderOperationalStage, OrderRecord } from "@/types";
import { QcUnboxingCard } from "./qc-unboxing-card";

interface TrackingStepperProps {
  order: OrderRecord;
}

interface StageStepConfig {
  stage: OrderOperationalStage;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

const OPERATIONAL_STAGES: StageStepConfig[] = [
  {
    stage: "ORDER_PLACED",
    label: "Order Placed",
    subLabel: "Tahap 1 Lunas",
    icon: PackageCheck,
  },
  {
    stage: "PURCHASED_INBOUND",
    label: "Purchased/Inbound",
    subLabel: "Merchant Taobao",
    icon: ShoppingBag,
  },
  {
    stage: "ARRIVED_CHINA_HUB",
    label: "Arrived at China Hub",
    subLabel: "Shanghai PVG-01",
    icon: Warehouse,
  },
  {
    stage: "IN_TRANSIT_PVG_CGK",
    label: "In Transit PVG➔CGK",
    subLabel: "Flight Cargo",
    icon: Plane,
  },
  {
    stage: "CUSTOMS_CLEARANCE",
    label: "Customs Clearance",
    subLabel: "Bandara CGK",
    icon: ShieldCheck,
  },
  {
    stage: "DISPATCHED",
    label: "Dispatched",
    subLabel: "Kurir Domestik",
    icon: Truck,
  },
  {
    stage: "DELIVERED",
    label: "Delivered",
    subLabel: "Sampai Rumah",
    icon: CheckCircle2,
  },
];

const STAGE_ORDER: Record<OrderOperationalStage, number> = {
  ORDER_PLACED: 1,
  PURCHASED_INBOUND: 2,
  ARRIVED_CHINA_HUB: 3,
  IN_TRANSIT_PVG_CGK: 4,
  CUSTOMS_CLEARANCE: 5,
  DISPATCHED: 6,
  DELIVERED: 7,
};

export function TrackingStepper({ order }: TrackingStepperProps) {
  const currentStageRank = STAGE_ORDER[order.currentStage] || 4;

  // Show QC unboxing photo card when order has reached or passed China Hub (rank >= 3)
  const hasArrivedAtChinaHub = currentStageRank >= 3;

  return (
    <div className="space-y-6">
      {/* 7-Stage Stepper Header */}
      <div className="bg-white border-2 border-[#1A1A24] p-4 sm:p-5 shadow-[3px_3px_0px_0px_#1A1A24]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A24]/10 mb-4">
          <span className="font-mono text-xs font-bold uppercase text-[#2323FF]">
            7-STAGE CROSS-BORDER CARGO PROGRESS
          </span>
          <Badge variant="electric">
            STATUS: {order.currentStage.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Stepper Grid (Horizontal on desktop, scrollable/wrapped) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {OPERATIONAL_STAGES.map((stepConfig, index) => {
            const stepRank = STAGE_ORDER[stepConfig.stage];
            const isCompleted = stepRank < currentStageRank;
            const isCurrent = stepRank === currentStageRank;
            const Icon = stepConfig.icon;

            return (
              <div
                key={stepConfig.stage}
                className={`relative p-3 border-2 transition-all flex flex-col justify-between ${
                  isCurrent
                    ? "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24] shadow-[3px_3px_0px_0px_#00F0FF]"
                    : isCompleted
                      ? "bg-[#FFF8E1] border-[#1A1A24] text-[#1A1A24]"
                      : "bg-white border-[#1A1A24]/30 text-[#1A1A24]/50"
                }`}
              >
                {/* Top Number & Icon */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-[10px] font-black w-5 h-5 flex items-center justify-center border ${
                      isCurrent
                        ? "bg-[#00F0FF] text-[#1A1A24] border-[#1A1A24]"
                        : isCompleted
                          ? "bg-[#2323FF] text-white border-[#1A1A24]"
                          : "bg-white text-[#1A1A24]/50 border-[#1A1A24]/30"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? "text-[#00F0FF] animate-pulse"
                        : isCompleted
                          ? "text-[#2323FF]"
                          : "text-[#1A1A24]/40"
                    }`}
                  />
                </div>

                {/* Stage Title */}
                <div>
                  <p
                    className={`font-mono text-[11px] font-bold uppercase leading-tight ${
                      isCurrent ? "text-white" : "text-[#1A1A24]"
                    }`}
                  >
                    {stepConfig.label}
                  </p>
                  <p
                    className={`font-sans text-[10px] mt-0.5 truncate ${
                      isCurrent ? "text-[#00F0FF]" : "text-[#1A1A24]/60"
                    }`}
                  >
                    {stepConfig.subLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock QC Unboxing Photo Card when state is "Arrived at China Hub" or beyond */}
      {hasArrivedAtChinaHub && order.qcData && (
        <QcUnboxingCard qcData={order.qcData} orderId={order.id} />
      )}
    </div>
  );
}
