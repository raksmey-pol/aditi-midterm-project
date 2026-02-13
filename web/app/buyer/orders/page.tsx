"use client";

import React, { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { OrderItem } from "@/components/order-items";
import { useMyOrders } from "@/hooks/useOrder";

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch real data from your backend
  const { data: orders, isLoading, isError } = useMyOrders();

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading your orders...
      </div>
    );
  }

  if (isError || !orders) {
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load orders. Please try again.
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-5 text-[32px] font-bold uppercase md:mb-6 md:text-[40px]">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground border rounded-lg border-dashed">
          You haven&apos;t placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4 mb-10">
          {currentOrders.map((order) => (
            <OrderItem
              key={order.id}
              orderId={order.id}
              title={`Order #${order.id.split("-")[0].toUpperCase()}`}
              description={`${order.items?.length || 0} items • ${new Date(order.createdAt).toLocaleDateString()}`}
              price={order.totalAmount}
              status={order.status || "PENDING"}
              image="https://cdn-icons-png.flaticon.com/128/1162/1162456.png"
            />
          ))}
        </div>
      )}

      {/* Your exact Pagination implementation */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className="cursor-pointer">
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
