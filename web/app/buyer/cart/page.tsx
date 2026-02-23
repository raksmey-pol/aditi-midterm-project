"use client";

import { useState } from "react";
import { CartList } from "./components/CartList";
import { OrderSummary } from "./components/OrderSummary";
import { EmptyCart } from "./components/EmptyCart";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {

  const [userId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const user = localStorage.getItem("user");
    if (!user) return "";
    try {
      return JSON.parse(user).id ?? "";
    } catch {
      return "";
    }
  });

  const { cart, loading, error, updateItem, removeItem } = useCart(userId);

  const subtotal = Number(cart?.totalPrice ?? 0);
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const discount = 0;

  if (loading) return <p>Loading your cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  const cartItems = cart.items.map((item) => ({
    id: item.cartItemId,
    name: item.productName,
    image: item.imageUrl,
    category: item.category,
    price: item.unitPrice,
    quantity: item.quantity,
  }));

  const handleCheckout = () => {
    console.log("proceed to checkout");
  };

  const handleApplyCoupon = (code: string) => {
    console.log("coupon applied:", code);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CartList
          items={cartItems}
          onUpdateQuantity={(id, qty) => updateItem(id, qty)}
          onRemove={(id) => removeItem(id)}
        />
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          discount={discount}
          onCheckout={handleCheckout}
          onApplyCoupon={handleApplyCoupon}
        />
      </div>
    </main>
  );
}