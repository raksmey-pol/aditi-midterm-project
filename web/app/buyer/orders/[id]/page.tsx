"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrder"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Helper for shadcn Badge variants
function statusVariant(status: string) {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "default";
    case "SHIPPED":
      return "secondary";
    case "PENDING":
      return "outline";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading, isError } = useOrderDetails(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-64 border border-slate-300 bg-slate-50 rounded-xl"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <p className="text-red-500 font-medium">
          Order not found or failed to load.
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-slate-300">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-300 transition-all">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Order #{order.id.split("-")[0].toUpperCase()}
            </h1>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{new Date(order.createdAt).toLocaleString()}</span>
              <span>•</span>
              <Badge
                variant={statusVariant(order.status)}
                className="rounded-md px-2 border-slate-300">
                {order.status || "PENDING"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-none border border-slate-300 overflow-hidden rounded-xl">
            <CardHeader className="border-b border-slate-300 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-600" />
                Items ordered
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {order.items?.map((item, index) => (
                <div key={item.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 transition-colors hover:bg-slate-50/50">
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-slate-300 bg-white flex items-center justify-center p-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1162/1162456.png"
                        alt={item.productName}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-1">
                        <h4 className="font-medium text-slate-900 line-clamp-2">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Seller ID: {item.sellerId.split("-")[0]}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-medium text-slate-900">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < order.items.length - 1 && (
                    <Separator className="bg-slate-200" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-none border border-slate-300 rounded-xl">
            <CardHeader className="border-b border-slate-200 pb-4">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
