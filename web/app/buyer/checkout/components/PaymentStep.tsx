"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Banknote } from "lucide-react";

interface Props {
  onSubmit: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onSubmit, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
          3
        </div>
        <h2 className="text-base font-semibold tracking-tight">
          Payment Method
        </h2>
      </div>

      {/* Cash on Delivery Card */}
      <div className="rounded-xl border-2 border-black bg-gray-50/80 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <Banknote className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Cash on Delivery</p>
            <p className="text-xs text-muted-foreground">
              Pay when your order arrives
            </p>
          </div>
          {/* selected indicator */}
          <div className="h-4 w-4 rounded-full border-2 border-black flex items-center justify-center shrink-0">
            <div className="h-2 w-2 rounded-full bg-black" />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-sm text-amber-800">
          💡 Please prepare the exact amount when your order is delivered.
        </p>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          className="flex-1 h-12 rounded-xl bg-black hover:bg-gray-800"
          onClick={onSubmit}>
          Review Order
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
