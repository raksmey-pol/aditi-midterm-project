"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCustomerStats } from "@/hooks/useCustomerStats";

import { CustomerHeader } from "./customer-headers";
import { StatsCards } from "./stats-card";
import { ProfileForm } from "./profile-form";
import { PasswordChangeForm } from "./change-password-form";
import { Spinner } from "./ui/spinner";

export default function CustomerProfile() {
  const router = useRouter();

  const {
    data: customer,
    isLoading: isAuthLoading,
    isError: isAuthError,
  } = useAuth();

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useCustomerStats();

  const isLoading = isAuthLoading || isStatsLoading;
  const isError = isAuthError || isStatsError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-24" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                Failed to load profile
              </h2>
              <p className="mt-2 text-slate-600">
                Please try refreshing the page or logging in again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Back Button ── */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Back to Home</span>
        </div>

        <CustomerHeader customer={customer} />

        {stats && <StatsCards stats={stats} />}

        <Card className="border-0 bg-white/80 backdrop-blur">
          <Tabs defaultValue="profile" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Change Password
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="profile" className="mt-0">
                <ProfileForm customer={customer} />
              </TabsContent>

              <TabsContent value="password" className="mt-0">
                <PasswordChangeForm />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
