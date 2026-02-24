import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';
import { Role } from '@prisma/client';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') as Role | null;

  try {
    const users = await prisma.user.findMany({
      where: {
        tenantId: session.tenantId,
        ...(role ? { role } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
