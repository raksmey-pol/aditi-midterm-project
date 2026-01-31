"use client";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import { RoleResponse } from "@/lib/types/auth";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [error, setError] = useState("");
  1;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const publicRoles = await authService.getPublicRole();
        setRoles(publicRoles);
      } catch (err) {
        console.error("Failed to load roles:", err);
        setError("Unable to load available roles. Please try again later.");
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic client-side validation
      if (!email || !password || !firstName || !lastName || !roleId) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Call register API
      const response = await authService.register({
        email,
        passwordHash: password, // ← usually just send plain password
        firstName,
        lastName,
        roleId: roleId, // or role: role depending on your backend
      });

      // Store user data (usually only after successful registration + login)
      authService.setUser(response.user);

      // Redirect depending on role or just to dashboard/home
      router.push("/admin");
      // Alternative ideas:
      // if (role === "admin") router.push("/admin");
      // else if (role === "teacher") router.push("/teacher");
      // else router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-accent/10 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Register Card */}
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <FieldGroup>
                <div className="flex gap-3">
                  <Field>
                    <FieldLabel htmlFor="firstName" className="text-foreground">
                      First Name
                    </FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastName" className="text-foreground">
                      Last Name
                    </FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email" className="text-foreground">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your_email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password" className="text-foreground">
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Field>

                {/* Optional: Role selection */}
                <Field>
                  <FieldLabel htmlFor="role" className="text-foreground">
                    I want to register as
                  </FieldLabel>
                  {roles.length === 0 ? (
                    <div className="h-10 flex items-center text-sm text-muted-foreground">
                      Loading roles...
                    </div>
                  ) : (
                    <select
                      id="role"
                      value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}
                      disabled={loading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select your role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name.charAt(0).toUpperCase() +
                            role.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </FieldGroup>
            </FieldSet>
          </form>

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
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Legal text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
