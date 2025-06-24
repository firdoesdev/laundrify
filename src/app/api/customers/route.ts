import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/customers - List all customers
export async function GET() {
  const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(customers);
}

// POST /api/customers - Create a new customer
export async function POST(req: NextRequest) {
  const data = await req.json();
  const customer = await prisma.customer.create({ data });
  return NextResponse.json(customer, { status: 201 });
}
