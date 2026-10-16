"use client";

import { downloadCsv, toCsv } from "@/lib/csv";
import { etb, when } from "@/lib/format";

export default function ExportOrdersButton({ rows }) {
  function exportOrders() {
    const csvRows = rows.map((row) => ({
      order: `#${row.id.slice(0, 8)}`,
      customer: row.customer,
      location: row.city,
      status: row.status,
      total: etb(row.total),
      placed: when(row.date, { dateStyle: "medium", timeStyle: undefined }),
    }));

    downloadCsv(toCsv(csvRows, [
      { key: "order", label: "Order" },
      { key: "customer", label: "Customer" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
      { key: "total", label: "Total" },
      { key: "placed", label: "Placed" },
    ]), "addis-eats-orders.csv");
  }

  return (
    <button type="button" className="orders-export-btn" onClick={exportOrders} disabled={!rows.length}>
      Export CSV
    </button>
  );
}
