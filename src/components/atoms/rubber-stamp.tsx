import type React from "react";
import { cn } from "@/lib/utils";

interface RubberStampProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "blue" | "charcoal" | "orange" | "cyan";
}

export function RubberStamp({
  children,
  className,
  color = "blue",
  ...props
}: RubberStampProps) {
  const colorMap = {
    blue: "text-[#2323FF] border-[#2323FF]",
    charcoal: "text-[#1A1A24] border-[#1A1A24]",
    orange: "text-[#FF5E1E] border-[#FF5E1E]",
    cyan: "text-[#00F0FF] border-[#00F0FF]",
  };

  return (
    <span
      className={cn(
        "rubber-stamp text-[11px] font-mono select-none bg-white/70",
        colorMap[color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
