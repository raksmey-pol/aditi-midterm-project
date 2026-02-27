"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/cartcontext";
import { ShippingMethod, CheckoutState } from "@/lib/types/checkout";
import { AddressResponse } from "@/lib/services/addresses.service";
import { usePlaceOrder } from "@/hooks/useOrder";
import { cartService } from "@/lib/services/cart.service";
import ShippingInfoStep from "./components/Shippinginfo";
import PaymentStep from "./components/PaymentStep";
import ReviewStep from "./components/ReviewStep";

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    price: 10,
    days: "5-7 days",
  },
  {
    id: "free",
    name: "Free Shipping",
    description: "7-10 business days (orders over $100)",
    price: 0,
    days: "7-10 days",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCartLocally } = useCartContext();
  const placeOrderMutation = usePlaceOrder();

  const [state, setState] = useState<CheckoutState>({
    step: 1,
    address: null,
    addressId: null,
    shippingMethod: null,
    paymentMethod: "CASH_ON_DELIVERY",
  });

  const [error, setError] = useState<string | null>(null);

  // ── Step 1 → Step 2 ──
  const handleShippingInfoSubmit = (
    address: AddressResponse,
    shippingMethod: ShippingMethod,
  ) => {
    setState((prev) => ({
      ...prev,
      step: 2,
      address,
      addressId: address.id,
      shippingMethod,
    }));
  };

  // ── Step 2 → Step 3 ──
  const handlePaymentSubmit = () => {
    setState((prev) => ({ ...prev, step: 3 }));
  };

  // ── Step 3 → Place Order ──
  const handlePlaceOrder = async () => {
    if (!cart || !state.addressId || !state.shippingMethod) return;
    setError(null);

    try {
      const order = await placeOrderMutation.mutateAsync({
        shippingAddressId: state.addressId,
      });

      const subtotal = Number(cart.totalPrice);
      const tax = subtotal * 0.08;
      const totalAmount = subtotal + state.shippingMethod.price + tax;

      // save invoice for success page
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: order.id,
          items: cart.items,
          address: state.address,
          shippingMethod: state.shippingMethod,
          subtotal,
          tax,
          shipping: state.shippingMethod.price,
          total: totalAmount,
          date: new Date().toISOString(),
        }),
      );

      if (cart?.cartId) {
        await cartService.clearCart(cart.cartId);
      }
      clearCartLocally();
      router.push("/buyer/checkout/success");
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* ── Step Indicator ── */}
      <div className="flex items-center gap-2 mb-8">
        {["Shipping", "Payment", "Review"].map((label, i) => {
          const step = i + 1;
          const isActive = state.step === step;
          const isDone = state.step > step;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}>
                  {isDone ? "✓" : step}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-black" : "text-gray-400"
                  }`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className="h-px w-8 bg-gray-200" />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {state.step === 1 && (
        <ShippingInfoStep
          shippingMethods={SHIPPING_METHODS}
          cartTotal={Number(cart.totalPrice)}
          onSubmit={handleShippingInfoSubmit}
          loading={placeOrderMutation.isPending}
        />
      )}

      {state.step === 2 && (
        <PaymentStep
          onSubmit={handlePaymentSubmit}
          onBack={() => setState((prev) => ({ ...prev, step: 1 }))}
        />
      )}

      {state.step === 3 && state.address && state.shippingMethod && (
        <ReviewStep
          cart={cart}
          address={state.address}
          shippingMethod={state.shippingMethod}
          onPlaceOrder={handlePlaceOrder}
          onBack={() => setState((prev) => ({ ...prev, step: 2 }))}
          loading={placeOrderMutation.isPending}
        />
      )}
    </main>
  );
}
