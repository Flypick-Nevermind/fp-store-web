import { Badge } from "@/components/atoms";

export function HowItWorksSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2 mb-10">
        <Badge variant="neon">CARGO FLIGHT ROUTE</Badge>
        <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-[#1A1A24]">
          Cara Kerja Konsolidasi FLYPICK
        </h2>
        <p className="text-xs sm:text-sm text-[#1A1A24]/75 max-w-xl mx-auto">
          Sistem 2 tahap yang adil: bayar barang terlebih dahulu, ongkir
          internasional dibayar setelah paket ditimbang riil di Shanghai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="bg-white border-2 border-[#1A1A24] shadow-[4px_4px_0px_0px_#2323FF] p-6 space-y-3 relative">
          <div className="w-8 h-8 bg-[#2323FF] text-white font-mono font-black text-sm flex items-center justify-center border border-[#1A1A24]">
            01
          </div>
          <h3 className="font-mono text-base font-bold uppercase text-[#1A1A24]">
            1. Pilih / Input Barang
          </h3>
          <p className="text-xs text-[#1A1A24]/80 leading-relaxed font-sans">
            Tempel link produk dari Taobao/1688 atau masukkan resi pengiriman
            seller China Anda ke sistem FLYPICK.
          </p>
          <div className="pt-2 font-mono text-[10px] text-[#2323FF] font-bold">
            ✓ Tagihan Tahap 1: Talangan Barang + Handling
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border-2 border-[#1A1A24] shadow-[4px_4px_0px_0px_#2323FF] p-6 space-y-3 relative">
          <div className="w-8 h-8 bg-[#00F0FF] text-[#1A1A24] font-mono font-black text-sm flex items-center justify-center border border-[#1A1A24]">
            02
          </div>
          <h3 className="font-mono text-base font-bold uppercase text-[#1A1A24]">
            2. Inspeksi di Shanghai
          </h3>
          <p className="text-xs text-[#1A1A24]/80 leading-relaxed font-sans">
            Paket diterima di Pudong Hub. Kami lakukan Photo QC gratis,
            penimbangan akurat, dan repacking aman.
          </p>
          <div className="pt-2 font-mono text-[10px] text-[#00F0FF] font-bold text-[#1A1A24]">
            ✓ Bebas Redline &amp; Asuransi Kargo
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border-2 border-[#1A1A24] shadow-[4px_4px_0px_0px_#2323FF] p-6 space-y-3 relative">
          <div className="w-8 h-8 bg-[#FF5E1E] text-white font-mono font-black text-sm flex items-center justify-center border border-[#1A1A24]">
            03
          </div>
          <h3 className="font-mono text-base font-bold uppercase text-[#1A1A24]">
            3. Terbang &amp; Sampai Rumah
          </h3>
          <p className="text-xs text-[#1A1A24]/80 leading-relaxed font-sans">
            Paket diberangkatkan dengan Air Express (7-10 hari) atau Sea
            Freight, lalu dikirim kurir lokal ke depan pintu Anda.
          </p>
          <div className="pt-2 font-mono text-[10px] text-[#FF5E1E] font-bold">
            ✓ Tagihan Tahap 2: Ongkir Riil per Kilogram
          </div>
        </div>
      </div>
    </section>
  );
}
