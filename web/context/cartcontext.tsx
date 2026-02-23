"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { cartService } from "@/lib/services/cart.service";
import { CartResponse } from "@/lib/types/cart";

interface CartContextType {
  cart: CartResponse | null;
  itemCount: number;
  refetch: () => void;
  clearCartLocally: () => void; 
}

const CartContext = createContext<CartContextType>({
  cart: null,
  itemCount: 0,
  refetch: () => {},
  clearCartLocally: () => {}, 
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const userIdRef = useRef<string>("");

  const refetch = () => {
    const userId = userIdRef.current;
    if (!userId) return;
    cartService
      .getCart(userId)
      .then(setCart)
      .catch(() => {});
  };
  const clearCartLocally = () => {
  setCart((prev) => prev ? { ...prev, items: [], totalPrice: 0 } : prev);
};

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;
    try {
      const parsed = JSON.parse(user);
      if (parsed?.id) {
        userIdRef.current = parsed.id;
        refetch(); // safe to call here — not setState directly
      }
    } catch {}
  }, []);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, refetch , clearCartLocally }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
