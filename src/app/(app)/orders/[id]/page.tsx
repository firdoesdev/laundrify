"use client";


import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as dateFnsLocaleId } from 'date-fns/locale';
import { DollarSign, Users, PackageIcon, CalendarIcon, Weight } from 'lucide-react';


export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const { orders, isLoading, deleteOrder } = useOrders();
  const order = Array.isArray(orders) ? orders.find((o) => o.id === id) : undefined;

  if (isLoading) return <div className="py-10 text-center text-muted-foreground">Loading...</div>;
  if (!order) return <div className="py-10 text-center text-muted-foreground">Order not found.</div>;

  // Calculate estimated price
  const pricePerUnit = order.serviceType?.price ?? 0;
  const estimatedPrice = order.weight ? order.weight * pricePerUnit : order.quantity ? order.quantity * pricePerUnit : 0;
  const isWeightBased = order.weight !== null && order.weight !== undefined;
  const isQuantityBased = order.quantity !== null && order.quantity !== undefined;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="p-8 space-y-8 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <PackageIcon className="h-7 w-7 text-primary" /> Order Detail
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            <Button onClick={() => router.push(`/orders/edit/${order.id}`)}>Edit</Button>
          </div>
        </div>

        {/* Order ID and Status */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-muted-foreground text-sm">Order ID: <span className="font-mono text-foreground">{order.id}</span></div>
          <div className="flex gap-2 items-center">
            <Badge variant={order.status === 'SELESAI' ? 'default' : order.status === 'DITERIMA' ? 'secondary' : 'outline'}
              className={
                order.status === 'SELESAI' ? 'bg-green-100 text-green-700 border-green-300' :
                order.status === 'DICUCI' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                order.status === 'DITERIMA' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                order.status === 'DIBATALKAN' ? 'bg-red-100 text-red-700 border-red-300' :
                order.status === 'SIAP_DIAAMBIL' ? 'bg-purple-100 text-purple-700 border-purple-300' : ''
              }
            >{order.status}</Badge>
            <Badge variant={order.paymentStatus === 'PAID' ? 'default' : order.paymentStatus === 'PENDING' ? 'secondary' : 'outline'}
              className={
                order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700 border-green-300' :
                order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                order.paymentStatus === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-300' : ''
              }
            >{order.paymentStatus}</Badge>
          </div>
        </div>

        {/* Customer & Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-primary" />
              {order.customer?.fullName || order.customerId}
            </div>
            <div className="text-muted-foreground text-sm">Phone: {order.customer?.phoneNumber || '-'}</div>
            <div className="text-muted-foreground text-sm">Email: {order.customer?.email || '-'}</div>
            <div className="text-muted-foreground text-sm">Address: {order.customer?.address || '-'}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <PackageIcon className="h-5 w-5 text-primary" />
              {order.serviceType?.name || order.serviceTypeId}
            </div>
            <div className="text-muted-foreground text-sm">Price per {isWeightBased ? 'kg' : isQuantityBased ? 'pcs' : 'unit'}: <span className="font-semibold">Rp {pricePerUnit.toLocaleString('id-ID')}</span></div>
            <div className="text-muted-foreground text-sm">Estimated Duration: {order.serviceType?.estimatedDuration ? `${order.serviceType.estimatedDuration} hr` : '-'}</div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-semibold">Order Date:</span>
              <span>{order.orderDate ? format(new Date(order.orderDate), 'PPPp', { locale: dateFnsLocaleId }) : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-semibold">Due Date:</span>
              <span>{order.dueDate ? format(new Date(order.dueDate), 'PPPp', { locale: dateFnsLocaleId }) : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Created At:</span>
              <span>{order.createdAt ? format(new Date(order.createdAt), 'PPPp', { locale: dateFnsLocaleId }) : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Updated At:</span>
              <span>{order.updatedAt ? format(new Date(order.updatedAt), 'PPPp', { locale: dateFnsLocaleId }) : '-'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-primary" />
              <span className="font-semibold">Weight:</span>
              <span>{order.weight ? `${order.weight.toLocaleString('id-ID')} kg` : '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <PackageIcon className="h-4 w-4 text-primary" />
              <span className="font-semibold">Quantity:</span>
              <span>{order.quantity ? `${order.quantity.toLocaleString('id-ID')} pcs` : '-'}</span>
            </div>
            {/* Perfume Selection for per_kg */}
            {isWeightBased && order.perfume && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Perfume:</span>
                <span>{order.perfume}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-lg mt-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Estimated Price:</span>
              <span className="font-bold text-primary">Rp {estimatedPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
