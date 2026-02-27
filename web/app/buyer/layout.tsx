import { ProtectedRoute } from "@/components/protected-routes";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}