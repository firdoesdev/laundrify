
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/orders/order-table';
import { sampleOrders } from '@/lib/data';
import { PlusCircle } from 'lucide-react';

export default function OrdersPage() {
  // In a real app, fetch orders here
  const orders = sampleOrders;

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
      <OrderTable orders={orders} />
    </div>
  );
}
