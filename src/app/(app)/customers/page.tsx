
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CustomerTable } from '@/components/customers/customer-table';
import { sampleCustomers } from '@/lib/data';
import { UserPlus } from 'lucide-react';

export default function CustomersPage() {
  // In a real app, fetch customers here
  const customers = sampleCustomers;

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
      <CustomerTable customers={customers} />
    </div>
  );
}
