import * as z from "zod";

export const profileFormSchema = z.object({
  // Remove 'name' and add these two:
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

// This line is crucial! It regenerates the type TypeScript is complaining about.
export type ProfileFormData = z.infer<typeof profileFormSchema>;
