import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      id: 'cl00000000000000000000000',
      name: 'Default Tenant',
      slug: 'default',
    },
  });

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  // Create Categories
  const tech = await prisma.category.create({
    data: { name: 'Technology', slug: 'technology', tenantId: tenant.id },
  });
  await prisma.category.create({
    data: { name: 'Design', slug: 'design', tenantId: tenant.id },
  });

  // Create Tags
  const nextjs = await prisma.tag.create({
    data: { name: 'Next.js', slug: 'nextjs', tenantId: tenant.id },
  });
  const tailwind = await prisma.tag.create({
    data: { name: 'Tailwind CSS', slug: 'tailwind', tenantId: tenant.id },
  });

  // Create Sample Post
  await prisma.post.create({
    data: {
      title: 'Building a Scalable Blog with Next.js 14',
      slug: 'building-scalable-blog-nextjs-14',
      excerpt: 'Learn how to build a production-ready, multi-tenant blog platform using the latest web technologies.',
      content: `
        <h2>Introduction</h2>
        <p>In today's fast-paced digital world, performance and scalability are key to a successful blog.</p>
        <h2>Why Next.js?</h2>
        <p>Next.js provides excellent features like App Router, Server Components, and ISR which are perfect for content-heavy sites.</p>
        <h2>Database with Prisma</h2>
        <p>Prisma makes database management a breeze with its type-safe client and easy migrations.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000',
      isFeatured: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      tenantId: tenant.id,
      categories: {
        create: [{ categoryId: tech.id }],
      },
      tags: {
        create: [{ tagId: nextjs.id }, { tagId: tailwind.id }],
      },
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
