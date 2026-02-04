// components/account/OrderItem.tsx
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type OrderItemProps = {
  image: string;
  title: string;
  description: string;
  price: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
};

export function OrderItem({
  image,
  title,
  description,
  price,
  status,
}: OrderItemProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mt-4">
        {/* Product Image */}
        <div className="relative h-20 w-20  flex-shrink-0 overflow-hidden rounded-md border">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 justify-between gap-4">
          <div className="space-y-1">
            <p className="font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-sm font-semibold">${price.toFixed(2)}</p>
          </div>

          {/* Status */}
          <div className="flex items-start">
            <Badge variant={statusVariant(status)}>{status}</Badge>
          </div>
        </div>
      </div>

      <Separator />
    </div>
  );
}

function statusVariant(status: OrderItemProps["status"]) {
  switch (status) {
    case "Delivered":
      return "default";
    case "Shipped":
      return "secondary";
    case "Pending":
      return "outline";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
}
