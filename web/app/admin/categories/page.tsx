"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin.service";
import type { AdminCategory } from "@/lib/types/admin";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface CategoryForm {
  name: string;
  description: string;
}

const emptyForm: CategoryForm = { name: "", description: "" };

type DialogState = {
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  action: () => void;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError(null);
      const data = await adminService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description ?? "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await adminService.updateCategory(editingId, form);
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
        setEditingId(null);
      } else {
        const created = await adminService.createCategory(form);
        setCategories((prev) => [...prev, created]);
      }
      setForm(emptyForm);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = (cat: AdminCategory) => {
    setDialog({
      title: "Delete Category",
      message: `Delete category "${cat.name}"? This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
      action: async () => {
        setDialog(null);
        setDeletingId(cat.id);
        try {
          await adminService.deleteCategory(cat.id);
          setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        } catch (err) {
          setActionError(err instanceof Error ? err.message : "Delete failed");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading categories…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
      <div>
        <h1 className="text-3xl font-bold">Category Management</h1>
        <p className="text-muted-foreground mt-1">
          {categories.length} categories
        </p>
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

      {/* Form */}
      <div className="border rounded-xl bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Category" : "Create New Category"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Electronics"
              required
              className="w-full max-w-sm px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Short description of the category"
              rows={2}
              className="w-full max-w-sm px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !form.name.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {cat.description ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {cat.createdAt
                    ? new Date(cat.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="px-3 py-1 text-xs rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat)}
                      disabled={deletingId === cat.id}
                      className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                    >
                      {deletingId === cat.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No categories yet. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}
