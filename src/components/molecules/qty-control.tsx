import { Minus, Plus } from "lucide-react";

interface QtyControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QtyControl({
  quantity,
  onIncrease,
  onDecrease,
}: QtyControlProps) {
  return (
    <div className="flex items-center border-2 border-[#1A1A24] bg-white select-none">
      <button
        type="button"
        onClick={onDecrease}
        className="p-1.5 hover:bg-[#FFF8E1] text-[#1A1A24] transition-colors cursor-pointer"
        aria-label="Kurangi kuantitas"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="font-mono font-bold text-xs px-3 min-w-[28px] text-center">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="p-1.5 hover:bg-[#FFF8E1] text-[#1A1A24] transition-colors cursor-pointer"
        aria-label="Tambah kuantitas"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
