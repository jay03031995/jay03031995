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
      name: 'DermaCare Corp',
      slug: 'default',
    },
  });

  // Create Users
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

  const dermatologist = await prisma.user.upsert({
    where: { email: 'dr.chen@example.com' },
    update: {},
    create: {
      email: 'dr.chen@example.com',
      name: 'Dr. Sarah Chen, MD',
      password: hashedPassword,
      role: 'REVIEWER',
      tenantId: tenant.id,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMlTTSpglFW1T1aaaF0EiKNBygmtBjar8AA7MiP6-jo4iU8otmHmhnJhKyPD04HIJQNkEVjboTqM_bIeAvdmt1ctyOh3DFicnnHIXIpTE0WoabZUh1BsG0gchwyyagGiin9scRDpy9dbZAuvXZkmI6dZxxeg_SVso_CkYipZaVKtCvuR6ETPcTBMmOWgfVg_9dLJsCavZl4lHz9GWpZ_jbFJaUwbz05mlK48vUSw_aXZJJyrF_qQKDCE-imUkmVygWpBqULpPujmXk',
    },
  });

  // Create Categories
  const haircare = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'haircare', tenantId: tenant.id } },
    update: {},
    create: { name: 'Haircare', slug: 'haircare', tenantId: tenant.id },
  });
  const ingredients = await prisma.category.upsert({
    where: { slug_tenantId: { slug: 'ingredients', tenantId: tenant.id } },
    update: {},
    create: { name: 'Ingredients', slug: 'ingredients', tenantId: tenant.id },
  });

  // Create Tags
  const psoriasis = await prisma.tag.upsert({
    where: { slug_tenantId: { slug: 'psoriasis', tenantId: tenant.id } },
    update: {},
    create: { name: 'Psoriasis', slug: 'psoriasis', tenantId: tenant.id },
  });

  // Create Sample Post
  await prisma.post.create({
    data: {
      title: 'Coal Tar for Haircare: Uses, Benefits, and Safety Profile',
      slug: 'coal-tar-haircare-uses-benefits-safety',
      excerpt: 'Coal tar has been used in dermatology for over a century for stubborn scalp conditions.',
      content: `
        <p class="lead">Coal tar has been used in dermatology for over a century. While its name might sound industrial, this byproduct of coal processing remains one of the most effective treatments for stubborn scalp conditions like psoriasis and seborrheic dermatitis.</p>
        <h2>What is Coal Tar?</h2>
        <p>Coal tar is a keratolytic agent. In simple terms, it works by slowing the rapid growth of skin cells and restoring the skin's appearance.</p>
        <div class="my-8 rounded-xl bg-blue-50 p-6 border border-blue-100">
          <h3 class="flex items-center gap-2 font-bold text-primary text-lg mb-2">Key Takeaways</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>FDA-approved for treating dandruff and psoriasis.</li>
            <li>Reduces DNA synthesis in skin cells.</li>
            <li>Available in 0.5% to 5% concentrations.</li>
          </ul>
        </div>
      `,
      featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT3hM601uT4HcJnG5I3CPNyMmDKh77rGz307sUN2rGxQ5eqoxnEkngqSt_CyxuSl1WrfuHb25vCNICNgXyYCSESWT-_tP4AXow4HJvk_jSP4rVgYZKTlIP1dDej5GfJymvv4zJrSCEGwFSL1Oq1Vhnna50bfprt6OAIbCmb_RjmrnsZLT5yfeyHp09-SkLZW0mmyZGOCsP7FoNinsBDxsR-q1vSgt0mvg_IVl1FYO4bqaObWqMl-ggVK82VCkLCXesdaAbaDMpwGl5',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      medicalReviewerId: dermatologist.id,
      verificationStatus: 'VERIFIED',
      tenantId: tenant.id,
      faqSchema: [
        { question: 'How often should I use coal tar products?', answer: 'Most dermatologists recommend 2-3 times per week initially.' },
        { question: 'Is coal tar safe for color-treated hair?', answer: 'It can cause temporary staining of light-colored hair.' }
      ],
      categories: { create: [{ categoryId: haircare.id }, { categoryId: ingredients.id }] },
      tags: { create: [{ tagId: psoriasis.id }] },
    },
  });

  // Create API Integration
  await prisma.apiIntegration.create({
    data: {
      name: 'Clinikally Products',
      serviceType: 'Inventory',
      apiKey: 'dc_live_xxxxxxxxxxxx2k94',
      status: true,
      tenantId: tenant.id,
      activities: {
        create: [
          { type: 'Sync Success', description: 'Updated 24 items successfully.' },
          { type: 'Connection Established', description: 'Integration was established.' }
        ]
      }
    }
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
