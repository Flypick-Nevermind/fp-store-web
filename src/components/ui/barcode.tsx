import { cn } from "@/lib/utils";

interface BarcodeProps {
  value?: string;
  className?: string;
  showText?: boolean;
  height?: number;
}

export function Barcode({
  value = "FP-PVG-CGK-2026",
  className,
  showText = true,
  height = 36,
}: BarcodeProps) {
  return (
    <div
      className={cn("inline-flex flex-col items-center select-none", className)}
    >
      <div
        className="w-full min-w-[120px] barcode-strip"
        style={{ height: `${height}px` }}
        aria-hidden="true"
      />
      {showText && (
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#1A1A24]/80 mt-1 uppercase">
          *{value}*
        </span>
      )}
    </div>
  );
}
