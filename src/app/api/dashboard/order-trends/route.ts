import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';

export async function GET() {
  // Last 14 days order count per day
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => subDays(today, 13 - i));
  const results = await Promise.all(
    days.map(async (date) => {
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const count = await prisma.order.count({
        where: { createdAt: { gte: start, lte: end } },
      });
      return { date: format(start, 'yyyy-MM-dd'), count };
    })
  );
  return NextResponse.json(results);
}
