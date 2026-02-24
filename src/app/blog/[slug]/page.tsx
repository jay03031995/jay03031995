import { prisma } from '@/lib/prisma';
import { getTenantId } from '@/lib/tenant';
import Navbar from '@/components/blog/Navbar';
import Image from 'next/image';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tenantId = await getTenantId();

  const post = await prisma.post.findFirst({
    where: { slug, tenantId, status: 'PUBLISHED' },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.metaTitle || `${post.title} | DermaCare`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenantId = await getTenantId();

  const post = await prisma.post.findFirst({
    where: { slug, tenantId, status: 'PUBLISHED' },
    include: {
      author: true,
      medicalReviewer: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) notFound();

  const readingTime = calculateReadingTime(post.content);

  const faqItems = (post.faqSchema as { question: string; answer: string }[]) || [];

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-slate-100 min-h-screen flex flex-col font-display antialiased">
      <Navbar />

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-10 lg:py-12">
          {/* Breadcrumbs */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <Link className="hover:text-primary hover:underline" href="/">Home</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link className="hover:text-primary hover:underline" href="/blog">Journal</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="font-medium text-text-main dark:text-slate-200">Ingredients</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Article Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                {post.verificationStatus === 'VERIFIED' && (
                  <div className="inline-flex w-fit items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    Medically Reviewed
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-text-main dark:text-white">
                  {post.title}
                </h1>

                {/* Author & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-border-light dark:border-border-dark py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-white dark:ring-surface-dark shadow-md">
                      <Image
                        src={post.author.image || "https://lh3.googleusercontent.com/a/default-user"}
                        alt={post.author.name || "Author"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-white"></div>
                    </div>
                    <div>
                      <p className="font-bold text-text-main dark:text-white">{post.author.name}</p>
                      <p className="text-sm text-text-muted">{post.author.role === 'REVIEWER' ? 'Board Certified Dermatologist' : 'Medical Editor'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-text-muted sm:text-right">
                    <div className="flex items-center gap-2 sm:justify-end">
                      <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                      <span className="font-medium text-text-main dark:text-slate-200">Fact Checked</span>
                    </div>
                    <p>Updated {formatDate(post.updatedAt)} • {readingTime} min read</p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-border-light dark:ring-border-dark">
                  <div className="aspect-video relative w-full">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  </div>
                </div>
              )}

              {/* Article Body */}
              <div
                className="prose prose-lg prose-slate dark:prose-invert max-w-none text-text-main/80 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-8 border-t border-border-light dark:border-border-dark">
                {post.tags.map(t => (
                  <span key={t.tagId} className="px-3 py-1 rounded-full bg-background-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm font-medium text-text-muted hover:text-primary cursor-pointer">
                    #{t.tag.name}
                  </span>
                ))}
              </div>

              {/* FAQ Section */}
              {faqItems.length > 0 && (
                <section className="mt-12 pt-12 border-t border-border-light dark:border-border-dark">
                  <h2 className="text-2xl font-bold text-text-main dark:text-white mb-8">Frequently Asked Questions</h2>
                  <div className="space-y-8">
                    {faqItems.map((item, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">{item.question}</h3>
                        <p className="text-text-main/80 dark:text-slate-300">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">On this page</h3>
                <nav className="flex flex-col gap-3 text-sm">
                  <a className="border-l-2 border-primary pl-3 font-medium text-primary" href="#">Introduction</a>
                  <a className="border-l-2 border-transparent pl-3 text-text-muted hover:border-border-light hover:text-text-main transition-all" href="#">Mechanism of Action</a>
                  <a className="border-l-2 border-transparent pl-3 text-text-muted hover:border-border-light hover:text-text-main transition-all" href="#">Safety & Side Effects</a>
                </nav>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-lg">
                <div className="relative z-10">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <span className="material-symbols-outlined text-2xl">calendar_month</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Personalized Haircare Plan</h3>
                  <p className="mb-6 text-blue-100 text-sm">
                    Not sure if this treatment is right for you? Book a virtual consultation today.
                  </p>
                  <button className="w-full rounded-lg bg-white py-3 text-sm font-bold text-primary hover:bg-blue-50 transition-colors shadow-sm">
                    Book Consultation
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border-light dark:border-border-dark pt-8 sm:flex-row">
            <p className="text-xs text-text-muted">© {new Date().getFullYear()} DermaCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
