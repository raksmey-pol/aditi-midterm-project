"use client";

import { useMemo, useState } from "react";
import { ShippingMethod } from "@/lib/types/checkout";
import { AddressResponse } from "@/lib/services/addresses.service";
import { useMyAddresses, useDeleteAddress } from "@/hooks/useAddress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Loader2,
  MapPin,
  Clock,
  Zap,
  Package,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { AddressForm } from "@/components/address-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil } from "lucide-react";

interface Props {
  shippingMethods: ShippingMethod[];
  cartTotal: number;
  onSubmit: (address: AddressResponse, shipping: ShippingMethod) => void;
  loading: boolean;
}

const shippingIcons: Record<string, React.ReactNode> = {
  free: <Package className="h-5 w-5 text-emerald-600" />,
  standard: <Clock className="h-5 w-5 text-blue-600" />,
  express: <Zap className="h-5 w-5 text-amber-500" />,
};

export default function ShippingInfoStep({
  shippingMethods,
  cartTotal,
  onSubmit,
  loading,
}: Props) {
  const { data: addresses, isLoading: addressesLoading } = useMyAddresses();
  const deleteAddressMutation = useDeleteAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(
    null,
  );

  const defaultAddressId = useMemo(() => {
    if (!addresses || addresses.length === 0) return null;

    const defaultAddress = addresses.find((a) => a.isDefault === true);
    console.log(
      "addresses:",
      addresses.map((a) => ({ label: a.label, isDefault: a.isDefault })),
    );
    console.log("defaultAddress:", defaultAddress);

    return defaultAddress?.id ?? addresses[0].id;
  }, [addresses]);
  const defaultShippingId =
    shippingMethods.find((m) => !(m.id === "free" && cartTotal < 100))?.id ??
    null;

  const activeAddressId = selectedAddressId ?? defaultAddressId;
  const activeShippingId = selectedShippingId ?? defaultShippingId;

  const handleSubmit = () => {
    const address = addresses?.find((a) => a.id === activeAddressId);
    const shipping = shippingMethods.find((m) => m.id === activeShippingId);
    if (!address || !shipping) return;
    onSubmit(address, shipping);
  };

  const handleDelete = (id: string) => {
    deleteAddressMutation.mutate(id, {
      onSuccess: () => {
        // if deleted address was selected, reset selection
        if (selectedAddressId === id) setSelectedAddressId(null);
      },
    });
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(
    null,
  );

  const handleEdit = (address: AddressResponse) => {
    setEditingAddress(address);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ── Address Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
              1
            </div>
            <h2 className="text-base font-semibold tracking-tight">
              Delivery Address
            </h2>
          </div>

          {/* Add New Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <AddressForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {addressesLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground text-sm rounded-xl border border-dashed">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading saved addresses...
          </div>
        ) : !addresses || addresses.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 rounded-xl border border-dashed text-center">
            <MapPin className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No saved addresses
            </p>
            <p className="text-xs text-muted-foreground/70">
              Click "Add New" to add your first address
            </p>
          </div>
        ) : (
          <RadioGroup
            value={activeAddressId ?? ""}
            onValueChange={setSelectedAddressId}
            className="space-y-2.5">
            {addresses.map((address) => {
              const isSelected = activeAddressId === address.id;
              return (
                <Label
                  key={address.id}
                  htmlFor={`addr-${address.id}`}
                  className="cursor-pointer block">
                  <div
                    className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-black bg-gray-50/80"
                        : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}>
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value={address.id}
                        id={`addr-${address.id}`}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">
                            {address.label}
                          </span>
                          {address.isDefault && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-4 bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {address.recipientName}
                          <span className="text-muted-foreground font-normal ml-2">
                            {address.phoneNumber}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {address.street1}
                          {address.street2 && `, ${address.street2}`},{" "}
                          {address.city}, {address.state}
                          {address.zipCode && ` ${address.zipCode}`},{" "}
                          {address.country}
                        </p>
                      </div>

                      {/* ── Ellipsis Menu ── */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground hover:bg-gray-100"
                            onClick={(e) => e.preventDefault()} // prevent radio selection
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(address);
                            }}>
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                                onSelect={(e) => e.preventDefault()} // keep dropdown open for alert
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Address
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <span className="font-medium text-foreground">
                                    {address.label}
                                  </span>
                                  ? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDelete(address.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Label>
              );
            })}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Address</DialogTitle>
                </DialogHeader>
                {editingAddress && (
                  <AddressForm
                    onSuccess={(updatedId) => {
                      setEditDialogOpen(false);
                      setEditingAddress(null);
                      if (updatedId) {
                        setSelectedAddressId(updatedId);
                      } else {
                        setSelectedAddressId(null);
                      }
                    }}
                    editAddress={{
                      id: editingAddress.id,
                      defaultValues: {
                        label: editingAddress.label,
                        recipientName: editingAddress.recipientName,
                        phoneNumber: editingAddress.phoneNumber,
                        street1: editingAddress.street1,
                        street2: editingAddress.street2 ?? "",
                        city: editingAddress.city,
                        state: editingAddress.state,
                        zipCode: editingAddress.zipCode ?? "",
                        country: editingAddress.country,
                        isDefault: editingAddress.isDefault,
                      },
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </RadioGroup>
        )}
      </div>

      <Separator />

      {/* ── Shipping Method Section ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
            2
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            Shipping Method
          </h2>
        </div>

        <RadioGroup
          value={activeShippingId ?? ""}
          onValueChange={setSelectedShippingId}
          className="space-y-2.5">
          {shippingMethods.map((method) => {
            const isDisabled = method.id === "free" && cartTotal < 100;
            const isSelected = activeShippingId === method.id;
            const icon = shippingIcons[method.id] ?? (
              <Package className="h-5 w-5 text-gray-400" />
            );

            return (
              <Label
                key={method.id}
                htmlFor={`ship-${method.id}`}
                className={
                  isDisabled
                    ? "cursor-not-allowed block"
                    : "cursor-pointer block"
                }>
                <div
                  className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                    isDisabled
                      ? "opacity-45 bg-gray-50 border-gray-100"
                      : isSelected
                        ? "border-black bg-gray-50/80"
                        : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={method.id}
                      id={`ship-${method.id}`}
                      disabled={isDisabled}
                      className="shrink-0"
                    />

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{method.name}</p>
                        {method.id === "express" && (
                          <Badge className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-medium">
                            Fastest
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {method.description}
                      </p>
                      {isDisabled && (
                        <p className="text-xs text-red-400 mt-0.5">
                          Available for orders over $100
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      {method.price === 0 ? (
                        <span className="text-sm font-bold text-emerald-600">
                          FREE
                        </span>
                      ) : (
                        <span className="text-sm font-bold">
                          ${method.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      <Separator />

      {/* ── CTA ── */}
      <Button
        className="w-full h-12 text-sm font-semibold rounded-xl bg-black hover:bg-gray-800 transition-all"
        disabled={loading || !activeAddressId || !activeShippingId}
        onClick={handleSubmit}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <span className="flex items-center gap-1">
            Continue to Payment
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
