"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { OrderItem } from "@/lib/types/order";

interface LastOrder {
  orderId: string;
  items: OrderItem[];
  address: {
    label: string;
    recipientName: string;
    phoneNumber: string;
    street1: string;
    street2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: {
    name: string;
    days: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  date: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<LastOrder | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const data = sessionStorage.getItem("lastOrder");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const handleDownloadInvoice = () => {
    if (!order) return;

    const date = new Date(order.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const itemRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${item.productName}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">$${Number(item.price).toFixed(2)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">$${(Number(item.price) * item.quantity).toFixed(2)}</td>
        </tr>`,
      )
      .join("");

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice - MyStore</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:Arial,sans-serif; color:#1a1a1a; padding:48px; font-size:14px; }
            .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; }
            .logo { font-size:24px; font-weight:bold; letter-spacing:-1px; }
            .invoice-label { text-align:right; }
            .invoice-label h2 { font-size:28px; margin-bottom:4px; }
            .invoice-label p { color:#666; font-size:13px; }
            .divider { border:none; border-top:2px solid #1a1a1a; margin:24px 0; }
            .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-bottom:40px; }
            .info-block h4 { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:8px; }
            .info-block p { font-size:14px; line-height:1.8; }
            table { width:100%; border-collapse:collapse; margin-bottom:24px; }
            thead tr { background:#1a1a1a; color:white; }
            thead th { padding:12px; text-align:left; font-size:12px; text-transform:uppercase; }
            thead th:nth-child(2) { text-align:center; }
            thead th:nth-child(3), thead th:nth-child(4) { text-align:right; }
            .totals { margin-left:auto; width:260px; }
            .totals-row { display:flex; justify-content:space-between; padding:6px 0; color:#444; }
            .totals-total { display:flex; justify-content:space-between; padding:12px 0; font-size:16px; font-weight:bold; border-top:2px solid #1a1a1a; margin-top:4px; }
            .footer { margin-top:48px; text-align:center; color:#888; font-size:12px; }
            .badge { display:inline-block; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:600; margin-top:8px; }
            @media print { body { padding:24px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">MYSTORE<span style="color:#16a34a;">T</span></div>
            <div class="invoice-label">
              <h2>INVOICE</h2>
              <p>Date: ${date}</p>
              <p>Ref: #${order.orderId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <hr class="divider" />
          <div class="info-grid">
            <div class="info-block">
              <h4>Ship To</h4>
              <p><strong>${order.address.recipientName}</strong></p>
<p>${order.address.street1}</p>
${order.address.street2 ? `<p>${order.address.street2}</p>` : ""}
<p>${order.address.city}${order.address.state ? `, ${order.address.state}` : ""} ${order.address.zipCode}</p>
<p>${order.address.country}</p>
<p>${order.address.phoneNumber}</p>
            </div>
            <div class="info-block">
              <h4>Order Info</h4>
              <p><strong>Shipping:</strong> ${order.shippingMethod.name}</p>
              <p><strong>Delivery:</strong> ${order.shippingMethod.days}</p>
              <p><strong>Payment:</strong> Cash on Delivery</p>
              <span class="badge">✓ Order Confirmed</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div class="totals">
            <div class="totals-row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
            <div class="totals-row"><span>Shipping</span><span>${order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}</span></div>
            <div class="totals-row"><span>Tax (8%)</span><span>$${order.tax.toFixed(2)}</span></div>
            <div class="totals-total"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
          </div>
          <div class="footer">
            <p>Thank you for shopping with MyStore!</p>
            <p style="margin-top:4px;">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const getEstimatedDelivery = () => {
    if (!order) return "";
    // parse the min days from "5-7 days" → 7 days from now
    const daysText = order.shippingMethod.days; // "5-7 days" or "7-10 days"
    const maxDays = parseInt(daysText.split("-")[1]); // get the larger number
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + maxDays);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold mb-3">Order Placed!</h1>
      <p className="text-gray-500 mb-8">Thank you for your order.</p>

      {order && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left">
          <p className="text-sm text-green-800 font-medium mb-1">
            📦 Estimated Delivery
          </p>
          <p className="text-sm text-green-700">By {getEstimatedDelivery()}</p>
          <p className="text-xs text-green-600 mt-1">
            via {order.shippingMethod.name}
          </p>
        </div>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
        <p className="text-sm text-amber-800 font-medium mb-1">
          Cash on Delivery
        </p>
        <p className="text-sm text-amber-700">
          Please prepare the exact payment amount when your order arrives.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {order && (
          <button
            onClick={handleDownloadInvoice}
            className="w-full border-2 border-black text-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition"
          >
            🧾 Download Invoice
          </button>
        )}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => router.push("buyer/orders")}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          View My Orders
        </button>
      </div>
    </main>
  );
}
