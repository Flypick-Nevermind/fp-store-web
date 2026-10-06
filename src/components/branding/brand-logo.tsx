import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "monochrome" | "badge";
  showSubtitle?: boolean;
}

export function BrandLogo({
  className,
  variant = "default",
  showSubtitle = false,
}: BrandLogoProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
    >
      {/* Flight Cargo Icon Tag */}
      <div
        className={cn(
          "relative flex items-center justify-center w-10 h-10 border-2 font-mono font-black text-sm tracking-tighter transition-transform hover:scale-105",
          variant === "default"
            ? "bg-[#2323FF] text-[#FFF8E1] border-[#1A1A24] shadow-[2px_2px_0px_0px_#1A1A24]"
            : "bg-[#1A1A24] text-white border-[#1A1A24]",
        )}
      >
        <span className="relative z-10 flex items-center">
          <Plane className="w-5 h-5 -rotate-45 text-[#00F0FF]" />
        </span>
        {/* Tiny tag notch corner */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFF8E1] border-b border-l border-[#1A1A24] rotate-45" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 font-mono font-black tracking-tight leading-none text-xl text-[#1A1A24]">
          <span className="text-[#2323FF]">FLY</span>
          <span>PICK</span>
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-0.5 text-[10px] font-bold bg-[#00F0FF] text-[#1A1A24] border border-[#1A1A24] rounded-none">
            +
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-mono tracking-widest text-[#1A1A24]/70 uppercase mt-0.5">
            CHINA ➔ INDO HUB
          </span>
        )}
      </div>
    </div>
  );
}
