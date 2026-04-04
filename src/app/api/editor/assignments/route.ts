import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const assignments = await prisma.contentCalendar.findMany({
      where: {
        tenantId: session.tenantId,
        client: { editorId: session.userId },
        status: { in: ['ASSIGNED', 'COMPLETED'] }
      },
      include: { client: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}
