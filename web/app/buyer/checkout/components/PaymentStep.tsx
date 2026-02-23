"use client";

interface Props {
  onSubmit: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onSubmit, onBack }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Payment Method</h2>

      {/* Cash on Delivery Option */}
      <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
          <div>
            <p className="font-medium text-sm">Cash on Delivery</p>
            <p className="text-xs text-gray-500">Pay when your order arrives</p>
          </div>
          <span className="ml-auto text-2xl">💵</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          💡 Please prepare the exact amount when your order is delivered.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Review Order →
        </button>
      </div>
    </div>
  );
}