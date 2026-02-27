"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { useAuthContext } from "@/context/authcontext";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { displayName, clearUser } = useAuthContext();

  const handleLogout = async () => {
    await authService.logout();
    clearUser();
    router.push("/");
  };

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
              <span className="text-xl font-bold cursor-default">
                Seller Portal
              </span>
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
            <div className="flex items-center gap-3">
              {displayName && (
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {displayName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
