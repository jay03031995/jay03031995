import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const versions = await prisma.postVersion.findMany({
      where: { postId: id },
      include: {
        author: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}
