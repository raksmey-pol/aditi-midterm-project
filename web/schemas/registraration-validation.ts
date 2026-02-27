import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  passwordHash: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  phoneNumber: z.string().optional(),
  roleId: z.string().min(1, "Please select a role"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
