"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/seller/dashboard" },
    { name: "Products", href: "/seller/products/new" },
    { name: "Inventory", href: "/seller/inventory" },
    { name: "Payouts", href: "/seller/payouts" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/seller/dashboard" className="text-xl font-bold">
                Seller Portal
              </Link>
              <div className="flex gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/customer/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
