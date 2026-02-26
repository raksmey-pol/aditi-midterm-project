"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin.service";
import type { AdminUser } from "@/lib/types/admin";
import { ConfirmDialog } from "../components/ConfirmDialog";

type DialogState = {
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  action: () => void;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = (user: AdminUser) => {
    setDialog({
      title: user.active ? "Deactivate User" : "Activate User",
      message: `${user.active ? "Deactivate" : "Activate"} ${user.email}?`,
      confirmLabel: user.active ? "Deactivate" : "Activate",
      danger: user.active,
      action: async () => {
        setDialog(null);
        setActionLoading(user.id);
        try {
          const updated = await adminService.setUserStatus(
            user.id,
            !user.active,
          );
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? updated : u)),
          );
        } catch (err) {
          setActionError(err instanceof Error ? err.message : "Action failed");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const deleteUser = (user: AdminUser) => {
    setDialog({
      title: "Delete User",
      message: `Permanently delete ${user.email}? This cannot be undone.`,
      confirmLabel: "Delete",
      danger: true,
      action: async () => {
        setDialog(null);
        setActionLoading(user.id);
        try {
          await adminService.deleteUser(user.id);
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
        } catch (err) {
          setActionError(err instanceof Error ? err.message : "Delete failed");
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading users…</p>
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            {users.length} registered users
          </p>
        </div>
        <button
          onClick={fetchUsers}
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

      <div className="border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Roles</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Verified</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(user.roles ?? []).map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary capitalize"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs ${
                      user.emailVerified ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {user.emailVerified ? "✓ Verified" : "⚠ Unverified"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      disabled={actionLoading === user.id}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                        user.active
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } disabled:opacity-50`}
                    >
                      {actionLoading === user.id
                        ? "…"
                        : user.active
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      disabled={actionLoading === user.id}
                      className="px-3 py-1 text-xs rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                    >
                      {actionLoading === user.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
