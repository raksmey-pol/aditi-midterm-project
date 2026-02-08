"use client";

import { useEffect, useState } from "react";
import { sellerService } from "@/lib/services/seller.service";
import type { DashboardStats } from "@/lib/types/seller";

export default function SellerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const data = await sellerService.getDashboardStats();
      setStats(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard statistics";
      console.error("Failed to load stats:", error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Unable to Load Dashboard
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadStats}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Seller Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
          description="All-time earnings"
          color="green"
        />
        <StatCard
          title="Pending Payouts"
          value={`$${stats?.pendingPayouts?.toFixed(2) || "0.00"}`}
          description="Awaiting transfer"
          color="yellow"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toString() || "0"}
          description="Products listed"
          color="blue"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats?.lowStockCount?.toString() || "0"}
          description="Items below 10 units"
          color="red"
        />
        <StatCard
          title="Total Sales"
          value={stats?.totalSales?.toString() || "0"}
          description="Orders completed"
          color="purple"
        />
        <StatCard
          title="Platform Fees"
          value={`$${stats?.platformFees?.toFixed(2) || "0.00"}`}
          description="All-time fees paid"
          color="gray"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="flex gap-4">
          <a
            href="/seller/products/new"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Add New Product
          </a>
          <a
            href="/seller/inventory"
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
          >
            Manage Inventory
          </a>
          <a
            href="/seller/payouts"
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
          >
            View Payouts
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    green: "border-green-500/20 bg-green-500/5",
    yellow: "border-yellow-500/20 bg-yellow-500/5",
    blue: "border-blue-500/20 bg-blue-500/5",
    red: "border-red-500/20 bg-red-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
    gray: "border-gray-500/20 bg-gray-500/5",
  };

  return (
    <div
      className={`p-6 rounded-lg border ${colorClasses[color] || colorClasses.gray}`}
    >
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
