
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit3, Trash2, MoreVertical, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';


interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | 'valueForCalculation' | null; direction: 'ascending' | 'descending' } | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { deleteOrder } = useOrders();

  const handleSort = (key: keyof Order | 'valueForCalculation') => {
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
        let valA, valB;

        if (sortConfig.key === 'valueForCalculation') {
          valA = a.weight ?? a.quantity ?? 0;
          valB = b.weight ?? b.quantity ?? 0;
        } else {
          valA = a[sortConfig.key as keyof Order];
          valB = b[sortConfig.key as keyof Order];
        }
        
        if (valA === undefined || valB === undefined) return 0;
        
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
            if (sortConfig.key === 'orderDate' || sortConfig.key === 'dueDate') {
              const dateA = new Date(valA as string).getTime();
              const dateB = new Date(valB as string).getTime();
              return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
            }
            return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        
        const stringA = String(valA);
        const stringB = String(valB);
        if (stringA < stringB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (stringA > stringB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [orders, sortConfig]);



  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder.mutateAsync(orderId);
      toast({
        title: 'Order Deleted',
        description: `Order ${orderId} has been deleted.`,
      });
    } catch (err: any) {
      toast({
        title: 'Delete failed',
        description: err?.message || 'Failed to delete order.',
        variant: 'destructive',
      });
    }
  };

  const getSortIcon = (key: keyof Order | 'valueForCalculation') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
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
              <SelectItem value="DITERIMA">Diterima</SelectItem>
              <SelectItem value="DICUCI">Dicuci</SelectItem>
              <SelectItem value="SIAP_DIAAMBIL">Siap Diambil</SelectItem>
              <SelectItem value="SELESAI">Selesai</SelectItem>
              <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                <div className="flex items-center">Order ID {getSortIcon('id')}</div>
              </TableHead>
              <TableHead onClick={() => handleSort('customer')} className="cursor-pointer">
                <div className="flex items-center">Customer</div>
              </TableHead>
              <TableHead onClick={() => handleSort('serviceType')} className="cursor-pointer hidden sm:table-cell">
                 <div className="flex items-center">Service</div>
              </TableHead>
              <TableHead onClick={() => handleSort('valueForCalculation')} className="cursor-pointer hidden md:table-cell">
                 <div className="flex items-center">Weight/Qty</div>
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                <div className="flex items-center">Status {getSortIcon('status')}</div>
              </TableHead>
              <TableHead onClick={() => handleSort('orderDate')} className="cursor-pointer hidden lg:table-cell">
                <div className="flex items-center">Order Date {getSortIcon('orderDate')}</div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Est. Price</TableHead>
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
                  <TableCell>{order.customer?.fullName || '-'}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.serviceType?.name || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.weight ? `${order.weight.toLocaleString('id-ID')} kg` : order.quantity ? `${order.quantity.toLocaleString('id-ID')} item(s)` : '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-semibold text-primary">
                    {order.serviceType && (order.weight || order.quantity)
                      ? `Rp ${((order.weight ?? order.quantity ?? 0) * order.serviceType.price).toLocaleString('id-ID')}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.status === 'SELESAI' ? 'default' : order.status === 'DITERIMA' ? 'secondary' : 'outline'}
                      className={cn(
                        'text-xs whitespace-nowrap',
                        order.status === 'SELESAI' && 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
                        order.status === 'DICUCI' && 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
                        order.status === 'DITERIMA' && 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
                        order.status === 'DIBATALKAN' && 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200',
                        order.status === 'SIAP_DIAAMBIL' && 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(order.orderDate), 'PP', { locale: dateFnsLocaleId })}
                  </TableCell>
                  {/* <TableCell className="text-right">{'Rp ' + order.totalAmount.toLocaleString('id-ID')}</TableCell> */}
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
                          <Link href={`/orders/${order.id}`} className="flex items-center w-full">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/edit/${order.id}`} className="flex items-center w-full">
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Order
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive flex items-center w-full">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Showing {filteredOrders.length} of {orders.length} total orders in current view</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}
