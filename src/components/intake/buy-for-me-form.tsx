"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calculator,
  Link2,
  Loader2,
  PackagePlus,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";
import { useScrapeProductMutation } from "@/hooks/use-scrape-product";
import { formatIdr, generateId } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import {
  type BuyForMeItem,
  type CreateBuyForMeInput,
  CreateBuyForMeInputSchema,
} from "@/schemas/buy-for-me";
import { useCartStore } from "@/store/use-cart-store";

const PRESET_SAMPLE_LINKS = [
  {
    name: "Taobao Hoodie 460GSM",
    url: "https://item.taobao.com/item.htm?id=782910382901",
  },
  {
    name: "Tmall Chunky Sneaker",
    url: "https://detail.tmall.com/item.htm?id=691238475920",
  },
  {
    name: "1688 Messenger Bag",
    url: "https://detail.1688.com/offer/712398471234.html",
  },
];

export function BuyForMeForm() {
  const { success, error } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [scrapedPreview, setScrapedPreview] = useState<{
    imageUrl?: string;
    sellerName?: string;
    rating?: string;
    variants?: { colors: string[]; sizes: string[] };
  } | null>(null);

  const scrapeMutation = useScrapeProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBuyForMeInput>({
    resolver: zodResolver(CreateBuyForMeInputSchema),
    defaultValues: {
      serviceType: "BUY_FOR_ME",
      sourceUrl: "",
      productName: "",
      priceCny: 0,
      exchangeRate: BRANDING.exchangeRate.cnyToIdr,
      quantity: 1,
      selectedVariant: {
        color: "",
        size: "",
      },
      notes: "",
    },
  });

  const sourceUrl = watch("sourceUrl");
  const priceCny = watch("priceCny") || 0;
  const exchangeRate = watch("exchangeRate") || BRANDING.exchangeRate.cnyToIdr;
  const quantity = watch("quantity") || 1;
  const priceIdr = Math.round(priceCny * exchangeRate);
  const totalPriceIdr = priceIdr * quantity;

  // Auto scrape handler
  const handleScrape = async () => {
    if (!sourceUrl) {
      error("Harap masukkan tautan produk terlebih dahulu");
      return;
    }

    try {
      const data = await scrapeMutation.mutateAsync(sourceUrl);
      setValue("productName", data.productName, { shouldValidate: true });
      setValue("priceCny", data.priceCny, { shouldValidate: true });
      if (data.imageUrl) {
        setValue("imageUrl", data.imageUrl);
      }
      if (data.variants.colors.length > 0) {
        setValue("selectedVariant.color", data.variants.colors[0]);
      }
      if (data.variants.sizes.length > 0) {
        setValue("selectedVariant.size", data.variants.sizes[0]);
      }
      setScrapedPreview({
        imageUrl: data.imageUrl,
        sellerName: data.sellerName,
        rating: data.rating,
        variants: data.variants,
      });
      success(
        "Data Produk Berhasil Ditarik!",
        `${data.productName} (${data.sourceDomain})`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menarik data produk";
      error("Gagal Ekstraksi", msg);
    }
  };

  const onSubmit = (values: CreateBuyForMeInput) => {
    const finalRate = values.exchangeRate || BRANDING.exchangeRate.cnyToIdr;
    const finalPriceIdr = Math.round((values.priceCny || 0) * finalRate);
    const newItem: BuyForMeItem = {
      ...values,
      id: generateId("FP-BFM"),
      exchangeRate: finalRate,
      priceIdr: finalPriceIdr,
      imageUrl: scrapedPreview?.imageUrl || values.imageUrl,
    };

    addItem(newItem);
    success(
      "Tiket Titip Dibeliin Berhasil Dibuat!",
      `${values.productName} ditambahkan ke keranjang konsolidasi.`,
    );

    // Reset form
    reset({
      serviceType: "BUY_FOR_ME",
      sourceUrl: "",
      productName: "",
      priceCny: 0,
      exchangeRate: BRANDING.exchangeRate.cnyToIdr,
      quantity: 1,
      selectedVariant: { color: "", size: "" },
      notes: "",
    });
    setScrapedPreview(null);
  };

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
            onClick={() => {
              setValue("sourceUrl", preset.url, { shouldValidate: true });
            }}
            className="text-[11px] font-mono bg-white hover:bg-[#2323FF] hover:text-white px-2 py-0.5 border border-[#1A1A24] transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* URL Input with Scrape Button */}
      <div className="space-y-2">
        <label
          htmlFor="sourceUrlInput"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
        >
          1. TAUTAN PRODUK TIONGKOK (TAOBAO / TMALL / 1688){" "}
          <span className="text-red-600">*</span>
        </label>
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
            disabled={scrapeMutation.isPending}
            className="shrink-0"
          >
            {scrapeMutation.isPending ? (
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
          <label
            htmlFor="productNameInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            2. NAMA PRODUK <span className="text-red-600">*</span>
          </label>
          <input
            id="productNameInput"
            type="text"
            placeholder="Contoh: Jaket Varsity Vintage Fleece"
            {...register("productName")}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.productName && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.productName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="quantityInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            JUMLAH (QTY) <span className="text-red-600">*</span>
          </label>
          <input
            id="quantityInput"
            type="number"
            min="1"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full px-3 py-2.5 bg-white border-2 border-[#1A1A24] font-mono text-xs focus:outline-none focus:border-[#2323FF]"
          />
          {errors.quantity && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* Price CNY & Currency Converter Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FFF8E1] border-2 border-[#1A1A24]">
        <div className="space-y-2">
          <label
            htmlFor="priceCnyInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            3. HARGA SATUAN (¥ CNY) <span className="text-red-600">*</span>
          </label>
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
          {errors.priceCny && (
            <p className="font-mono text-[11px] text-red-600">
              {errors.priceCny.message}
            </p>
          )}
        </div>

        {/* Live Exchange Calculation Box */}
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
      </div>

      {/* Variants (Color & Size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="variantColorInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            VARIAN WARNA / MOTIF (OPSIONAL)
          </label>
          <input
            id="variantColorInput"
            type="text"
            placeholder="Contoh: Hitam, Cream, Navy"
            {...register("selectedVariant.color")}
            className="w-full px-3 py-2 bg-white border-2 border-[#1A1A24] font-sans text-xs focus:outline-none focus:border-[#2323FF]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="variantSizeInput"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
          >
            VARIAN UKURAN / SIZE (OPSIONAL)
          </label>
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
        <label
          htmlFor="notesInput"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A24]"
        >
          CATATAN KHUSUS UNTUK BUYER SHANGHAI (OPSIONAL)
        </label>
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
