import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cartLookupApi,
  getUserCartsApi,
  mapCartWithImagesToCartItem,
  mapLookupResponseToCartItem,
} from "@/lib/api/cart";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import type { CartLookupPayload } from "@/types/api";

/**
 * Hook to lookup / scrape product by URL and save to backend cart
 */
export function useCartLookupMutation() {
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (payload: { cart_url: string; user_id?: string }) => {
      const activeUserId = payload.user_id || user?.id;

      if (!activeUserId) {
        throw new Error(
          "Silakan masuk ke akun Anda terlebih dahulu untuk memproses dan menyimpan keranjang.",
        );
      }

      const lookupPayload: CartLookupPayload = {
        cart_url: payload.cart_url,
        user_id: activeUserId,
      };

      const result = await cartLookupApi(lookupPayload);
      const cartItem = mapLookupResponseToCartItem(result);

      // Add to local cart store
      addItem(cartItem);

      // Invalidate server carts cache
      queryClient.invalidateQueries({
        queryKey: ["user-carts", activeUserId],
      });

      return {
        lookupData: result,
        cartItem,
      };
    },
  });
}

/**
 * Hook to fetch all carts saved in backend for a specific user
 */
export function useUserCartsQuery(userId?: string) {
  const currentUser = useAuthStore((s) => s.user);
  const activeUserId = userId || currentUser?.id;

  return useQuery({
    queryKey: ["user-carts", activeUserId],
    queryFn: async () => {
      if (!activeUserId) return [];
      const apiCarts = await getUserCartsApi(activeUserId);
      return apiCarts.map(mapCartWithImagesToCartItem);
    },
    enabled: !!activeUserId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
