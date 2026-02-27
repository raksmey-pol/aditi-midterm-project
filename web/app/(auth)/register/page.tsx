"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { authService } from "@/lib/services/auth.service";
import { RoleResponse } from "@/lib/types/auth";
import { useAuthContext } from "@/context/authcontext";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RegisterFormValues, registerSchema } from "@/schemas/registraration-validation";

const getRedirectPath = (roles: string[]): string => {
  if (!roles || roles.length === 0) return "/";
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("seller")) return "/seller/dashboard";
  if (roles.includes("buyer")) return "/";
  return "/";
};

export default function Register() {
  const router = useRouter();
  const { setUser } = useAuthContext();

  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [serverError, setServerError] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      passwordHash: "",
      phoneNumber: "",
      roleId: "",
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const publicRoles = await authService.getPublicRole();
        setRoles(publicRoles);
      } catch (err) {
        console.error("Failed to load roles:", err);
        setServerError(
          "Unable to load available roles. Please try again later.",
        );
      }
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    try {
      const response = await authService.register(data);
      authService.setUser(response.user);
      setUser(response.user);
      router.push(getRedirectPath(response.user.roles));
    } catch (err) {
      let message = "Registration failed. Please try again.";
      if (err instanceof Error) {
        if (
          err.message.includes("already exists") ||
          err.message.includes("duplicate")
        ) {
          message =
            "An account with this email already exists. Please login instead.";
        } else if (err.message.includes("Backend server is not running")) {
          message = "Unable to connect to the server. Please try again later.";
        } else if (err.message.includes("Network error")) {
          message =
            "Network connection error. Please check your internet connection.";
        } else {
          message = err.message;
        }
      }
      setServerError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-accent/10 p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-2xl shadow-primary/5">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join us and get started today
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* First & Last Name */}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="your_email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="passwordHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone (optional) */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number{" "}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+855 12 345 678"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I want to register as</FormLabel>
                    <FormControl>
                      {roles.length === 0 ? (
                        <div className="h-10 flex items-center text-sm text-muted-foreground">
                          Loading roles...
                        </div>
                      ) : (
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="">Select your role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name.charAt(0).toUpperCase() +
                                role.name.slice(1)}
                            </option>
                          ))}
                        </select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Legal */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-foreground transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
