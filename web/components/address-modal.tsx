"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { AddressForm } from "./address-form";

const AddressModal = () => {
  // We use this state so we can programmatically close the modal after a successful save
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* CRITICAL: type="button" prevents it from submitting the Profile form */}
        <Button type="button" variant="default" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </DialogTrigger>

      {/* This is the popup window that was missing! */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new shipping address</DialogTitle>
          <DialogDescription>
            Enter your delivery details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* Render our React Hook Form, and tell it to close the modal on success */}
        <AddressForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
