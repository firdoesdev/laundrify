import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Aggregate stats
  // Calculate revenue by summing (weight * price) or (quantity * price) for all orders
  const [totalOrders, totalCustomers, orders] = await Promise.all([
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.findMany({
      include: { serviceType: true },
    }),
  ]);

  let totalRevenue = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  for (const order of orders) {
    let orderAmount = 0;
    if (order.serviceType.pricingModel === 'RUPIAH_PER_KG' && order.weight && order.serviceType.price) {
      orderAmount = order.weight * order.serviceType.price;
    } else if (order.serviceType.pricingModel === 'RUPIAH_PER_ITEM' && order.quantity && order.serviceType.price) {
      orderAmount = order.quantity * order.serviceType.price;
    }
    totalRevenue += orderAmount;
    if (order.status === 'SELESAI') completedOrders++;
    if (order.status === 'DITERIMA' || order.status === 'DICUCI') pendingOrders++;
  }

  return NextResponse.json({
    totalOrders,
    totalCustomers,
    totalRevenue,
    completedOrders,
    pendingOrders,
  });
}
