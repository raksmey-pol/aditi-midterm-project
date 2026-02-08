"use client";

import { useEffect, useState } from "react";
import { sellerService } from "@/lib/services/seller.service";
import type { Payout } from "@/lib/types/seller";

export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const data = await sellerService.getPayouts();
      setPayouts(data);
    } catch (error) {
      console.error("Failed to load payouts:", error);
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

  const totalEarnings = payouts.reduce(
    (sum, p) => sum + (p.sellerEarnings || 0),
    0,
  );
  const totalFees = payouts.reduce((sum, p) => sum + (p.platformFee || 0), 0);
  const pendingAmount = payouts
    .filter((p) => p.payoutStatus === "PENDING")
    .reduce((sum, p) => sum + (p.sellerEarnings || 0), 0);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Payouts & Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Earnings
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            Pending Payouts
          </h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            ${pendingAmount.toFixed(2)}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">
            Platform Fees Paid
          </h3>
          <p className="text-3xl font-bold mt-2">${totalFees.toFixed(2)}</p>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-left p-4 font-semibold">Product</th>
              <th className="text-left p-4 font-semibold">Quantity</th>
              <th className="text-left p-4 font-semibold">Total Amount</th>
              <th className="text-left p-4 font-semibold">Platform Fee</th>
              <th className="text-left p-4 font-semibold">Your Earnings</th>
              <th className="text-left p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-t border-border">
                <td className="p-4 text-sm">
                  {new Date(payout.saleDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="font-medium">{payout.productName}</div>
                </td>
                <td className="p-4">{payout.quantity}</td>
                <td className="p-4">${payout.totalAmount.toFixed(2)}</td>
                <td className="p-4 text-red-600">
                  -${payout.platformFee.toFixed(2)}
                </td>
                <td className="p-4 font-semibold text-green-600">
                  ${payout.sellerEarnings.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payout.payoutStatus === "PAID"
                        ? "bg-green-500/10 text-green-600"
                        : payout.payoutStatus === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : payout.payoutStatus === "PROCESSING"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {payout.payoutStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payouts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No payouts yet</p>
        </div>
      )}
    </div>
  );
}
