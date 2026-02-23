"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressFormValues, addressSchema } from "@/schemas/address-validation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useAddAddress } from "@/hooks/useAddress";

interface AddressFormProps {
  onSuccess?: () => void;
}

export function AddressForm({ onSuccess }: AddressFormProps) {
  // 1. Bring in our clean React Query mutation!
  const addAddressMutation = useAddAddress();

  // 2. Initialize the form with Zod
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      recipientName: "",
      phoneNumber: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Cambodia", 
      isDefault: false,
    },
  });

  // 3. The new, ultra-lightweight submit handler
  const onSubmit = async (data: AddressFormValues) => {
    try {
      // Send the data to your service via the hook
      await addAddressMutation.mutateAsync(data);

      // If we get here, it succeeded!
      form.reset();

      // Close the modal if the prop was provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      // The error.message comes directly from our service's raw text parsing!
      alert(error.message || "Failed to save address");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl">
        {/* Row 1: Label & Recipient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Label</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Home, Office" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Phone & Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+855 12 345 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="KH" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Street Addresses */}
        <FormField
          control={form.control}
          name="street1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment, suite, etc. (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apt 4B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 4: City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Phnom Penh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State / Province</FormLabel>
                <FormControl>
                  <Input placeholder="Phnom Penh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="12000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Default Checkbox */}
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                {/* Ensure we default to false if undefined so Radix UI doesn't crash */}
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Set as default address</FormLabel>
                <FormDescription>
                  This address will be auto-selected during checkout.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={addAddressMutation.isPending}>
          {addAddressMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Address"
          )}
        </Button>
      </form>
    </Form>
  );
}
