
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle, ListChecks, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, Activity, Package } from 'lucide-react';
import type { Metric, Order } from '@/types';
import { sampleOrders } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Import the global cn utility

const metrics: Metric[] = [
  { title: 'Total Revenue', value: 'Rp 12.345.000', icon: DollarSign, change: '+5.2%', changeType: 'positive' },
  { title: 'Completed Orders', value: '215', icon: CheckCircle, change: '+10', changeType: 'positive' },
  { title: 'Pending Tasks', value: '12', icon: ListChecks, change: '-2', changeType: 'negative' },
  { title: 'Active Customers', value: '87', icon: Users, change: '+3 New', changeType: 'positive' },
];

const recentOrders = sampleOrders.slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metric.value}</div>
              {metric.change && (
                <p className={`text-xs mt-1 flex items-center ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.changeType === 'positive' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {metric.change} vs last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Recent Orders</CardTitle>
            <CardDescription>A quick look at the latest laundry orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-primary hover:underline">
                        <Link href={`/orders/${order.id}`}>{order.id}</Link>
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'Completed' ? 'default' : order.status === 'Pending' ? 'secondary' : 'outline'}
                          className={cn(
                            order.status === 'Completed' && 'bg-green-100 text-green-700 border-green-300',
                            order.status === 'Processing' && 'bg-blue-100 text-blue-700 border-blue-300',
                            order.status === 'Pending' && 'bg-yellow-100 text-yellow-700 border-yellow-300',
                            order.status === 'Cancelled' && 'bg-red-100 text-red-700 border-red-300'
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{'Rp ' + order.totalAmount.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="mx-auto h-12 w-12 mb-2" />
                <p>No recent orders found.</p>
              </div>
            )}
            <Button variant="outline" className="mt-4 w-full">
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full justify-start">
              <Link href="/orders/create">
                <Package className="mr-2 h-5 w-5" /> Create New Order
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full justify-start">
              <Link href="/customers/add">
                <Users className="mr-2 h-5 w-5" /> Add New Customer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full justify-start">
              <Link href="/reports">
                <Activity className="mr-2 h-5 w-5" /> View Reports
              </Link>
            </Button>
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Laundry service illustration" 
              width={600} 
              height={300} 
              className="rounded-md mt-4"
              data-ai-hint="laundry service" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
