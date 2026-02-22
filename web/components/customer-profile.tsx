"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth"; // Using the hook we just made!

// Import your custom components (make sure these files exist in your folder)
import { CustomerHeader } from "./customer-headers";
import { StatsCards } from "./stats-card";
import { ProfileForm } from "./profile-form";
import { PasswordChangeForm } from "./change-password-form";
import { Spinner } from "./ui/spinner";

export default function CustomerProfile() {
  const { data: customer, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-24" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <CustomerHeader customer={customer} />
        <StatsCards
          stats={customer.stats || { orders: 0, spent: 0, reviews: 0 }}
        />
        <Card className="border-0 bg-white/80 backdrop-blur">
          <Tabs defaultValue="profile" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Change Password
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <ProfileForm customer={customer} />
              </TabsContent>

              {/* Password Tab */}
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
