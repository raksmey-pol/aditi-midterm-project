"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sellerService } from "@/lib/services/seller.service";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Image from "next/image";
import { Category } from "@/lib/types/seller";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
    imageUrl: "",
    status: "ACTIVE",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    // Upload to server
    setUploadingImage(true);
    try {
      const result = await sellerService.uploadProductImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: result.imageUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    } finally {
      setUploadingImage(false);
    }
  };

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
  useEffect(() => {
    sellerService
      .getCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoadingCategories(false));
  }, []);

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
          <select
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            disabled={loadingCategories}
          >
            <option value="">
              {loadingCategories ? "Loading..." : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel>Product Image</FieldLabel>
          <div className="space-y-3">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage
                  ? "Uploading..."
                  : imagePreview
                    ? "Change Image"
                    : "Choose Image"}
              </button>
              {formData.imageUrl && !uploadingImage && (
                <span className="text-sm text-muted-foreground">
                  ✓ Image uploaded
                </span>
              )}
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, imageUrl: "" }));
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <p className="text-xs text-muted-foreground">
              Accepted formats: JPG, PNG, GIF, WebP (max 10MB)
            </p>
          </div>
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
            disabled={loading || uploadingImage}
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
