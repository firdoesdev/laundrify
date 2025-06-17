
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit3, Trash2, MoreVertical, Filter, ArrowUpDown } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderTableProps {
  orders: Order[];
}

// Helper function to apply conditional class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function OrderTable({ orders: initialOrders }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | null; direction: 'ascending' | 'descending' } | null>(null);

  const handleSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedOrders = React.useMemo(() => {
    let sortableItems = [...orders];
    if (sortConfig !== null && sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Ensure a[sortConfig.key] and b[sortConfig.key] are not undefined
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (valA === undefined || valB === undefined) return 0;

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [orders, sortConfig]);


  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteOrder = (orderId: string) => {
    // Placeholder for delete functionality
    console.log(`Delete order: ${orderId}`);
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const getSortIcon = (key: keyof Order) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <Input
          placeholder="Search by Order ID or Customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm h-10"
        />
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
            <SelectTrigger className="w-[180px] h-10">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                Order ID {getSortIcon('id')}
              </TableHead>
              <TableHead onClick={() => handleSort('customerName')} className="cursor-pointer">
                Customer {getSortIcon('customerName')}
              </TableHead>
              <TableHead onClick={() => handleSort('serviceType')} className="cursor-pointer">
                Service {getSortIcon('serviceType')}
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status {getSortIcon('status')}
              </TableHead>
              <TableHead onClick={() => handleSort('orderDate')} className="cursor-pointer hidden md:table-cell">
                Order Date {getSortIcon('orderDate')}
              </TableHead>
              <TableHead onClick={() => handleSort('totalAmount')} className="cursor-pointer text-right">
                Amount {getSortIcon('totalAmount')}
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-primary">
                    <Link href={`/orders/${order.id}`} className="hover:underline">{order.id}</Link>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.serviceType}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={order.status === 'Completed' ? 'default' : order.status === 'Pending' ? 'secondary' : 'outline'}
                      className={cn(
                        'text-xs',
                        order.status === 'Completed' && 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
                        order.status === 'Processing' && 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
                        order.status === 'Pending' && 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
                        order.status === 'Cancelled' && 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(order.orderDate), 'PP')}
                  </TableCell>
                  <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Order actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${order.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/edit/${order.id}`} className="flex items-center">
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Order
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive flex items-center">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
        {/* Basic pagination placeholder */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}

