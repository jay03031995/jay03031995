import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/middleware';
import slugify from 'slugify';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const post = await prisma.post.findFirst({
      where: { id, tenantId: session.tenantId },
      include: {
        categories: { select: { categoryId: true } },
        tags: { select: { tagId: true } },
        medicalReviewer: { select: { id: true, name: true } },
      },
    });

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      featuredImage,
      isFeatured,
      status,
      metaTitle,
      metaDescription,
      categoryIds,
      tagIds,
      medicalReviewerId,
      verificationStatus,
      faqSchema
    } = body;

    const existingPost = await prisma.post.findFirst({
      where: { id, tenantId: session.tenantId },
    });

    if (!existingPost) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const slug = title ? slugify(title, { lower: true, strict: true }) : existingPost.slug;

    // Handle publishedAt logic
    let publishedAt = existingPost.publishedAt;
    if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      publishedAt = new Date();
    }

    // Create a new version before updating if content changed
    if (content !== existingPost.content || title !== existingPost.title) {
      await prisma.postVersion.create({
        data: {
          postId: existingPost.id,
          title: existingPost.title,
          content: existingPost.content,
          authorId: session.userId,
          version: `v${Date.now()}`, // Simple versioning for demo
        }
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        slug,
        featuredImage,
        isFeatured,
        status,
        metaTitle,
        metaDescription,
        publishedAt,
        medicalReviewerId,
        verificationStatus,
        faqSchema,
        categories: {
          deleteMany: {},
          create: categoryIds?.map((id: string) => ({ categoryId: id })) || [],
        },
        tags: {
          deleteMany: {},
          create: tagIds?.map((id: string) => ({ tagId: id })) || [],
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const post = await prisma.post.findFirst({
      where: { id, tenantId: session.tenantId },
    });

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
