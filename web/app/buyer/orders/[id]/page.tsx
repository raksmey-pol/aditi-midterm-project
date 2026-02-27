"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  CircleDot,
  ShoppingBag,
  Receipt,
  CircleDollarSign,
} from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type ReactNode } from "react";
import { string } from "zod";
type StatusConfig = {
  label: string;
  color: string;
  bg: string;
  icon: ReactNode;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  PROCESSING: {
    label: "Processing",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <CircleDot className="h-3.5 w-3.5" />,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <CircleDot className="h-3.5 w-3.5" />,
  },
};
const STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading, isError } = useOrderDetails(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded-full" />
          <div className="h-32 bg-white rounded-2xl border border-gray-100" />
          <div className="h-64 bg-white rounded-2xl border border-gray-100" />
          <div className="h-48 bg-white rounded-2xl border border-gray-100" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-12 w-12 text-gray-300" />
        <p className="text-gray-500 font-medium">Order not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const statusKey = order.status?.toUpperCase() ?? "PENDING";
  const statusConfig = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.PENDING;
  const currentStepIndex = STEPS.indexOf(statusKey);
  const isCancelled = statusKey === "CANCELLED";

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">Order Details</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* ── Order ID + Status ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm font-semibold">
                #{order.id.split("-")[0].toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig.color} ${statusConfig.bg}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>

          {/* ── Progress Timeline ── */}
          {!isCancelled && (
            <div className="mt-6">
              <div className="relative flex items-center justify-between">
                {/* progress bar background */}
                <div className="absolute left-0 right-0 h-0.5 bg-gray-100 top-3.5 mx-4" />
                {/* progress bar fill */}
                <div
                  className="absolute h-0.5 bg-black top-3.5 ml-4 transition-all duration-500"
                  style={{
                    width:
                      currentStepIndex <= 0
                        ? "0%"
                        : `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                  }}
                />
                {STEPS.map((step, i) => {
                  const isDone = i <= currentStepIndex;
                  const isActive = i === currentStepIndex;
                  return (
                    <div
                      key={step}
                      className="relative flex flex-col items-center gap-2 z-10">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? "bg-black border-black"
                            : "bg-white border-gray-200"
                        } ${isActive ? "ring-4 ring-black/10" : ""}`}>
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-gray-200" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-medium ${
                          isDone ? "text-black" : "text-gray-400"
                        }`}>
                        {step.charAt(0) + step.slice(1).toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </span>
          </div>

          {order.items.map((item, index) => (
            <div key={item.id}>
              <div className="flex gap-4 p-5">
                {/* product image */}
                <div className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-gray-300" />
                  )}
                </div>

                {/* details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sold by{" "}
                    {item?.sellerId?.split("-")[0]?.toUpperCase() || "Unknown"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      Qty: {item.quantity}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {index < order.items.length - 1 && <Separator className="mx-5" />}
            </div>
          ))}
        </div>

        {/* ── Delivery Address ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Delivery Address</span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            {order.shippingAddress}
          </p>
        </div>

        {/* ── Payment Summary ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Payment Summary</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({order.items.length} items)
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-emerald-600 font-medium">Included</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <span className="text-base"><CircleDollarSign/></span>
            <div>
              <p className="text-xs font-medium">Cash on Delivery</p>
              <p className="text-[10px] text-muted-foreground">
                Pay when your order arrives
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}