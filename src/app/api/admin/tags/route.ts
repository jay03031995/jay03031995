import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';
import slugify from 'slugify';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const tags = await prisma.tag.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name } = await request.json();
    const slug = slugify(name, { lower: true, strict: true });

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        tenantId: session.tenantId,
      },
    });
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
