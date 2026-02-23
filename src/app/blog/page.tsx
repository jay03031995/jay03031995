import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';
import Navbar from '@/components/blog/Navbar';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/blog/Pagination';

export const revalidate = 3600;

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  const tenantId = await getTenantId();

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { tenantId, status: 'PUBLISHED' },
      include: {
        author: { select: { name: true } },
        categories: { include: { category: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { tenantId, status: 'PUBLISHED' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-4xl font-bold text-gray-900">All Stories</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/blog" />
      </main>
    </div>
  );
}
