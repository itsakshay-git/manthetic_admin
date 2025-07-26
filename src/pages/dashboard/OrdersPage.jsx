import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@/hooks/orders/useOrders';
import OrderTable from '@/components/orders/OrderTable';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersPage() {
  const { orders, isLoading, isError } = useOrders();
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = order.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesPayment = paymentFilter ? order.payment_status === paymentFilter : true;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by customer name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />

        <Select onValueChange={(val) => setStatusFilter(val === "ALL" ? "" : val)}>
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="DELIVERED">DELIVERED</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setPaymentFilter(val === "ALL" ? "" : val)}>
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder="Filter by Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="FAILED">FAILED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p>Loading orders...</p>}
      {isError && <p>Something went wrong!</p>}
      {filteredOrders && (
        <OrderTable
          orders={filteredOrders}
          onUpdate={updateOrderStatus}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}
