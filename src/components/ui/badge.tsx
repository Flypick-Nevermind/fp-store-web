import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border select-none",
  {
    variants: {
      variant: {
        neon: "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24]",
        electric: "bg-[#00F0FF] text-[#1A1A24] border-[#1A1A24]",
        orange: "bg-[#FF5E1E] text-white border-[#1A1A24]",
        yellow: "bg-[#FFDE00] text-[#1A1A24] border-[#1A1A24]",
        paper: "bg-white text-[#1A1A24] border-[#1A1A24]",
        stamp:
          "bg-transparent text-[#2323FF] border-2 border-[#2323FF] -rotate-2",
        outline: "bg-transparent text-[#1A1A24] border-[#1A1A24] border-dashed",
      },
    },
    defaultVariants: {
      variant: "neon",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
