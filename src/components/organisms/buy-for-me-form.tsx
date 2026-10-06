"use client";

import {
  AlertCircle,
  Link2,
  Loader2,
  PackagePlus,
  Sparkles,
} from "lucide-react";
import { Badge, Button, FormError, FormLabel } from "@/components/atoms";
import { CurrencyCalcBox } from "@/components/molecules";
import {
  PRESET_SAMPLE_LINKS,
  useBuyForMeForm,
} from "@/hooks/use-buy-for-me-form";
import { formatIdr } from "@/lib/utils";

export function BuyForMeForm() {
  const {
    form,
    scrapedPreview,
    isScraping,
    handleScrape,
    handleApplyPreset,
    onSubmit,
    exchangeRate,
    quantity,
    priceIdr,
    totalPriceIdr,
  } = useBuyForMeForm();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sample Quick Links */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FFF8E1] border-2 border-dashed border-[#2323FF]">
        <span className="font-mono text-[11px] font-bold text-[#2323FF] uppercase flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Uji Coba Tautan Sample:
        </span>
        {PRESET_SAMPLE_LINKS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handleApplyPreset(preset.url)}
            className="text-[11px] font-mono bg-white hover:bg-[#2323FF] hover:text-white px-2 py-0.5 border border-[#1A1A24] transition-colors cursor-pointer"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* URL Input with Scrape Button */}
      <div className="space-y-2">
        <FormLabel htmlFor="sourceUrlInput" required>
          1. TAUTAN PRODUK TIONGKOK (TAOBAO / TMALL / 1688)
        </FormLabel>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A24]/50">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              id="sourceUrlInput"
              type="url"
              placeholder="https://item.taobao.com/item.htm?id=..."
              {...register("sourceUrl")}
              className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF] focus:ring-1 focus:ring-[#2323FF] transition-all"
            />
          </div>
          <Button
            type="button"
            variant="electric"
            onClick={handleScrape}
            disabled={isScraping}
            className="shrink-0"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                MENGEKSTRAK...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                TARIK DATA OTOMATIS
              </>
            )}
          </Button>
        </div>
        {errors.sourceUrl && (
          <p className="font-mono text-[11px] text-red-600 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.sourceUrl.message}
          </p>
        )}
      </div>

      {/* Scraped Product Card Preview */}
      {scrapedPreview && (
        <div className="p-4 bg-white border-2 border-[#2323FF] shadow-[3px_3px_0px_0px_#2323FF] flex flex-col sm:flex-row gap-4 items-start animate-in fade-in">
          {scrapedPreview.imageUrl && (
            <img
              src={scrapedPreview.imageUrl}
              alt="Preview"
              className="w-24 h-24 object-cover border-2 border-[#1A1A24] shrink-0"
            />
          )}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="electric">DATA TERVERIFIKASI</Badge>
              <span className="font-mono text-[11px] text-[#1A1A24]/70">
                {scrapedPreview.sellerName}
              </span>
            </div>
            <p className="font-bold text-sm text-[#1A1A24]">
              {watch("productName")}
            </p>
            <p className="font-mono text-xs text-[#2323FF] font-bold">
              Harga Asli: ¥{watch("priceCny")} CNY ≈ {formatIdr(priceIdr)}
            </p>
          </div>
        </div>
      )}

      {/* Product Name & Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <FormLabel htmlFor="productNameInput" required>
            2. NAMA PRODUK
          </FormLabel>
          <input
            id="productNameInput"
            type="text"
            placeholder="Contoh: Jaket Varsity Vintage Fleece"
            {...register("productName")}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          <FormError message={errors.productName?.message} />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="quantityInput" required>
            JUMLAH (QTY)
          </FormLabel>
          <input
            id="quantityInput"
            type="number"
            min="1"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          />
          <FormError message={errors.quantity?.message} />
        </div>
      </div>

      {/* Price CNY & Currency Converter Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FFF8E1] border-2 border-[#1A1A24]">
        <div className="space-y-2">
          <FormLabel htmlFor="priceCnyInput" required>
            3. HARGA SATUAN (¥ CNY)
          </FormLabel>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-mono font-bold text-xs text-[#1A1A24]">
              ¥
            </span>
            <input
              id="priceCnyInput"
              type="number"
              step="0.01"
              min="0.1"
              placeholder="0.00"
              {...register("priceCny", { valueAsNumber: true })}
              className="w-full pl-8 pr-3 py-2 bg-white border-2 border-[#1A1A24] font-mono text-sm font-bold focus:outline-none focus:border-[#2323FF]"
            />
          </div>
          <FormError message={errors.priceCny?.message} />
        </div>

        {/* Molecule Currency Calculation Box */}
        <CurrencyCalcBox
          exchangeRate={exchangeRate}
          totalPriceIdr={totalPriceIdr}
          quantity={quantity}
        />
      </div>

      {/* Variants (Color & Size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel htmlFor="variantColorInput">
            VARIAN WARNA / MOTIF (OPSIONAL)
          </FormLabel>
          <input
            id="variantColorInput"
            type="text"
            placeholder="Contoh: Hitam, Cream, Navy"
            {...register("selectedVariant.color")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="variantSizeInput">
            VARIAN UKURAN / SIZE (OPSIONAL)
          </FormLabel>
          <input
            id="variantSizeInput"
            type="text"
            placeholder="Contoh: XL, L, 42, 256GB"
            {...register("selectedVariant.size")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <FormLabel htmlFor="notesInput">
          CATATAN KHUSUS UNTUK BUYER SHANGHAI (OPSIONAL)
        </FormLabel>
        <textarea
          id="notesInput"
          rows={2}
          placeholder="Tulis pesan jika ada request cek size chart, minta box utuh, atau cek nomor seri..."
          {...register("notes")}
          className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
        />
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <Button type="submit" variant="neon" size="lg" className="w-full">
          <PackagePlus className="w-5 h-5 mr-2" />+ MASUKKAN KE KERANJANG
          KONSOLIDASI
        </Button>
      </div>
    </form>
  );
}
