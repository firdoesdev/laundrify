import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Top 5 customers by total spent
  // Join with ServiceType to get price per order
  const customers = await prisma.customer.findMany({
    take: 5,
    orderBy: [{ orders: { _count: 'desc' } }],
    include: {
      orders: {
        include: {
          serviceType: true,
        },
      },
    },
  });
  const result = customers.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    totalOrders: c.orders.length,
    totalSpent: c.orders.reduce((sum, o) => {
      // Calculate price based on pricing model
      if (o.serviceType.pricingModel === 'RUPIAH_PER_KG' && o.weight) {
        return sum + o.weight * o.serviceType.price;
      } else if (o.serviceType.pricingModel === 'RUPIAH_PER_ITEM' && o.quantity) {
        return sum + o.quantity * o.serviceType.price;
      }
      return sum;
    }, 0),
  }));
  return NextResponse.json(result);
}
