"use client";

// ...existing code for the dashboard UI (cards, metrics, recent orders, quick actions)...
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle, ListChecks, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, Activity, Package } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import * as RechartsPrimitive from 'recharts';
// Remove Metric import, define locally for dashboard mock
// import { sampleOrders } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';


type Metric = {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
};


import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentOrders, fetchOrderTrends, fetchTopCustomers } from '@/services/dashboardService';


export default function DashboardPage() {
  // Fetch real stats for metrics
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  // Fetch recent orders from API
  const { data: recentOrdersData } = useQuery({
    queryKey: ['dashboard-recent-orders'],
    queryFn: fetchRecentOrders,
  });
  const recentOrders = recentOrdersData?.orders ?? [];

  // Fetch order trends for chart
  const { data: orderTrends } = useQuery({
    queryKey: ['dashboard-order-trends'],
    queryFn: fetchOrderTrends,
  });

  // Fetch top customers for leaderboard
  const { data: topCustomers } = useQuery({
    queryKey: ['dashboard-top-customers'],
    queryFn: fetchTopCustomers,
  });

  const metrics: Metric[] = [
    { title: 'Total Revenue', value: 'Rp ' + (stats?.totalRevenue?.toLocaleString('id-ID') ?? '0'), icon: DollarSign, change: '+5.2%', changeType: 'positive' },
    { title: 'Completed Orders', value: stats?.completedOrders?.toString() ?? '0', icon: CheckCircle, change: '+10', changeType: 'positive' },
    { title: 'Pending Tasks', value: stats?.pendingOrders?.toString() ?? '0', icon: ListChecks, change: '-2', changeType: 'negative' },
    { title: 'Active Customers', value: stats?.totalCustomers?.toString() ?? '0', icon: Users, change: '+3 New', changeType: 'positive' },
  ];

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
                <p className={cn(
                    "text-xs mt-1 flex items-center",
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {metric.changeType === 'positive' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {metric.change} vs last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Trends Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Order Trends</CardTitle>
            <CardDescription>Orders per day (last 14 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {orderTrends && orderTrends.length > 0 ? (
              <div className="w-full h-96">
                {/* Chart: orders per day */}
                <ChartContainer config={{ count: { color: '#2563eb', label: 'Orders' } }}>
                  <RechartsPrimitive.LineChart data={orderTrends} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                    <RechartsPrimitive.XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <RechartsPrimitive.YAxis tick={{ fontSize: 12 }} />
                    <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                    <RechartsPrimitive.Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </RechartsPrimitive.LineChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No trend data.</div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers Leaderboard */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Top Customers</CardTitle>
            <CardDescription>Most valuable customers (by revenue)</CardDescription>
          </CardHeader>
          <CardContent>
            {topCustomers && topCustomers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.slice(0, 3).map((customer: any) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.fullName}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell className="text-right">{'Rp ' + (customer.totalSpent ?? 0).toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No customer data.</div>
            )}
          </CardContent>
        </Card>
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
                  {recentOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-primary hover:underline">
                        <Link href={`/orders/${order.id}`}>{order.id}</Link>
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'SELESAI' ? 'default' : order.status === 'DITERIMA' ? 'secondary' : 'outline'}
                          className={cn(
                            'text-xs whitespace-nowrap',
                            order.status === 'SELESAI' && 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
                            order.status === 'DICUCI' && 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
                            order.status === 'DITERIMA' && 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
                            order.status === 'DIBATALKAN' && 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{'Rp ' + (order.amount ?? 0).toLocaleString('id-ID')}</TableCell>
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
            <Button variant="outline" className="mt-4 w-full shadow-sm hover:shadow-md transition-shadow">
              <Link href="/orders" className="w-full text-center">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full justify-start shadow-md hover:shadow-lg transition-shadow">
              <Link href="/orders/create">
                <Package className="mr-2 h-5 w-5" /> Create New Order
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full justify-start shadow-sm hover:shadow-md transition-shadow">
              <Link href="/customers/add">
                <Users className="mr-2 h-5 w-5" /> Add New Customer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full justify-start shadow-sm hover:shadow-md transition-shadow">
              <Link href="/reports">
                <Activity className="mr-2 h-5 w-5" /> View Reports
              </Link>
            </Button>
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="Laundry service illustration" 
              width={600} 
              height={300} 
              className="rounded-md mt-4 shadow-md"
              data-ai-hint="laundry service" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
