# 🚀 UsFin - Production Deployment Guide

## Deploy to Vercel + Turso

This guide will help you deploy UsFin to production using Vercel (hosting) and Turso (cloud database).

---

## 📋 Prerequisites

1. **GitHub Account** - For pushing code
2. **Vercel Account** - Free tier available at [vercel.com](https://vercel.com)
3. **Turso Account** - Free tier available at [turso.tech](https://turso.tech)

---

## Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
cd /Users/yokster/Documents/dompetRobyLinda/familyfin
git init
git add .
git commit -m "Initial commit - UsFin app"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/usfin.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Turso Database

### 2.1 Install Turso CLI

```bash
# macOS
brew install tursodatabase/brew/turso

# Or using npm
npm install -g @libsql/turso
```

### 2.2 Create Turso Database

```bash
# Login to Turso
turso auth login

# Create database
turso db create usfin

# Get database URL
turso db show usfin --url
```

### 2.3 Create Auth Token

```bash
# Create token
turso db tokens create usfin
```

**Save these values:**
- Database URL: `libsql://your-db.turso.io`
- Auth Token: `your-token-here`

---

## Step 3: Update Environment Variables

Create `.env.production` file:

```env
# Turso Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# BetterAuth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-production-secret-key-here

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://usfin.vercel.app
```

**⚠️ IMPORTANT:**
- Never commit `.env.production` to GitHub
- Generate a strong secret key for `BETTER_AUTH_SECRET`
- Update `NEXT_PUBLIC_APP_URL` after deploying to Vercel

---

## Step 4: Deploy to Vercel

### 4.1 Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 4.2 Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
TURSO_DATABASE_URL = libsql://your-db.turso.io
TURSO_AUTH_TOKEN = your-auth-token-here
BETTER_AUTH_SECRET = your-production-secret-key
NEXT_PUBLIC_APP_URL = https://usfin.vercel.app
```

### 4.3 Deploy

Click "Deploy" and wait for the build to complete.

---

## Step 5: Push Database Schema to Turso

After deployment, push your schema to Turso:

```bash
# Install dependencies locally
npm install

# Update .env.local with Turso credentials
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Push schema to Turso
npm run db:push

# Seed initial data (categories, etc.)
npm run db:seed

# Create demo users
npm run db:create-demo-users
```

---

## Step 6: Update Vercel Deployment

After pushing schema:

```bash
# Commit and push changes
git add .
git commit -m "Update for production deployment"
git push origin main

# Vercel will auto-deploy
```

---

## Step 7: Test Production

1. **Visit your production URL:**
   - `https://usfin.vercel.app`

2. **Test authentication:**
   - Sign in with demo accounts
   - Email: `husband@familyfin.com` / `wife@familyfin.com`
   - Password: `password`

3. **Test all features:**
   - Dashboard
   - Transactions
   - Budgets
   - Goals
   - Categories
   - Debts
   - Recurring
   - Reports
   - Profile

---

## 🔧 Post-Deployment Configuration

### Update App URL

After first deployment, update `.env.production`:

```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Then push to trigger redeployment.

### Custom Domain (Optional)

1. Buy domain (e.g., from Namecheap, Google Domains)
2. In Vercel → Settings → Domains
3. Add your domain
4. Configure DNS records as instructed

### Enable Automatic Database Backups

In Turso dashboard:
1. Go to your database
2. Enable automatic backups
3. Set backup frequency (daily recommended)

---

## 📊 Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel dashboard:
- **Analytics** → Enable
- **Speed Insights** → Enable

### Turso Usage

Monitor in Turso dashboard:
- Database size
- Read/write operations
- Connection count

### Error Tracking

Consider adding:
- **Sentry** for error tracking
- **Logtail** for logging
- **Uptime Robot** for monitoring

---

## 🔐 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Vercel's environment variables
- ✅ Rotate secrets periodically

### 2. Database Security

- ✅ Use Turso auth tokens (not plain passwords)
- ✅ Enable SSL connections
- ✅ Restrict database access

### 3. Authentication

- ✅ Use strong passwords
- ✅ Enable email verification (optional)
- ✅ Implement rate limiting

---

## 📱 PWA Configuration

The app is already PWA-ready. To test:

1. Open production URL on mobile
2. Tap "Add to Home Screen"
3. App will install like native app

---

## 🎯 Production Checklist

- [ ] Code pushed to GitHub
- [ ] Turso database created
- [ ] Environment variables set in Vercel
- [ ] Database schema pushed to Turso
- [ ] Initial data seeded
- [ ] Demo users created
- [ ] Deployment successful
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error tracking set up

---

## 🆘 Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
git push
```

### Database Connection Fails

**Error:** `Cannot connect to database`
- Check Turso URL and token
- Ensure database is not paused
- Check Vercel environment variables

### Authentication Issues

**Error:** `Invalid session`
- Regenerate `BETTER_AUTH_SECRET`
- Clear browser cookies
- Redeploy to Vercel

---

## 📞 Support

### Vercel
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)

### Turso
- Docs: [docs.turso.tech](https://docs.turso.tech)
- Discord: [discord.gg/turso](https://discord.gg/turso)

### UsFin
- Check `README.md` for project-specific info
- Review `package.json` for available scripts

---

## 🎉 Congratulations!

Your UsFin app is now live in production! 🚀

**Share your app:**
- Production URL: `https://your-app.vercel.app`
- Demo credentials for testing

**Next Steps:**
- Add real users (not demo accounts)
- Set up regular backups
- Monitor usage and performance
- Gather user feedback
- Plan future features

Happy deploying! 🎊
