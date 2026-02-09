"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useChangePassword } from "@/hooks/useCustomers";
import {
  PasswordFormData,
  passwordFormSchema,
} from "@/schemas/customer-validation";

export function PasswordChangeForm() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Change Password
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Ensure your account is using a strong password
        </p>
      </div>

      <Separator />

      {changePassword.isSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800 font-medium">
            Password changed successfully!
          </AlertDescription>
        </Alert>
      )}

      {changePassword.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {changePassword.error?.message || "Failed to change password"}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Helper function to render fields consistently */}
        {[
          { id: "currentPassword", label: "Current Password", key: "current" },
          { id: "newPassword", label: "New Password", key: "new" },
          {
            id: "confirmPassword",
            label: "Confirm New Password",
            key: "confirm",
          },
        ].map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id} className="text-slate-700 font-medium">
              {field.label}
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id={field.id}
                type={
                  showPassword[field.key as keyof typeof showPassword]
                    ? "text"
                    : "password"
                }
                {...register(field.id as keyof PasswordFormData)}
                className="pl-9 pr-10 border-slate-300"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
              <button
                type="button"
                onClick={() =>
                  toggleVisibility(field.key as keyof typeof showPassword)
                }
                className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                tabIndex={-1}>
                {showPassword[field.key as keyof typeof showPassword] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors[field.id as keyof PasswordFormData] && (
              <p className="text-destructive text-xs font-medium">
                {errors[field.id as keyof PasswordFormData]?.message}
              </p>
            )}
          </div>
        ))}

        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-blue-800/80 space-y-1 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>Uppercase, lowercase, number, and special character</li>
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
          disabled={changePassword.isPending}>
          {changePassword.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Lock className="h-4 w-4 mr-2" />
          )}
          {changePassword.isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
