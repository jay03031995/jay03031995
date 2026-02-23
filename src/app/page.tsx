import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';
import Navbar from '@/components/blog/Navbar';
import BlogCard from '@/components/blog/BlogCard';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600; // ISR: 1 hour

export default async function HomePage() {
  const tenantId = await getTenantId();

  const [featuredPost, latestPosts] = await Promise.all([
    prisma.post.findFirst({
      where: { tenantId, status: 'PUBLISHED', isFeatured: true },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
      },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.post.findMany({
      where: { tenantId, status: 'PUBLISHED', isFeatured: false },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {featuredPost && (
          <section className="mb-16">
            <Link href={`/blog/${featuredPost.slug}`} className="group relative block overflow-hidden rounded-2xl bg-white shadow-lg lg:flex">
              <div className="relative aspect-video w-full lg:aspect-auto lg:w-1/2">
                {featuredPost.featuredImage && (
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                <span className="mb-4 inline-block text-sm font-bold uppercase tracking-wider text-blue-600">
                  Featured Post
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors lg:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="mb-6 text-lg text-gray-600 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900">{featuredPost.author?.name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(featuredPost.publishedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Latest Stories</h2>
            <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all posts →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} The Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
