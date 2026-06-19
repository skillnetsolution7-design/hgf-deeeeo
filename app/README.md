# Izzy Signature - E-Commerce Platform

A complete production-grade e-commerce platform built with Next.js 15, Supabase PostgreSQL, Cloudinary, and real-time synchronization.

## Features

### Public Storefront
- **Homepage** with hero banner, features bar, featured products, product grid, testimonials, and trust banner
- **Product Detail Pages** with image gallery, WhatsApp order form, and related products
- **Live Search** with instant results
- **Contact Page** with business info and contact form
- **Mobile-first responsive design**
- **Meta Pixel** integration for Facebook Ads tracking
- **SEO optimized** with dynamic metadata, Open Graph, Twitter Cards, and structured data

### Admin Dashboard
- **Dashboard** with stats cards and recent orders
- **Products CRUD** with create, edit, delete, publish/unpublish, feature/unfeature
- **Image Manager** with drag & drop upload, Cloudinary integration, primary image selection
- **Orders Management** with status updates and filtering
- **Settings** for store configuration
- **Real-time updates** - storefront updates instantly when admin makes changes

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime
- **Image Storage**: Cloudinary
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  compare_price numeric(10,2),
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Product Images Table
```sql
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cloudinary_public_id text NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  address text NOT NULL,
  phone_1 text NOT NULL,
  phone_2 text,
  product_name text NOT NULL,
  product_price numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd izzy-signature
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema (see Database Schema section above) in the SQL Editor
3. Enable Row Level Security with the provided policies
4. Copy your project URL and anon key to `.env.local`

### 4. Set Up Cloudinary

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Create an unsigned upload preset
3. Copy your cloud name and upload preset to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### 6. Build for Production

```bash
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary unsigned upload preset |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `NEXT_PUBLIC_META_PIXEL_ID` | Facebook Meta Pixel ID |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number |

## Project Structure

```
izzy-signature/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── admin/            # Admin dashboard routes
│   │   ├── products/[slug]/  # Product detail pages
│   │   ├── contact/          # Contact page
│   │   ├── search/           # Search page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── store/            # Storefront components
│   │   │   ├── AnnouncementBar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   └── MetaPixel.tsx
│   │   ├── admin/            # Admin components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── ProductsView.tsx
│   │   │   ├── OrdersView.tsx
│   │   │   ├── SettingsView.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ImageManager.tsx
│   │   │   └── StatCard.tsx
│   │   └── Providers.tsx     # React Query + Toast provider
│   ├── hooks/
│   │   ├── useRealtime.ts    # Supabase Realtime subscriptions
│   │   └── use-toast.ts      # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client + server actions
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json
```

## WhatsApp Order Flow

1. Customer browses products and clicks "Order Now"
2. Customer fills the order form (Name, Address, Phone)
3. Order is saved to Supabase database
4. Meta Pixel Purchase event is tracked
5. Customer is redirected to WhatsApp with pre-filled order message
6. Business receives the order via WhatsApp

## Real-Time Synchronization

Supabase Realtime is configured to listen for changes on the `products` and `product_images` tables. When an admin makes changes:

1. **INSERT**: New product appears instantly on storefront
2. **UPDATE**: Product changes reflect immediately
3. **DELETE**: Product is removed from storefront

React Query caches are automatically invalidated, ensuring the storefront never shows stale data.

## License

This project is private and proprietary.
