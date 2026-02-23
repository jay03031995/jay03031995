import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const tenantId = await getTenantId();
  const { slug } = await params;

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        tenantId,
        status: 'PUBLISHED',
      },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Fetch related posts (same category)
    const relatedPosts = await prisma.post.findMany({
      where: {
        tenantId,
        status: 'PUBLISHED',
        id: { not: post.id },
        categories: {
          some: {
            categoryId: {
              in: post.categories.map((c) => c.categoryId),
            },
          },
        },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
