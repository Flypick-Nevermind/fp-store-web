import { Check, Copy } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

interface AddressCopyRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isCopied?: boolean;
  onCopy: () => void;
  fullWidth?: boolean;
}

export function AddressCopyRow({
  label,
  value,
  icon,
  isCopied,
  onCopy,
  fullWidth = false,
}: AddressCopyRowProps) {
  return (
    <div
      className={cn(
        "p-3 bg-white border-2 border-[#1A1A24]/30 hover:border-[#2323FF] transition-colors relative group",
        fullWidth && "md:col-span-2",
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] text-[#1A1A24]/60 uppercase flex items-center gap-1">
          {icon}
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="font-mono text-[10px] text-[#2323FF] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isCopied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          Salin
        </button>
      </div>
      <p className="font-mono text-xs font-bold text-[#1A1A24] select-all leading-relaxed">
        {value}
      </p>
    </div>
  );
}
