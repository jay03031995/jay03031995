import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';
import Navbar from '@/components/blog/Navbar';
import Image from 'next/image';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tenantId = await getTenantId();

  const post = await prisma.post.findFirst({
    where: { slug, tenantId, status: 'PUBLISHED' },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.metaTitle || `${post.title} | The Blog`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenantId = await getTenantId();

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

  if (!post) notFound();

  const readingTime = calculateReadingTime(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    description: post.excerpt,
  };

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
    include: {
      author: { select: { name: true } },
      categories: { include: { category: true } },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            {post.categories.map((c) => (
              <span key={c.categoryId} className="text-sm font-bold uppercase tracking-wider text-blue-600">
                {c.category.name}
              </span>
            ))}
          </div>
          <h1 className="mb-8 text-4xl font-bold text-gray-900 lg:text-5xl lg:leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-col items-center gap-4 text-gray-500 md:flex-row md:justify-center">
            <span className="font-medium text-gray-900">{post.author.name}</span>
            <span className="hidden md:block">•</span>
            <span>{formatDate(post.publishedAt!)}</span>
            <span className="hidden md:block">•</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {post.featuredImage && (
          <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg prose-blue mx-auto max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 flex flex-wrap gap-2 border-t pt-8">
          {post.tags.map((t) => (
            <span key={t.tagId} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              #{t.tag.name}
            </span>
          ))}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-bold text-gray-900">Related Stories</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} The Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
