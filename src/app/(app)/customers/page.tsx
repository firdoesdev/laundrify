"use client"; // Make this a client component to re-fetch/re-render sampleCustomers

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CustomerTable } from '@/components/customers/customer-table';
import { useCustomers } from '@/hooks/useCustomers';
import { UserPlus } from 'lucide-react';
import React from 'react'; // Import React for potential future state management if needed


export default function CustomersPage() {
  const {
    customers,
    isLoading,
    isError,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch,
  } = useCustomers();

  if (isLoading) {
    return <div>Loading customers...</div>;
  }
  if (isError) {
    return <div>Error loading customers: {error?.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Customer Database</h1>
        <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/customers/add">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Customer
          </Link>
        </Button>
      </div>
      {/* Pass the fetched customers to CustomerTable */}
      <CustomerTable customers={customers || []} onDelete={deleteCustomer.mutate} />
    </div>
  );
}
