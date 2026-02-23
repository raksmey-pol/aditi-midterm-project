"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CheckoutFailedPage() {
  const router = useRouter();

  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <XCircle className="w-20 h-20 text-red-500" />
      </div>

      <h1 className="text-3xl font-bold mb-3">Payment Failed</h1>
      <p className="text-gray-500 mb-2">Something went wrong with your order.</p>
      <p className="text-gray-400 text-sm mb-8">
        Your cart has not been cleared. You can try again or contact support.
      </p>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
        <p className="text-sm text-red-800 font-medium mb-1">What happened?</p>
        <p className="text-sm text-red-700">
          We were unable to process your order. This could be due to a network
          issue or a server error. Please try again.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/buyer/checkout")}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/buyer/cart")}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Back to Cart
        </button>
        <a
          href="mailto:support@mystore.com"
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}