import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-sans font-bold text-xs transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-xl",
  {
    variants: {
      variant: {
        neon: "bg-[#1035D0] text-white hover:bg-[#0A2699] shadow-xs hover:shadow-sm",
        electric:
          "bg-[#1035D0] text-white hover:bg-[#0A2699] shadow-xs hover:shadow-md",
        paper:
          "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs",
        stamp:
          "bg-blue-50 text-[#1035D0] border border-dashed border-[#1035D0]/60 hover:bg-blue-100/60",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-xs sm:text-sm",
        lg: "h-12 px-6 text-sm sm:text-base",
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
