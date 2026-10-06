import type * as React from "react";
import { cn } from "@/lib/utils";

export interface TicketCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "cream";
  borderVariant?: "neon" | "charcoal";
}

export function TicketCard({
  className,
  children,
  variant = "white",
  borderVariant = "neon",
  ...props
}: TicketCardProps) {
  return (
    <div
      className={cn(
        "relative border-2 transition-all",
        variant === "white" ? "bg-white" : "bg-[#FFF8E1]",
        borderVariant === "neon"
          ? "border-[#2323FF] shadow-[5px_5px_0px_0px_#1A1A24]"
          : "border-[#1A1A24] shadow-[4px_4px_0px_0px_#2323FF]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TicketPerforatedDivider({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "relative w-px border-r-2 border-dashed border-[#1A1A24]/30 my-2",
          className,
        )}
      >
        {/* Top & Bottom Notch Cutouts */}
        <div className="absolute -top-3 -right-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
        <div className="absolute -bottom-3 -right-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-px border-b-2 border-dashed border-[#1A1A24]/30 my-4 mx-2",
        className,
      )}
    >
      {/* Left & Right Notch Cutouts */}
      <div className="absolute -left-4 -top-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
      <div className="absolute -right-4 -top-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
    </div>
  );
}
