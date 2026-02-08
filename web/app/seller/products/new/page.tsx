"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sellerService } from "@/lib/services/seller.service";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
    imageUrl: "",
    status: "ACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sellerService.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });

      router.push("/seller/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Product</h1>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field>
          <FieldLabel>Product Name *</FieldLabel>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <textarea
            className="w-full min-h-32 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter product description"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Price ($) *</FieldLabel>
            <Input
              required
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="0.00"
            />
          </Field>

          <Field>
            <FieldLabel>Stock Quantity *</FieldLabel>
            <Input
              required
              type="number"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({ ...formData, stockQuantity: e.target.value })
              }
              placeholder="0"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <Input
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="e.g., Electronics, Clothing"
          />
        </Field>

        <Field>
          <FieldLabel>Image URL</FieldLabel>
          <Input
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
          />
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </Field>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/seller/dashboard")}
            className="px-6 py-3 border border-border rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
