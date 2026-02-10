"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useCustomers";
import { Customer } from "@/lib/types/customer";
import { ProfileFormData, profileFormSchema } from "@/schemas/customer-validation";

interface ProfileFormProps {
  customer: Customer;
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Personal Information
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Update your personal details
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={updateProfile.isPending}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-green-600 hover:bg-green-700"
              disabled={!isDirty || updateProfile.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Name Field */}
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-slate-700 font-medium">
            Full Name
          </Label>
          {isEditing ? (
            <div>
              <Input
                id="name"
                {...register("name")}
                className="border-slate-300 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
              <User className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900">{customer.name}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email Address
          </Label>
          {isEditing ? (
            <div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="border-slate-300 focus:border-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
              <Mail className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900">{customer.email}</span>
            </div>
          )}
        </div>

        {/* Phone Field */}
        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-slate-700 font-medium">
            Phone Number
          </Label>
          {isEditing ? (
            <div>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className="border-slate-300 focus:border-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
              <Phone className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900">{customer.phone}</span>
            </div>
          )}
        </div>

        {/* Address Field */}
        <div className="grid gap-2">
          <Label htmlFor="address" className="text-slate-700 font-medium">
            Address
          </Label>
          {isEditing ? (
            <div>
              <Input
                id="address"
                {...register("address")}
                className="border-slate-300 focus:border-blue-500"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
              <MapPin className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900">{customer.address}</span>
            </div>
          )}
        </div>
      </form>

      {updateProfile.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            {updateProfile.error?.message || "Failed to update profile"}
          </p>
        </div>
      )}

      {updateProfile.isSuccess && !isEditing && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            Profile updated successfully!
          </p>
        </div>
      )}
    </div>
  );
}
