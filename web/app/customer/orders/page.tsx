import { OrderItem } from "@/components/order-items";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-5 text-[32px] font-bold uppercase md:mb-6 md:text-[40px]">
        My Orders
      </h1>

      <OrderItem
        image="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0"
        title="Atomic Habits"
        description="An easy & proven way to build good habits."
        price={19.99}
        status="Delivered"
      />

      <OrderItem
        image="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0"
        title="Deep Work"
        description="Rules for focused success in a distracted world."
        price={24.5}
        status="Shipped"
      />
    </div>
  );
}
