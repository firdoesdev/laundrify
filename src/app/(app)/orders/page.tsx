

"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/orders/order-table';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const { orders, isLoading, isError, error } = useOrders();

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
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading orders...</div>
      ) : isError ? (
        <div className="text-center py-10 text-destructive">{error instanceof Error ? error.message : 'Failed to load orders.'}</div>
      ) : (
        <OrderTable orders={orders ?? []} />
      )}
    </div>
  );
}
