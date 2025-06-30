import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders/[id] - Get a single order
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      serviceType: true,
    },
  });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      customerId: data.customerId,
      serviceTypeId: data.serviceTypeId,
      items: data.items,
      weight: data.weight,
      quantity: data.quantity,
      perfume: data.perfume,
      orderDate: data.orderDate ? new Date(data.orderDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      paymentStatus: data.paymentStatus,
      status: data.status,
      receiptNumber: data.receiptNumber,
    },
    include: {
      customer: true,
      serviceType: true,
    },
  });
  return NextResponse.json(order);
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.order.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
