"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BRANDING } from "@/config/branding";
import { useScrapeProductMutation } from "@/hooks/use-scrape-product";
import { generateId } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import {
  type BuyForMeItem,
  type CreateBuyForMeInput,
  CreateBuyForMeInputSchema,
} from "@/schemas/buy-for-me";
import { useCartStore } from "@/store/use-cart-store";

export const PRESET_SAMPLE_LINKS = [
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

export function useBuyForMeForm() {
  const { success, error } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [scrapedPreview, setScrapedPreview] = useState<{
    imageUrl?: string;
    sellerName?: string;
    rating?: string;
    variants?: { colors: string[]; sizes: string[] };
  } | null>(null);

  const scrapeMutation = useScrapeProductMutation();

  const form = useForm<CreateBuyForMeInput>({
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

  const { setValue, watch, reset } = form;

  const sourceUrl = watch("sourceUrl");
  const priceCny = watch("priceCny") || 0;
  const exchangeRate = watch("exchangeRate") || BRANDING.exchangeRate.cnyToIdr;
  const quantity = watch("quantity") || 1;
  const priceIdr = Math.round(priceCny * exchangeRate);
  const totalPriceIdr = priceIdr * quantity;

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

  const handleApplyPreset = (url: string) => {
    setValue("sourceUrl", url, { shouldValidate: true });
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

  return {
    form,
    scrapedPreview,
    isScraping: scrapeMutation.isPending,
    handleScrape,
    handleApplyPreset,
    onSubmit,
    priceCny,
    exchangeRate,
    quantity,
    priceIdr,
    totalPriceIdr,
  };
}
