"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin.service";
import type { AdminProduct } from "@/lib/types/admin";
import { ConfirmDialog } from "../components/ConfirmDialog";

type DialogState = {
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  action: () => void;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const data = await adminService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = (product: AdminProduct) => {
    setDialog({
      title: "Delete Product",
      message: `Permanently delete "${product.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
      action: async () => {
        setDialog(null);
        setDeletingId(product.id);
        try {
          await adminService.deleteProduct(product.id);
          setProducts((prev) => prev.filter((p) => p.id !== product.id));
        } catch (err) {
          setActionError(err instanceof Error ? err.message : "Delete failed");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading products…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dialog && (
        <ConfirmDialog
          open
          title={dialog.title}
          message={dialog.message}
          confirmLabel={dialog.confirmLabel}
          danger={dialog.danger}
          onConfirm={dialog.action}
          onCancel={() => setDialog(null)}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} products across all sellers
          </p>
        </div>
        <button
          onClick={fetchProducts}
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

      <input
        type="text"
        placeholder="Search by name or category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Seller ID</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.imageUrl && (
                      <img
                        src={
                          product.imageUrl.startsWith("http")
                            ? product.imageUrl
                            : product.imageUrl
                        }
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.category ?? "—"}
                </td>
                <td className="px-4 py-3 font-medium">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      product.stockQuantity < 10
                        ? "text-red-600"
                        : "text-foreground"
                    }`}
                  >
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : product.status === "INACTIVE"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {product.sellerId.slice(0, 8)}…
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteProduct(product)}
                    disabled={deletingId === product.id}
                    className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                  >
                    {deletingId === product.id ? "…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
