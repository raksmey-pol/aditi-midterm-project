"use client";

import React, { useState } from "react";
import { OrderItem } from "@/components/order-items";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Create an array of 12 mock items to test the "5 per page" limit
const MOCK_ORDERS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: i % 2 === 0 ? "Atomic Habits" : "Deep Work",
  description: "An easy & proven way to build good habits.",
  price: 19.99 + i,
  status: i === 0 ? "Shipped" : "Delivered",
  image:
    "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0",
}));

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Logic
  const totalPages = Math.ceil(MOCK_ORDERS.length / itemsPerPage);
  const currentOrders = MOCK_ORDERS.slice(
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

      <div className="space-y-4 mb-10">
        {currentOrders.map((order) => (
          <OrderItem key={order.id} {...order} />
        ))}
      </div>

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
    </div>
  );
}
