import { cn } from "@/lib/utils";
import { FlypickLogoIcon } from "./flypick-logo-icon";

interface BrandLogoProps {
  className?: string;
  iconSize?: number;
  showSubtitle?: boolean;
}

export function BrandLogo({
  className,
  iconSize = 34,
  showSubtitle = false,
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 select-none group cursor-pointer",
        className,
      )}
    >
      <FlypickLogoIcon
        size={iconSize}
        className="transition-transform group-hover:scale-105"
      />
      <div className="flex flex-col">
        <span className="font-sans font-black italic text-xl tracking-tight text-[#1035D0] leading-none">
          FLYPICK
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase mt-0.5">
            Cross-Border Logistics
          </span>
        )}
      </div>
    </div>
  );
}
