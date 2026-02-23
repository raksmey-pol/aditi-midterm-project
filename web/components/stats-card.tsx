import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Heart } from "lucide-react";
import { CustomerStats } from "@/lib/types/customer";

interface StatsCardsProps {
  stats: CustomerStats;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName?: string;
}

function StatCard({ title, value, icon, iconClassName }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconClassName}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCardProps[] = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag className="h-4 w-4 text-blue-600" />,
      iconClassName: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Total Spending",
      value: formatCurrency(stats.totalSpending),
      icon: <DollarSign className="h-4 w-4 text-emerald-600" />,
      iconClassName: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Wishlist Items",
      value: stats.wishlistItems,
      icon: <Heart className="h-4 w-4 text-rose-600" />,
      iconClassName: "bg-rose-50 dark:bg-rose-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
