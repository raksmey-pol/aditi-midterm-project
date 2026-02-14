import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Heart } from "lucide-react";
import { CustomerStats } from "@/lib/types/customer";
interface StatsCardsProps {
  stats: CustomerStats;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Orders */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Orders</p>
              <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Spending */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Total Spending
              </p>
              <p className="text-4xl font-bold mt-2">
                {formatCurrency(stats.totalSpending)}
              </p>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">
                Wishlist Items
              </p>
              <p className="text-4xl font-bold mt-2">{stats.wishlistItems}</p>
            </div>
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
