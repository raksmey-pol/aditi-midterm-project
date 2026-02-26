"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin.service";
import type { AdminDashboardStats } from "@/lib/types/admin";

function StatCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "indigo";
}) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    red: "bg-red-50 border-red-200 text-red-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  return (
    <div className={`border rounded-xl p-6 ${colorMap[color]}`}>
      <p className="text-sm font-medium opacity-70">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs opacity-60 mt-1">{description}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform-wide overview and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toString() ?? "0"}
          description="All registered accounts"
          color="blue"
        />
        <StatCard
          title="Sellers"
          value={stats?.totalSellers?.toString() ?? "0"}
          description="Active seller accounts"
          color="purple"
        />
        <StatCard
          title="Buyers"
          value={stats?.totalBuyers?.toString() ?? "0"}
          description="Registered buyers"
          color="indigo"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toString() ?? "0"}
          description="Listed across all sellers"
          color="orange"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toString() ?? "0"}
          description="All-time orders placed"
          color="green"
        />
        <StatCard
          title="Platform Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          description="Total earnings across platform"
          color="green"
        />
        <StatCard
          title="Categories"
          value={stats?.totalCategories?.toString() ?? "0"}
          description="Managed product categories"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Manage Users", href: "/admin/users" },
              { label: "Manage Products", href: "/admin/products" },
              { label: "Manage Orders", href: "/admin/orders" },
              { label: "Manage Categories", href: "/admin/categories" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="block px-4 py-3 rounded-lg border hover:bg-muted transition-colors text-sm font-medium"
              >
                {action.label} →
              </a>
            ))}
          </div>
        </div>
        <div className="border rounded-xl p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">Platform Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total Users</dt>
              <dd className="font-semibold">{stats?.totalUsers ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Sellers / Buyers</dt>
              <dd className="font-semibold">
                {stats?.totalSellers ?? 0} / {stats?.totalBuyers ?? 0}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Products Listed</dt>
              <dd className="font-semibold">{stats?.totalProducts ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Orders Placed</dt>
              <dd className="font-semibold">{stats?.totalOrders ?? 0}</dd>
            </div>
            <div className="flex justify-between border-t pt-3">
              <dt className="text-muted-foreground font-medium">
                Total Revenue
              </dt>
              <dd className="font-bold text-green-700">
                ${(stats?.totalRevenue ?? 0).toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
