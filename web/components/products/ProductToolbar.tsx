"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ProductToolbarProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export function ProductToolbar({ view, setView }: ProductToolbarProps) {
  return (
    <div className="flex justify-end items-center mb-6">
      <div className="flex gap-2">
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
