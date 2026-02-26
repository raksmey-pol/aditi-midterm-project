"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin.service";
import type { AdminOrder } from "@/lib/types/admin";

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? (updated as AdminOrder) : o)),
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading orders…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} total orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex justify-between items-center">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="text-red-400 hover:text-red-600 ml-4 text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl bg-card overflow-hidden"
          >
            {/* Order header */}
            <div className="px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{order.id.slice(0, 8)}…
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Buyer: {order.buyerId.slice(0, 8)}…
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    statusColors[order.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {/* Status updater */}
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === order.id ? null : order.id)
                  }
                  className="text-xs text-primary hover:underline"
                >
                  {expandedId === order.id ? "Hide items" : "View items"}
                </button>
              </div>
            </div>

            {/* Expandable items */}
            {expandedId === order.id && (
              <div className="border-t bg-muted/30 px-6 py-4">
                {order.shippingAddress && (
                  <p className="text-xs text-muted-foreground mb-3">
                    <span className="font-medium">Ship to:</span>{" "}
                    {order.shippingAddress}
                  </p>
                )}
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1 text-left font-medium">Product</th>
                      <th className="py-1 text-left font-medium">Qty</th>
                      <th className="py-1 text-left font-medium">Unit Price</th>
                      <th className="py-1 text-left font-medium">Subtotal</th>
                      <th className="py-1 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(order.items ?? []).map((item) => (
                      <tr key={item.id}>
                        <td className="py-2">{item.productName}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="py-2">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-2">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
}
