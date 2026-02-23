"use client";

import { useState } from "react";
import { ArrowRight, Tag } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  onCheckout: () => void;
  onApplyCoupon: (code: string) => void;
}

export function OrderSummary({
  subtotal,
  shipping,
  tax,
  discount,
  onCheckout,
  onApplyCoupon,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [applied, setApplied] = useState(false);

  const total = subtotal + shipping + tax - discount;

  const handleApply = () => {
    if (!couponCode.trim() || applied) return;
    onApplyCoupon(couponCode.trim());
    setApplied(true);
  };

  return (
    <aside className="bg-[#F5F0EA] rounded-2xl p-6 flex flex-col gap-5 lg:sticky lg:top-24">
      <h2 className="text-base font-bold text-[#1A1A1A] tracking-tight">
        Order Summary
      </h2>

      {/* Line items */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm text-[#5A5248]">
          <span>Subtotal</span>
          <span className="font-medium text-[#1A1A1A]">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-[#5A5248]">
          <span>Shipping</span>
          <span className="font-medium text-[#1A1A1A]">
            {shipping === 0 ? (
              <span className="text-[#3D5A2A] font-semibold">Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm text-[#5A5248]">
          <span>Tax (8%)</span>
          <span className="font-medium text-[#1A1A1A]">${tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-[#5A5248]">
            <span>Discount</span>
            <span className="font-semibold text-emerald-600">
              -${discount.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-[#E8E0D5]" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-[#1A1A1A]">Total</span>
        <span className="text-xl font-bold text-[#3D5A2A]">${total.toFixed(2)}</span>
      </div>

      {/* Coupon */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[#5A5248] uppercase tracking-wider flex items-center gap-1.5">
          <Tag size={12} />
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter code"
            disabled={applied}
            className="flex-1 bg-white border border-[#E8E0D5] text-sm h-9 rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-[#3D5A2A] placeholder:text-[#C0B5A8] disabled:opacity-50"
          />
          <button
            onClick={handleApply}
            disabled={applied || !couponCode.trim()}
            className="h-9 px-4 rounded-xl border border-[#3D5A2A] text-[#3D5A2A] hover:bg-[#3D5A2A] hover:text-white text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {applied ? "Applied ✓" : "Apply"}
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-[#3D5A2A] hover:bg-[#2D4520] text-white rounded-xl h-12 text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
      >
        Proceed to Checkout
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </button>

      <p className="text-center text-xs text-[#A89D8F]">
        🔒 Secure checkout &nbsp;·&nbsp; Free returns
      </p>
    </aside>
  );
}