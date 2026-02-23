"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useChangePassword } from "@/hooks/useAuth";
import {
  PasswordFormData,
  passwordFormSchema,
} from "@/schemas/password-validation";

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
    formState: { errors, isDirty },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Automatically hide the success message after 5 seconds
  useEffect(() => {
    if (changePassword.isSuccess) {
      const timer = setTimeout(() => {
        changePassword.reset(); // This resets the mutation state
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [changePassword.isSuccess, changePassword]);

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync(data);
      reset(); // Clear the form fields on success
    } catch (error) {
      // Error is handled by changePassword.isError below
      console.error("Failed to change password:", error);
    }
  };

  const fields = [
    { id: "currentPassword", label: "Current Password", key: "current" },
    { id: "newPassword", label: "New Password", key: "new" },
    { id: "confirmPassword", label: "Confirm New Password", key: "confirm" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Change Password
        </h2>
        <p className="text-slate-500 text-sm">
          Update your password to keep your account secure.
        </p>
      </div>

      <Separator className="bg-slate-200" />

      {/* Success Alert */}
      {changePassword.isSuccess && (
        <Alert className="bg-emerald-50 border-emerald-200 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800 font-medium">
            Your password has been updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {changePassword.isError && (
        <Alert variant="destructive" className="animate-in shake-1">
          <AlertDescription>
            {changePassword.error?.message ||
              "Invalid current password or update failed."}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5">
          {fields.map((field) => (
            <div key={field.id} className="grid gap-2">
              <Label
                htmlFor={field.id}
                className="text-slate-700 font-medium text-sm">
                {field.label}
              </Label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-3 h-4 w-4 text-slate-400 transition-colors pointer-events-none" />
                <Input
                  id={field.id}
                  type={showPassword[field.key] ? "text" : "password"}
                  {...register(field.id)}
                  className="pl-9 pr-10 border-slate-300  transition-all"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  autoComplete={
                    field.id === "currentPassword"
                      ? "current-password"
                      : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(field.key)}
                  className="absolute right-3 flex items-center justify-center text-slate-400 hover:text-slate-600 focus:text-blue-600 focus:outline-none transition-colors"
                  tabIndex={-1} // Prevents tabbing to the eye icon for faster navigation
                >
                  {showPassword[field.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors[field.id] && (
                <p className="text-destructive text-xs font-medium pl-1">
                  {errors[field.id]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Requirements Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-900 font-semibold mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Password Requirements:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            <RequirementItem text="Min. 6 characters" />
            <RequirementItem text="One uppercase letter" />
            <RequirementItem text="One number" />
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base font-medium shadow-md transition-all active:scale-[0.98]"
          disabled={changePassword.isPending || !isDirty}>
          {changePassword.isPending ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Lock className="h-4 w-4 mr-2" />
          )}
          {changePassword.isPending
            ? "Updating Password..."
            : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

function RequirementItem({ text }: { text: string }) {
  return (
    <li className="text-[11px] text-slate-500 flex items-center gap-1.5">
      <div className="h-1 w-1 rounded-full bg-slate-300" />
      {text}
    </li>
  );
}
