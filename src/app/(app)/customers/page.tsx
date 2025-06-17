
"use client"; // Make this a client component to re-fetch/re-render sampleCustomers

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CustomerTable } from '@/components/customers/customer-table';
import { sampleCustomers } from '@/lib/data'; // Import to pass potentially mutated array
import { UserPlus } from 'lucide-react';
import React from 'react'; // Import React for potential future state management if needed


export default function CustomersPage() {
  // By re-importing sampleCustomers here on each render, we should get the latest
  // version of the in-memory array if it has been mutated by other pages.
  const customers = [...sampleCustomers]; // Create a new reference

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
      {/* Pass the potentially updated customers to CustomerTable */}
      <CustomerTable customers={customers} />
    </div>
  );
}
