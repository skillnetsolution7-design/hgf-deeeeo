# Netlify Deployment Guide for Izzy Signature E-Commerce Platform

## Overview
This guide will help you deploy the Izzy Signature e-commerce platform to Netlify. The project is a Next.js 15 application with TypeScript, Tailwind CSS, Supabase backend, and Cloudinary image storage.

## Pre-Deployment Checklist

### 1. Environment Variables
You need to configure the following environment variables in Netlify:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side) | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary unsigned upload preset | Yes |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Yes |
| `NEXT_PUBLIC_META_PIXEL_ID` | Facebook Meta Pixel ID | Optional |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number | Yes |

### 2. Database Setup
Ensure your Supabase database is set up with the required tables:
- `products` table
- `product_images` table  
- `orders` table

Run the SQL schema from the README.md file in your Supabase SQL Editor.

### 3. Cloudinary Setup
- Create a Cloudinary account at cloudinary.com
- Create an unsigned upload preset
- Configure the environment variables with your Cloudinary credentials

## Deployment Steps

### Step 1: Prepare Your Code
1. Ensure all code changes are committed to git
2. The `netlify.toml` file is already configured in the project root
3. The `.gitignore` file is set up to exclude unnecessary files

### Step 2: Connect to Netlify

#### Option A: Via Netlify Dashboard (Recommended)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select the `izzy-signature` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18` (automatically set by netlify.toml)

#### Option B: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize the site
cd app
netlify init

# Deploy
netlify deploy --prod
```

### Step 3: Configure Environment Variables
In the Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add all the required environment variables listed above
3. Make sure to include both public and server-side variables

### Step 4: Deploy
1. Push your code to your Git repository
2. Netlify will automatically detect the changes and start building
3. Monitor the build process in the Netlify dashboard
4. Once successful, your site will be live

## Post-Deployment Configuration

### 1. Test the Application
- Visit your deployed site
- Test the storefront functionality
- Test the admin panel (if you have authentication set up)
- Verify image uploads work properly
- Test the order flow and WhatsApp integration

### 2. Set Up Custom Domain (Optional)
- Go to Domain settings in Netlify
- Add your custom domain
- Update DNS settings according to Netlify instructions

### 3. Configure Analytics (Optional)
- Enable Netlify Analytics for site performance monitoring
- Set up Facebook Meta Pixel events tracking
- Configure any third-party analytics tools

## Troubleshooting

### Build Failures

#### "Module not found" errors
- Ensure all dependencies are installed: `npm install`
- Check that the Node version matches (18.x recommended)

#### Environment variable errors
- Verify all required environment variables are set in Netlify
- Check that variable names match exactly (case-sensitive)

#### Image optimization errors
- Verify Cloudinary credentials are correct
- Ensure the Cloudinary upload preset is configured as unsigned

### Runtime Issues

#### Database connection errors
- Verify Supabase URL and keys are correct
- Check Supabase project status (active/suspended)
- Ensure database tables exist and are properly structured

#### Image upload failures
- Check Cloudinary API credentials
- Verify the upload preset is unsigned
- Ensure CORS is configured properly in Cloudinary

## Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Next.js Configuration
The project uses Next.js 15 with App Router. Key configurations in `next.config.ts`:
- Image optimization with Cloudinary
- TypeScript and ESLint configured

## File References Verified

All file references have been checked and are correct:
- ✅ Import paths using `@/` alias are properly configured
- ✅ Component imports are resolving correctly
- ✅ Library dependencies are properly installed
- ✅ TypeScript path mappings are correct
- ✅ CSS imports are working properly

## Support

For issues specific to:
- **Netlify**: [Netlify Support](https://www.netlify.com/support/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **Cloudinary**: [Cloudinary Documentation](https://cloudinary.com/documentation)

## Deployment Checklist

- [ ] All environment variables configured in Netlify
- [ ] Supabase database tables created and populated
- [ ] Cloudinary account configured with upload preset
- [ ] Code pushed to Git repository
- [ ] Netlify site connected to Git repository
- [ ] Build process completes successfully
- [ ] Site deployed and accessible
- [ ] Storefront functionality tested
- [ ] Admin panel tested (if applicable)
- [ ] Image upload tested
- [ ] Order flow tested
- [ ] WhatsApp integration verified
- [ ] Custom domain configured (if applicable)
- [ ] Analytics configured (if applicable)

Your Izzy Signature e-commerce platform is now ready for Netlify deployment!