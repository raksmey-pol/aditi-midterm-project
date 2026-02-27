"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import { useAuthContext } from "@/context/authcontext";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Users", href: "/admin/users" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Categories", href: "/admin/categories" },
];

export default function AdminLayout({
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roles: string[] = payload.roles || payload.scope?.split(" ") || [];
      const isAdmin = roles.some(
        (r: string) => r === "ROLE_ADMIN" || r === "admin",
      );
      if (!isAdmin) {
        router.push("/");
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <nav className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold text-primary cursor-default">
                Admin Portal
              </span>
              <div className="hidden md:flex gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
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

      {/* Page content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
