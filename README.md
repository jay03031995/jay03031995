# Scalable Multi-Tenant Blog Platform

A production-ready, scalable blog platform similar in design and structure to blog.google. Built with Next.js 14, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- **Public Frontend**:
  - Featured hero section.
  - Responsive grid layout for latest posts.
  - Category and Tag filtering.
  - Global Search functionality.
  - Pagination.
  - SEO optimized (Dynamic Metadata, JSON-LD, Sitemap, Robots.txt).
  - High performance via ISR (Incremental Static Regeneration).

- **Admin CMS Dashboard**:
  - Secure JWT-based authentication.
  - Full CRUD for blog posts, categories, and tags.
  - Rich text editor (TipTap).
  - Draft/Publish workflow.
  - SEO fields (meta title, description).
  - Featured post management.

- **Multi-Tenancy**:
  - Data isolation per tenant.
  - Subdomain or header-based tenant identification.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Next.js API Routes, Node.js.
- **Database**: PostgreSQL with Prisma ORM.
- **Auth**: JWT (JSON Web Tokens) with Bcryptjs.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your `DATABASE_URL` and `JWT_SECRET`.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Admin Credentials (Default Seed)

- **Email**: `admin@example.com`
- **Password**: `admin123`

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components for Admin and Blog.
- `src/lib`: Shared utilities (Auth, Prisma, Tenant context).
- `prisma`: Database schema and seed scripts.

## Performance & SEO

- Uses `next/image` for automatic image optimization.
- Implements ISR for fast page loads and reduced server load.
- Dynamic Metadata and JSON-LD for rich search engine snippets.
- Automated sitemap and robots.txt generation.
