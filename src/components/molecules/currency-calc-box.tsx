import { Calculator } from "lucide-react";
import { formatIdr } from "@/lib/utils";

interface CurrencyCalcBoxProps {
  exchangeRate: number;
  totalPriceIdr: number;
  quantity: number;
}

export function CurrencyCalcBox({
  exchangeRate,
  totalPriceIdr,
  quantity,
}: CurrencyCalcBoxProps) {
  return (
    <div className="flex flex-col justify-center border-l-2 border-dashed border-[#1A1A24]/20 pl-4 space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-mono text-[#1A1A24]/70">
        <Calculator className="w-3.5 h-3.5 text-[#2323FF]" />
        <span>
          KURS TETAP: 1 CNY = Rp {exchangeRate.toLocaleString("id-ID")}
        </span>
      </div>
      <p className="font-mono text-lg font-black text-[#2323FF]">
        {formatIdr(totalPriceIdr)}
      </p>
      <p className="text-[10px] font-mono text-[#1A1A24]/60">
        Total harga talangan barang ({quantity} pcs)
      </p>
    </div>
  );
}
