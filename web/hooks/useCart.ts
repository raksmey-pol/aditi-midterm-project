import { cartService } from "../lib/services/cart.service";
import { useCartContext } from "@/context/cartcontext";

export const useCart = (userId: string) => {
  const { cart, refetch, setCart } = useCartContext();

  const addItem = async (productId: string, quantity: number) => {
    await cartService.addItem(userId, { productId, quantity });
    refetch();
  };

  const updateItem = async (cartItemId: string, quantity: number) => {
    // ✅ optimistic update — update UI instantly
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        ),
      };
    });

    // then sync with backend
    await cartService.updateItem(cartItemId, { quantity });
    // refetch();
  };

  const removeItem = async (cartItemId: string) => {
    // ✅ optimistic update — remove from UI instantly
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.cartItemId !== cartItemId),
      };
    });

    await cartService.removeItem(cartItemId);
    // refetch();
  };

  const clearCart = async () => {
    if (!cart) return;
    await cartService.clearCart(cart.cartId);
    refetch();
  };

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cart,
    itemCount,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refetch,
  };
};