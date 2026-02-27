"use client";

import { ShippingMethod } from "@/lib/types/checkout";
import { CartResponse } from "@/lib/types/cart";
import { useState } from "react";
import { AddressResponse } from "@/lib/services/addresses.service";

interface Props {
  cart: CartResponse;
  address: AddressResponse; // ← was AddressForm
  shippingMethod: ShippingMethod;
  onPlaceOrder: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function ReviewStep({
  cart,
  address,
  shippingMethod,
  onPlaceOrder,
  onBack,
  loading,
}: Props) {
  const subtotal = Number(cart.totalPrice);
  const shipping = shippingMethod.price;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review Your Order</h2>

      {/* Shipping Address */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
          Shipping To
        </h3>
        <p className="text-sm font-medium">{address.recipientName}</p>
        <p className="text-sm text-gray-600">{address.street1}</p>
        {address.street2 && (
          <p className="text-sm text-gray-600">{address.street2}</p>
        )}
        <p className="text-sm text-gray-600">
          {address.city}
          {address.state ? `, ${address.state}` : ""} {address.zipCode}
        </p>
        <p className="text-sm text-gray-600">{address.country}</p>
        <p className="text-sm text-gray-600">{address.phoneNumber}</p>
      </div>

      {/* Shipping & Payment */}
      <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
            Shipping
          </h3>
          <p className="text-sm font-medium">{shippingMethod.name}</p>
          <p className="text-xs text-gray-500">{shippingMethod.days}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
            Payment
          </h3>
          <p className="text-sm font-medium">Cash on Delivery</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Items ({cart.items.length})
        </h3>

        <div className="space-y-3">
          {cart.items.map(item => (
            <div
              key={item.cartItemId}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-black cursor-pointer"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
          I agree to the{" "}
          <a href="/terms" target="_blank" className="text-black underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" className="text-black underline">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          ← Back
        </button>

        <button
          onClick={onPlaceOrder}
          disabled={loading}
          className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order ✓"}
        </button>
      </div>
    </div>
  );
}