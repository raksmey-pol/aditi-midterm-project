"use client";

import { useState } from "react";
import { AddressForm, ShippingMethod } from "@/lib/types/checkout";

interface Props {
  shippingMethods: ShippingMethod[];
  cartTotal: number;
  defaultAddress: AddressForm | null;
  defaultShipping: ShippingMethod | null;
  onSubmit: (address: AddressForm, shipping: ShippingMethod) => void;
  loading: boolean;
}

export default function ShippingInfoStep({
  shippingMethods,
  cartTotal,
  defaultAddress,
  defaultShipping,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<AddressForm>(
    defaultAddress ?? {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }
  );

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(
    defaultShipping ?? null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipping) return;
    onSubmit(form, selectedShipping);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Address Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Address Line 1 *</label>
            <input
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className={labelClass}>Address Line 2</label>
            <input
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              className={inputClass}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="New York"
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Postal Code *</label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="10001"
              />
            </div>
            <div>
              <label className={labelClass}>Country *</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="United States"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Method Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
        <div className="space-y-3">
          {shippingMethods.map((method) => {
            const isDisabled = method.id === "free" && cartTotal < 100;
            const isSelected = selectedShipping?.id === method.id;

            return (
              <div
                key={method.id}
                onClick={() => !isDisabled && setSelectedShipping(method)}
                className={`border rounded-lg p-4 transition-all
                  ${isSelected ? "border-black bg-gray-50 ring-2 ring-black/10" : "border-gray-200"}
                  ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}
                `}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? "border-black" : "border-gray-300"}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                      {isDisabled && (
                        <p className="text-xs text-red-400 mt-0.5">Requires order over $100</p>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-sm">
                    {method.price === 0 ? "FREE" : `$${method.price.toFixed(2)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedShipping}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-40"
      >
        {loading ? "Saving..." : "Continue to Payment →"}
      </button>
    </form>
  );
}