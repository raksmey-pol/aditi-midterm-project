"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerProfile } from "@/hooks/useCustomers";
import { PasswordChangeForm } from "./change-password-form";
import { CustomerHeader } from "./customer-headers";
import { ProfileForm } from "./profile-form";
import { StatsCards } from "./stats-card";

export default function CustomerProfile() {
  const { data: customer, isLoading, isError } = useCustomerProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading profile...</p>
            </div>
          </div>
        </div>
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
                Please try refreshing the page
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
        {/* Header */}
        <CustomerHeader customer={customer} />

        {/* Stats Cards */}
        <StatsCards stats={customer.stats} />

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <Tabs defaultValue="profile" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-white">
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-white">
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
