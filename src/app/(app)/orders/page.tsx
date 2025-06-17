
"use client"; // Make this a client component to re-fetch/re-render sampleOrders
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/orders/order-table';
import { sampleOrders } from '@/lib/data'; // Import to pass potentially mutated array
import { PlusCircle } from 'lucide-react';
import React from 'react'; // Import React for potential future state management if needed

export default function OrdersPage() {
  // By re-importing sampleOrders here on each render, we should get the latest
  // version of the in-memory array if it has been mutated by other pages.
  const orders = [...sampleOrders]; // Create a new reference to trigger re-render if needed

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Order Management</h1>
        <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
          <Link href="/orders/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Order
          </Link>
        </Button>
      </div>
      {/* Pass the potentially updated orders to OrderTable */}
      <OrderTable orders={orders} />
    </div>
  );
}
