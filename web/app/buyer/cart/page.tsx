"use client";

import { useState } from "react";
import { CartList } from "./components/CartList";
import { OrderSummary } from "./components/OrderSummary";
import { EmptyCart } from "./components/EmptyCart";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();

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
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearCart = async () => {
    setClearing(true);
    await clearCart();
    setClearing(false);
    setShowConfirm(false);
  };

  const { cart, loading, error, updateItem, removeItem, clearCart } =
    useCart(userId);

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
    router.push("/buyer/checkout");
  };

  const handleApplyCoupon = (code: string) => {
    console.log("coupon applied:", code);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Your Cart</h1>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
        >
          <Trash2 /> {clearing ? "Clearing..." : "Empty Cart"}
        </button>
      </div>
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
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            onClick={() => setShowConfirm(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in">
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Empty your cart?
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently remove all items from your cart. This action
              cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleClearCart}
                disabled={clearing}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                {clearing ? "Clearing..." : "Yes, Empty Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
