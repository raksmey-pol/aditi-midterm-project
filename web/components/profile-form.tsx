"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useAuth";
import { Customer } from "@/lib/types/customer";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAddresses } from "@/hooks/useAddress";
import {
  ProfileFormData,
  profileFormSchema,
} from "@/schemas/customer-validation";
import AddressModal from "./address-modal";

interface ProfileFormProps {
  customer: Customer;
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateProfile();
  const { data: addresses, isLoading: isAddressesLoading } = useGetAddresses();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    values: {
      firstName: customer?.firstName || "", // Use firstName directly
      lastName: customer?.lastName || "", // Use lastName directly
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
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

  // Safe concatenation for the display view
  const fullName =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
    "No Name Provided";

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
        {/* Name Fields (Split when editing, combined when viewing) */}
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="text-slate-700 font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className="border-slate-300 focus:border-blue-500"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName" className="text-slate-700 font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className="border-slate-300 focus:border-blue-500"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <Label className="text-slate-700 font-medium">Full Name</Label>
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
              <User className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900">{fullName}</span>
            </div>
          </div>
        )}

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
                disabled // Recommended: Don't let users change login email here!
                {...register("email")}
                className="border-slate-300 bg-slate-100 text-slate-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
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
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
              <Phone className="h-5 w-5 text-slate-500" />
              <span className="text-slate-900">
                {customer.phone || "Not provided"}
              </span>
            </div>
          )}
        </div>

        {/* Address Field */}
        <div className="grid gap-2">
          <Label htmlFor="address" className="text-slate-700 font-medium">
            Shipping Address
          </Label>

          {isEditing ? (
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}>
                      {/* 2. Added w-full so the button actually takes up space */}
                      <SelectTrigger className="w-full border-slate-300 focus:ring-blue-500">
                        <SelectValue
                          placeholder={
                            isAddressesLoading
                              ? "Loading addresses..."
                              : "Select a shipping address"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {/* 3. Safer null-checking for the empty state */}
                        {!addresses || addresses.length === 0 ? (
                          <div className="p-2 text-sm text-slate-500 text-center">
                            No saved addresses found.
                          </div>
                        ) : (
                          addresses.map((addr) => {
                            const fullAddress = `${addr.street1}, ${addr.city}, ${addr.country}`;
                            return (
                              <SelectItem key={addr.id} value={fullAddress}>
                                {addr.label} - {addr.street1}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="w-fit shrink-0">
                <AddressModal />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
              <MapPin className="h-5 w-5 text-slate-500 shrink-0" />
              <span className="text-slate-900 truncate">
                {customer.address|| "No legacy address provided"}
              </span>
            </div>
          )}
        </div>
      </form>

      {/* Success and Error Messages */}
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
