"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "@/hooks/useCustomers";
import { PasswordFormData, passwordFormSchema } from "@/schemas/customer-validation";


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

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync(data);
      reset();
      // Success state is shown via changePassword.isSuccess
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
          <AlertDescription className="text-green-800">
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
        {/* Current Password */}
        <div className="grid gap-2">
          <Label
            htmlFor="current-password"
            className="text-slate-700 font-medium">
            Current Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id="current-password"
              type={showPassword.current ? "text" : "password"}
              {...register("currentPassword")}
              className="pl-10 pr-10 border-slate-300 focus:border-blue-500"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  current: !showPassword.current,
                })
              }
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              {showPassword.current ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="grid gap-2">
          <Label htmlFor="new-password" className="text-slate-700 font-medium">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id="new-password"
              type={showPassword.new ? "text" : "password"}
              {...register("newPassword")}
              className="pl-10 pr-10 border-slate-300 focus:border-blue-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({ ...showPassword, new: !showPassword.new })
              }
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              {showPassword.new ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label
            htmlFor="confirm-password"
            className="text-slate-700 font-medium">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id="confirm-password"
              type={showPassword.confirm ? "text" : "password"}
              {...register("confirmPassword")}
              className="pl-10 pr-10 border-slate-300 focus:border-blue-500"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirm: !showPassword.confirm,
                })
              }
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              {showPassword.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">
            Password Requirements:
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={changePassword.isPending}>
          <Lock className="h-4 w-4 mr-2" />
          {changePassword.isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
