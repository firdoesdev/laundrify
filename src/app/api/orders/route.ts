import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders - List all orders
export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      serviceType: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
  const data = await req.json();
  // Explicitly pick fields to avoid extra/missing fields
  // Defensive: ensure required fields
  if (!data.customerId || !data.serviceTypeId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const order = await prisma.order.create({
    data: {
      customerId: data.customerId,
      serviceTypeId: data.serviceTypeId,
      items: data.items,
      weight: data.weight !== undefined && data.weight !== '' ? Number(data.weight) : undefined,
      quantity: data.quantity !== undefined && data.quantity !== '' ? Number(data.quantity) : undefined,
      perfume: data.perfume,
      orderDate: data.orderDate ? new Date(data.orderDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
      paymentStatus: data.paymentStatus || 'PENDING',
      status: data.status || 'DITERIMA',
      receiptNumber: data.receiptNumber,
    },
    include: {
      customer: true,
      serviceType: true,
    },
  });
  return NextResponse.json(order, { status: 201 });
}
