# Vercel Deployment Guide for Izzy Signature E-Commerce Platform

## 💳 Why Switch from Netlify to Vercel?

Your Netlify team has run out of credits, which means:
- ❌ Production deploys are disabled
- ❌ Agent Runners are disabled  
- ⚠️ Sites may go offline

**Vercel is the perfect alternative** because:
- ✅ Built by the creators of Next.js
- ✅ Optimized for Next.js applications
- ✅ Generous free tier (100GB bandwidth/month)
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN and edge functions
- ✅ Zero configuration required for Next.js

## 🚀 Quick Start with Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up using your GitHub account
3. Follow the setup wizard

### Step 2: Import Your Project
1. Click "Add New..." → "Project"
2. Select your repository: `skillnetsolution7-design/hgf-deeeo`
3. Vercel will auto-detect it as a Next.js project

### Step 3: Configure Project Settings
Vercel will auto-detect most settings:

**Framework Settings:**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: Leave empty (Vercel will use the `vercel.json` config)
- **Build Command**: `cd app && npm run build` (from vercel.json)
- **Output Directory**: `app/.next` (from vercel.json)
- **Install Command**: `cd app && npm install` (from vercel.json)

### Step 4: Add Environment Variables
In Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_META_PIXEL_ID=1710517860088102
NEXT_PUBLIC_WHATSAPP_NUMBER=94784622453
```

### Step 5: Deploy
Click "Deploy" and wait for the build to complete (2-3 minutes)

## 📋 Vercel Configuration

Your project includes a `vercel.json` file in the repository root:

```json
{
  "buildCommand": "cd app && npm run build",
  "outputDirectory": "app/.next",
  "devCommand": "cd app && npm run dev",
  "installCommand": "cd app && npm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

**Configuration Details:**
- **Build Command**: Navigates to app directory and builds
- **Output Directory**: Points to the .next folder in app/
- **Regions**: `sin1` deploys to Singapore region (closer to Sri Lanka)
- **Framework**: Explicitly set to Next.js for optimal performance

## 🔧 Vercel vs Netlify Differences

### Advantages of Vercel:
- **Next.js Optimization**: Built by Next.js creators
- **Faster Builds**: Optimized build process
- **Better Performance**: Global edge network
- **Preview Deployments**: Automatic preview URLs for pull requests
- **Analytics**: Built-in performance analytics
- **Free Tier**: More generous than Netlify

### Configuration Changes:
- No `.nvmrc` needed (Vercel auto-detects Node version)
- No `netlify.toml` needed
- Environment variables managed in Vercel dashboard
- Automatic SSL certificates
- Automatic domain management

## 🌍 Setting Custom Domain

### Free Domain:
- Your site will be available at: `https://your-project.vercel.app`

### Custom Domain:
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `izzysignature.com`)
4. Update DNS records as instructed by Vercel
5. Vercel will automatically provide SSL certificates

## 📊 Monitoring and Analytics

Vercel provides built-in:
- **Real-time Analytics**: Page views, visitors, geography
- **Performance Metrics**: Core Web Vitals, Lighthouse scores
- **Build Logs**: Detailed build information
- **Deployment Logs**: Runtime error tracking
- **Speed Insights**: Performance optimization suggestions

## 🔄 Continuous Deployment

Vercel automatically:
- ✅ Triggers builds on git push
- ✅ Creates preview deployments for pull requests
- ✅ Automatically rolls back on deployment failures
- ✅ Provides instant rollback to previous deployments

## 🚦 Deployment Checklist

Before deploying to Vercel:

- [x] Project structure fixed (app/ subdirectory)
- [x] vercel.json configuration added
- [x] Environment variables documented
- [ ] Supabase database set up
- [ ] Cloudinary account configured
- [ ] Environment variables added to Vercel dashboard
- [ ] Custom domain configured (optional)
- [ ] Production build tested

## 🛠️ Troubleshooting

### Build Fails:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are set
3. Ensure Node version compatibility (Vercel uses latest)
4. Check for missing dependencies

### Environment Variables Not Working:
1. Ensure variables start with `NEXT_PUBLIC_` for client-side access
2. Check variable names match exactly
3. Redeploy after adding environment variables

### Images Not Loading:
1. Verify Cloudinary credentials are correct
2. Check Next.js image optimization configuration
3. Ensure remote patterns are configured in next.config.ts

## 🎯 Next Steps

1. **Create Vercel Account**: https://vercel.com
2. **Import Repository**: Select `hgf-deeeo` from GitHub
3. **Configure Environment Variables**: Copy from this guide
4. **Deploy**: Click deploy button
5. **Test**: Visit your Vercel URL
6. **Custom Domain**: Add custom domain if desired

## 📞 Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Community Forum**: https://vercel.com/forum

Your project is now ready for Vercel deployment! The configuration has been optimized for Vercel's platform and should provide better performance than Netlify for your Next.js e-commerce application.