"use client";

import { useEffect, useState } from "react";
import { sellerService } from "@/lib/services/seller.service";
import type { Product } from "@/lib/types/seller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const [allProducts, lowStock] = await Promise.all([
        sellerService.getProducts(),
        sellerService.getLowStockProducts(),
      ]);
      setProducts(allProducts);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (productId: string, newStock: number) => {
    setStockUpdates((prev) => ({
      ...prev,
      [productId]: newStock,
    }));
  };

  const handleBulkUpdate = async () => {
    setUpdating(true);
    try {
      const updates = Object.entries(stockUpdates).map(
        ([productId, newStockQuantity]) => ({
          productId,
          newStockQuantity,
        }),
      );

      await sellerService.bulkUpdateStock({ updates });
      setStockUpdates({});
      await loadInventory();
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      await sellerService.deleteProduct(productToDelete.id);
      await loadInventory();
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        {Object.keys(stockUpdates).length > 0 && (
          <button
            onClick={handleBulkUpdate}
            disabled={updating}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {updating
              ? "Updating..."
              : `Update ${Object.keys(stockUpdates).length} Items`}
          </button>
        )}
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h2 className="font-semibold text-red-600 mb-2">
            ⚠️ Low Stock Alert ({lowStockProducts.length} items)
          </h2>
          <p className="text-sm text-muted-foreground">
            The following products have less than 10 units in stock
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-semibold">Product</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Current Stock</th>
              <th className="text-left p-4 font-semibold">New Stock</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="p-4">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)}
                  </div>
                </td>
                <td className="p-4 text-sm">{product.category || "-"}</td>
                <td className="p-4">
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
                <td className="p-4">
                  <Input
                    type="number"
                    min="0"
                    className="w-24"
                    defaultValue={product.stockQuantity}
                    onChange={(e) =>
                      handleStockChange(product.id, parseInt(e.target.value))
                    }
                  />
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-600"
                        : product.status === "OUT_OF_STOCK"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => openDeleteDialog(product)}
                    title="Delete product"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
