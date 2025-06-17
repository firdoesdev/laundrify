
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Package, User, CalendarDays, Tag, Weight, Sparkles, DollarSign, AlertTriangle, PackageIcon } from 'lucide-react';
import { sampleOrders, sampleServiceTypes } from '@/lib/data';
import type { Order, ServiceType } from '@/types';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [serviceTypeDetail, setServiceTypeDetail] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      const foundOrder = sampleOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        const foundServiceType = sampleServiceTypes.find(st => st.name === foundOrder.serviceType);
        setServiceTypeDetail(foundServiceType || null);
      }
      setIsLoading(false);
    }
  }, [orderId]);

  const handleDeleteOrder = () => {
    if (!order) return;
    const index = sampleOrders.findIndex(o => o.id === order.id);
    if (index > -1) {
      sampleOrders.splice(index, 1);
      toast({
        title: 'Order Deleted',
        description: `Order ${order.id} has been successfully deleted.`,
      });
      router.push('/orders');
      router.refresh();
    } else {
      toast({
        title: 'Error Deleting Order',
        description: 'Order not found or already deleted.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order with ID "{orderId}" could not be found.</p>
        <Button asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Order Details: {order.id}</h1>
        <Button variant="outline" onClick={() => router.push('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-7 w-7 text-primary" />
            Order Summary
          </CardTitle>
          <CardDescription>
            Status: <span className={`font-semibold ${
              order.status === 'Completed' ? 'text-green-600' :
              order.status === 'Processing' ? 'text-blue-600' :
              order.status === 'Pending' ? 'text-yellow-600' :
              order.status === 'Cancelled' ? 'text-red-600' : 'text-foreground'
            }`}>{order.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div className="flex items-center">
            <User className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Customer Name</p>
              <p className="text-foreground text-base">{order.customerName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Tag className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Customer ID</p>
              <p className="text-foreground text-base">{order.customerId}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Package className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Service Type</p>
              <p className="text-foreground text-base">{order.serviceType}</p>
            </div>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Order Date</p>
              <p className="text-foreground text-base">{format(new Date(order.orderDate), 'PPP', { locale: dateFnsLocaleId })}</p>
            </div>
          </div>
          {order.dueDate && (
            <div className="flex items-center">
              <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Due Date</p>
                <p className="text-foreground text-base">{format(new Date(order.dueDate), 'PPP', { locale: dateFnsLocaleId })}</p>
              </div>
            </div>
          )}
          
          {serviceTypeDetail?.pricingModel === 'per_kg' && order.weightInKg !== undefined && (
            <div className="flex items-center">
              <Weight className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Weight</p>
                <p className="text-foreground text-base">{order.weightInKg.toLocaleString('id-ID')} kg</p>
              </div>
            </div>
          )}
          {serviceTypeDetail?.pricingModel === 'per_item' && order.quantity !== undefined && (
            <div className="flex items-center">
              <PackageIcon className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Quantity</p>
                <p className="text-foreground text-base">{order.quantity.toLocaleString('id-ID')} item(s)</p>
              </div>
            </div>
          )}

          {serviceTypeDetail?.pricingModel === 'per_kg' && order.perfume && (
            <div className="flex items-center">
              <Sparkles className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground">Perfume</p>
                <p className="text-foreground text-base">{order.perfume}</p>
              </div>
            </div>
          )}

          <div className="flex items-center md:col-span-2">
            <DollarSign className="mr-3 h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-muted-foreground">Total Amount</p>
              <p className="text-foreground text-xl font-semibold">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" asChild>
            <Link href={`/orders/edit/${order.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Order
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the order
                  <span className="font-semibold"> {order.id}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteOrder} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
