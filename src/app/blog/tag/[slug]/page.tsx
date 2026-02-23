import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';
import Navbar from '@/components/blog/Navbar';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 3600;

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenantId = await getTenantId();

  const tag = await prisma.tag.findFirst({
    where: { slug, tenantId },
  });

  if (!tag) return <div>Tag not found</div>;

  const posts = await prisma.post.findMany({
    where: {
      tenantId,
      status: 'PUBLISHED',
      tags: {
        some: {
          tag: { slug },
        },
      },
    },
    include: {
      author: { select: { name: true } },
      categories: { include: { category: true } },
    },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-blue-600">Tag</span>
          <h1 className="text-4xl font-bold text-gray-900">#{tag.name}</h1>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
