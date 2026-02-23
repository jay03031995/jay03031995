import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';

export async function GET() {
  const tenantId = await getTenantId();

  try {
    const categories = await prisma.category.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { posts: { where: { post: { status: 'PUBLISHED' } } } }
        }
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
