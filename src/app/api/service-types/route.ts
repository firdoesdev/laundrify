import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/service-types - List all service types
export async function GET() {
  const serviceTypes = await prisma.serviceType.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(serviceTypes);
}
