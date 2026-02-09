import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { Customer } from "@/lib/types/customer";
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";

interface CustomerHeaderProps {
  customer: Customer;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {customer.name}
              </h1>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                Customer
              </Badge>
            </div>
            <div className="flex flex-col gap-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{customer.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
