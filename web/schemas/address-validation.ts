import * as z from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required (e.g., Home, Work)"),
  recipientName: z.string().min(1, "Recipient name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
