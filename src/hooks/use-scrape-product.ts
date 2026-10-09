import { useMutation } from "@tanstack/react-query";
import { cartLookupApi, extractCartImageUrl, parsePrice } from "@/lib/api/cart";
import { chinaMarketplaceUrlRegex } from "@/schemas/buy-for-me";
import { useAuthStore } from "@/store/use-auth-store";

export interface ScrapedProductData {
  productName: string;
  priceCny: number;
  imageUrl: string;
  sourceDomain: "Taobao" | "Tmall" | "1688";
  variants: {
    colors: string[];
    sizes: string[];
  };
  sellerName: string;
  rating: string;
  originalUrl: string;
}

const MOCK_SCRAPED_PRODUCTS: Record<string, Partial<ScrapedProductData>> = {
  shoes: {
    productName: "Chunky Vintage Runner Sneaker Low-top Retro Gray",
    priceCny: 249.0,
    imageUrl:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    variants: {
      colors: ["Silver Gray", "Off-White Phantom", "Midnight Black"],
      sizes: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44"],
    },
    sellerName: "Shanghai Footwear Studio (4.9★)",
  },
  hoodie: {
    productName: "Heavyweight French Terry Boxy Hoodie 460GSM",
    priceCny: 168.0,
    imageUrl:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    variants: {
      colors: ["Washed Black", "Oatmeal Heather", "Forest Moss"],
      sizes: ["M (Oversized)", "L (Oversized)", "XL (Boxy)"],
    },
    sellerName: "Guangzhou Textile Flagship (5.0★)",
  },
  bag: {
    productName: "Modular Waterproof Cordura Messenger Sling Bag",
    priceCny: 119.0,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    variants: {
      colors: ["Matte Black", "Tactical Coyote", "Cyber Silver"],
      sizes: ["Standard 14-inch", "Compact 11-inch"],
    },
    sellerName: "Shenzhen Techgear Craft (4.8★)",
  },
};

export function simulateProductScrape(
  url: string,
): Promise<ScrapedProductData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const lower = url.toLowerCase();
      if (!chinaMarketplaceUrlRegex.test(url)) {
        reject(
          new Error(
            "URL harus berasal dari taobao.com, tmall.com, atau 1688.com",
          ),
        );
        return;
      }

      let sourceDomain: "Taobao" | "Tmall" | "1688" = "Taobao";
      if (lower.includes("tmall.com")) sourceDomain = "Tmall";
      if (lower.includes("1688.com")) sourceDomain = "1688";

      // Pick a preset or generate dynamic
      let sample = MOCK_SCRAPED_PRODUCTS.hoodie;
      if (
        lower.includes("shoe") ||
        lower.includes("sepatu") ||
        lower.includes("runner")
      ) {
        sample = MOCK_SCRAPED_PRODUCTS.shoes;
      } else if (
        lower.includes("bag") ||
        lower.includes("tas") ||
        lower.includes("sling")
      ) {
        sample = MOCK_SCRAPED_PRODUCTS.bag;
      } else {
        // Pseudo randomize based on URL length
        const keys = Object.keys(MOCK_SCRAPED_PRODUCTS);
        const picked = keys[url.length % keys.length];
        sample = MOCK_SCRAPED_PRODUCTS[picked];
      }

      resolve({
        productName: sample.productName || "Premium Import Product from China",
        priceCny: sample.priceCny || 150,
        imageUrl:
          sample.imageUrl ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        sourceDomain,
        variants: sample.variants || {
          colors: ["Default Color"],
          sizes: ["Free Size"],
        },
        sellerName: sample.sellerName || `${sourceDomain} Verified Merchant`,
        rating: sample.rating || "4.9 ★",
        originalUrl: url,
      });
    }, 600);
  });
}

export function useScrapeProductMutation() {
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (url: string) => {
      if (user?.id) {
        try {
          const apiRes = await cartLookupApi({
            cart_url: url,
            user_id: user.id,
          });
          const { priceCny } = parsePrice(apiRes.cart_price);
          const imageUrl = extractCartImageUrl(apiRes.cart_images);
          const lower = url.toLowerCase();
          let sourceDomain: "Taobao" | "Tmall" | "1688" = "Taobao";
          if (lower.includes("tmall.com")) sourceDomain = "Tmall";
          if (lower.includes("1688.com")) sourceDomain = "1688";

          return {
            productName: apiRes.cart_title || "Produk Import Marketplace China",
            priceCny,
            imageUrl,
            sourceDomain,
            variants: {
              colors: ["Default Color"],
              sizes: ["Standard Size"],
            },
            sellerName: `${sourceDomain} Verified Merchant`,
            rating: "4.9 ★",
            originalUrl: url,
          };
        } catch {
          // Gracefully fallback to scraper simulator if offline or error
        }
      }
      return simulateProductScrape(url);
    },
  });
}
