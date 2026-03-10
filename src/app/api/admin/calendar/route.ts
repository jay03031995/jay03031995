import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  try {
    const where: any = { tenantId: session.tenantId };
    if (dateStr) {
      const date = new Date(dateStr);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    const entries = await prisma.contentCalendar.findMany({
      where,
      include: {
        client: {
          include: { editor: { select: { name: true } } }
        }
      },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, videoTopic, platform, clientId } = body;

    const entry = await prisma.contentCalendar.create({
      data: {
        date: new Date(date),
        videoTopic,
        platform,
        clientId,
        tenantId: session.tenantId,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create calendar entry' }, { status: 500 });
  }
}
