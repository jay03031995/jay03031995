import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    publishedAt: string | Date | null;
    author: { name: string | null } | null;
    categories: Array<{ category: { name: string; slug: string } }>;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const category = post.categories?.[0]?.category;

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-xl border">
        <div className="relative aspect-video overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          {category && (
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-blue-600">
              {category.name}
            </span>
          )}
          <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
            <span>{post.author?.name}</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
