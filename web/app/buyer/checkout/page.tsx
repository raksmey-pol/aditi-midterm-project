"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/cartcontext";
import {
  AddressForm,
  ShippingMethod,
  CheckoutState,
} from "@/lib/types/checkout";
import ShippingInfoStep from "./components/Shippinginfo";
import PaymentStep from "./components/PaymentStep";
import ReviewStep from "./components/ReviewStep";
import { cartService } from "@/lib/services/cart.service";

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

  const [state, setState] = useState<CheckoutState>({
    step: 1,
    address: null,
    addressId: null,
    shippingMethod: null,
    paymentMethod: "CASH_ON_DELIVERY",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("accessToken");

  const handleShippingInfoSubmit = async (
    addressData: AddressForm,
    shippingMethod: ShippingMethod,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            label: addressData.label,
            recipientName: addressData.recipientName,
            phoneNumber: addressData.phoneNumber,
            street1: addressData.street1,
            street2: addressData.street2,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode,
            country: addressData.country,
            isDefault: false,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to save address");
      const saved = await res.json();

      setState((prev) => ({
        ...prev,
        step: 2,
        address: addressData,
        addressId: saved.id,
        shippingMethod,
      }));
      // ✅ correct - shows error message, stays on step 1
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = () => {
    setState((prev) => ({ ...prev, step: 3 }));
  };

  // at the top, get userId
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

  const handlePlaceOrder = async () => {
    if (!cart || !state.addressId || !state.shippingMethod) return;
    setLoading(true);
    setError(null);

    try {
      const subtotal = Number(cart.totalPrice);
      const tax = subtotal * 0.08;
      const totalAmount = subtotal + state.shippingMethod.price + tax;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          totalAmount: totalAmount.toFixed(2),
          shippingAddressId: state.addressId,
          items: cart.items.map((item) => ({
            productId: item.productId,
            sellerId: item.sellerId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");
      const order = await res.json();

      // ✅ save invoice data AFTER order confirmed, BEFORE redirect
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId: order.id,
          items: cart.items.map((item) => ({
            id: item.cartItemId,
            productId: item.productId,
            sellerId: item.sellerId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
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
    } catch {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {state.step === 1 && (
        <ShippingInfoStep
          shippingMethods={SHIPPING_METHODS}
          cartTotal={Number(cart.totalPrice)}
          defaultAddress={state.address}
          defaultShipping={state.shippingMethod}
          onSubmit={handleShippingInfoSubmit}
          loading={loading}
        />
      )}

      {state.step === 2 && (
        <PaymentStep
          onSubmit={handlePaymentSubmit}
          onBack={() => setState((prev) => ({ ...prev, step: 1 }))}
        />
      )}

      {state.step === 3 && (
        <ReviewStep
          cart={cart}
          address={state.address!}
          shippingMethod={state.shippingMethod!}
          onPlaceOrder={handlePlaceOrder}
          onBack={() => setState((prev) => ({ ...prev, step: 2 }))}
          loading={loading}
        />
      )}
    </main>
  );
}
