"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { cartService } from "@/lib/services/cart.service";
import { CartResponse } from "@/lib/types/cart";

interface CartContextType {
  cart: CartResponse | null;
  itemCount: number;
  isLoading: boolean;
  cartError: string | null;
  refetch: () => void;
  clearCartLocally: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartResponse | null>>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  itemCount: 0,
  isLoading: false,
  cartError: null,
  refetch: () => {},
  clearCartLocally: () => {},
  setCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const userIdRef = useRef<string>("");

  const refetch = () => {
    const userId = userIdRef.current;
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setCartError(null);
    cartService
      .getCart(userId)
      .then((data) => {
        setCart(data);
      })
      .catch((err) => {
        setCartError(err?.message ?? "Failed to load cart");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearCartLocally = () => {
    setCart((prev) => (prev ? { ...prev, items: [], totalPrice: 0 } : prev));
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    try {
      const parsed = JSON.parse(user);
      if (parsed?.id) {
        userIdRef.current = parsed.id;
        refetch();
      }
    } catch {}
  }, []);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        cartError,
        refetch,
        clearCartLocally,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
