import Image from "next/image";
import { cn } from "@/lib/utils";

interface FlypickLogoIconProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export function FlypickLogoIcon({
  className,
  size = 36,
  priority = false,
}: FlypickLogoIconProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative shrink-0 flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <Image
        src="/assets/flypick-logo.png"
        alt="FLYPICK Logo"
        width={size * 2}
        height={size * 2}
        priority={priority}
        className="w-full h-full object-contain transition-transform"
      />
    </div>
  );
}
