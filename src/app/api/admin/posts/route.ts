import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';
import slugify from 'slugify';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const posts = await prisma.post.findMany({
      where: { tenantId: session.tenantId },
      include: {
        author: { select: { name: true, email: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, excerpt, featuredImage, isFeatured, status, metaTitle, metaDescription, categoryIds, tagIds } = body;

    const slug = slugify(title, { lower: true, strict: true });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        featuredImage,
        isFeatured: isFeatured || false,
        status: status || 'DRAFT',
        metaTitle,
        metaDescription,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: session.userId,
        tenantId: session.tenantId,
        categories: {
          create: categoryIds?.map((id: string) => ({ categoryId: id })) || [],
        },
        tags: {
          create: tagIds?.map((id: string) => ({ tagId: id })) || [],
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
