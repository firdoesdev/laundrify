import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Fetch the 5 most recent orders, including customer and service type
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: true,
      serviceType: true,
    },
  });

  // Map and calculate the amount for each order
  const orders = recentOrders.map((order) => {
    let amount = 0;
    if (order.serviceType?.pricingModel === 'RUPIAH_PER_KG' && order.weight && order.serviceType.price) {
      amount = order.weight * order.serviceType.price;
    } else if (order.serviceType?.pricingModel === 'RUPIAH_PER_ITEM' && order.quantity && order.serviceType.price) {
      amount = order.quantity * order.serviceType.price;
    }
    return {
      id: order.id,
      customerName: order.customer?.fullName || '',
      createdAt: order.createdAt,
      amount,
      status: order.status,
    };
  });

  return NextResponse.json({ orders });
}
