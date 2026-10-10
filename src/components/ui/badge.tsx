import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center font-sans text-[11px] font-bold tracking-normal px-2.5 py-0.5 border rounded-full select-none",
  {
    variants: {
      variant: {
        neon: "bg-blue-50 text-[#1035D0] border-blue-200",
        electric: "bg-blue-50 text-[#1035D0] border-blue-200",
        orange: "bg-orange-50 text-orange-700 border-orange-200",
        yellow: "bg-amber-50 text-amber-800 border-amber-200",
        paper: "bg-slate-50 text-slate-700 border-slate-200",
        stamp: "bg-blue-50/60 text-[#1035D0] border border-[#1035D0]/40",
        outline: "bg-transparent text-slate-600 border-slate-300",
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
