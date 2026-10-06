import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider text-xs transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        neon: "bg-[#2323FF] text-[#FFF8E1] border-2 border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24] hover:bg-[#1a1aff] hover:shadow-[4px_4px_0px_0px_#1A1A24]",
        electric:
          "bg-[#00F0FF] text-[#1A1A24] border-2 border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24] hover:bg-[#33f3ff] hover:shadow-[4px_4px_0px_0px_#1A1A24]",
        paper:
          "bg-white text-[#1A1A24] border-2 border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24] hover:bg-[#FFF8E1] hover:border-[#2323FF]",
        stamp:
          "bg-transparent text-[#2323FF] border-2 border-dashed border-[#2323FF] hover:bg-[#2323FF]/10",
        danger:
          "bg-red-600 text-white border-2 border-[#1A1A24] shadow-[3px_3px_0px_0px_#1A1A24] hover:bg-red-700",
        ghost:
          "bg-transparent text-[#1A1A24] hover:bg-[#1A1A24]/10 border border-transparent",
      },
      size: {
        sm: "h-8 px-3 text-[11px]",
        md: "h-10 px-4 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "neon",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
