import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full px-3 py-2.5 bg-white border-2 font-mono text-xs focus:outline-none focus:border-[#2323FF] transition-all",
          error
            ? "border-red-600 focus:border-red-600"
            : "border-[#1A1A24] focus:ring-1 focus:ring-[#2323FF]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export function FormLabel({
  children,
  required,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]",
        className,
      )}
    >
      {children} {required && <span className="text-red-600">*</span>}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="font-mono text-[11px] text-red-600 mt-1">{message}</p>;
}
