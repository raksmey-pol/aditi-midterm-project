import { cartService } from "../lib/services/cart.service";
import { useCartContext } from "@/context/cartcontext";
export const useCart = (userId: string) => {
  const { cart, refetch } = useCartContext();

  const addItem = async (productId: string, quantity: number) => {
    await cartService.addItem(userId, { productId, quantity });
    refetch(); // 🔥 update global cart
  };

  const updateItem = async (cartItemId: string, quantity: number) => {
    await cartService.updateItem(cartItemId, { quantity });
    refetch();
  };

  const removeItem = async (cartItemId: string) => {
    await cartService.removeItem(cartItemId);
    refetch();
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