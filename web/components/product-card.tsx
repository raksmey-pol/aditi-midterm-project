import React from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
export const ProductCard = () => {
  return (
    <Card className="max-w-sm pt-0 rounded-none overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-36 sm:h-40 md:h-44">
          <Image
            src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Stylish Chair"
            fill
            className="object-cover brightness-60 grayscale"
            priority
          />
          <button className="absolute top-2 right-2 p-2 bg-white/15 hover:bg-white/20 rounded-full">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
          </button>
        </div>
      </CardHeader> 
      <CardContent>
        <p className="font-semibold">Stylish Chair</p>
        <CardDescription>
          Modern design perfect for your living room.
        </CardDescription>
      </CardContent>

      <CardFooter className="border-t">
        <Button className="w-full rounded-none">
          <Plus /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
