import React from "react";
import { useCustomers, useDeleteCustomer } from "@/hooks/customer/useCustomer";
import CustomerTable from "@/components/customers/CustomerTable";

export default function CustomersPage() {
  const { data: customers, isLoading, isError } = useCustomers();
  const { mutate: deleteCustomer, isLoading: isDeleting } = useDeleteCustomer();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>

      {isLoading && <p>Loading customers...</p>}
      {isError && <p className="text-red-500">Failed to load customers.</p>}

      {customers && (
        <CustomerTable
          customers={customers}
          onDelete={deleteCustomer}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
