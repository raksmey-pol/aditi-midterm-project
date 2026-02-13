import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type OrderItemProps = {
  orderId: string; // Added so we know where to link
  image: string;
  title: string;
  description: string;
  price: number;
  status: string; // Changed to string to handle backend statuses
};

export function OrderItem({
  orderId,
  image,
  title,
  description,
  price,
  status,
}: OrderItemProps) {
  return (
    // Wrap your old layout in a Link to make it clickable
    <Link href={`/orders/${orderId}`} className="block group">
      <div className="space-y-4 rounded-lg transition-colors hover:bg-slate-50 p-2 -mx-2">
        <div className="flex gap-4 mt-2">
          {/* Product Image (Using standard img to avoid Next.js config errors with Flaticon) */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-slate-50 flex items-center justify-center p-3">
            <img
              src={image}
              alt={title}
              className="object-contain w-full h-full opacity-80"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-1 justify-between gap-4">
            <div className="space-y-1 mt-1">
              <p className="font-medium leading-none group-hover:text-blue-600 transition-colors">
                {title}
              </p>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="text-sm font-semibold">${price.toFixed(2)}</p>
            </div>

            {/* Status */}
            <div className="flex items-start mt-1">
              <Badge variant={statusVariant(status)}>{status}</Badge>
            </div>
          </div>
        </div>

        <Separator />
      </div>
    </Link>
  );
}

// Handles uppercase statuses from Spring Boot
function statusVariant(status: string) {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "default";
    case "SHIPPED":
      return "secondary";
    case "PENDING":
      return "outline";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}
