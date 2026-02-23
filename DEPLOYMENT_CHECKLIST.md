# ✅ Deployment Checklist

## Pre-Deployment

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Build completes successfully (`npm run build`)
- [ ] `.env.local` not committed to git
- [ ] `.gitignore` includes `.env*` files

## GitHub Setup

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Repository is private (if desired)
- [ ] README.md is up to date

## Turso Database

- [ ] Create Turso account at [turso.tech](https://turso.tech)
- [ ] Install Turso CLI (`brew install tursodatabase/brew/turso`)
- [ ] Login to Turso (`turso auth login`)
- [ ] Create database (`turso db create usfin`)
- [ ] Get database URL (`turso db show usfin --url`)
- [ ] Create auth token (`turso db tokens create usfin`)
- [ ] Save URL and token securely

## Vercel Deployment

- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Configure project (Next.js, default settings)
- [ ] Add environment variables:
  - [ ] `TURSO_DATABASE_URL`
  - [ ] `TURSO_AUTH_TOKEN`
  - [ ] `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`)
  - [ ] `NEXT_PUBLIC_APP_URL` (update after deployment)
- [ ] Deploy project
- [ ] Wait for build to complete
- [ ] Note production URL

## Database Setup

- [ ] Update `.env.local` with Turso credentials
- [ ] Run `npm run db:push` to push schema
- [ ] Run `npm run db:seed` to seed categories
- [ ] Run `npm run db:create-demo-users` to create users
- [ ] Verify data in Turso dashboard

## Post-Deployment

- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel
- [ ] Redeploy to apply changes
- [ ] Visit production URL
- [ ] Test sign-in with demo accounts
- [ ] Test all major features:
  - [ ] Dashboard loads
  - [ ] Add transaction works
  - [ ] Wallet transfer works
  - [ ] Budgets page works
  - [ ] Goals page works
  - [ ] Categories page works
  - [ ] Debts page works
  - [ ] Recurring page works
  - [ ] Reports page works
  - [ ] Profile page works
  - [ ] Theme toggle works
  - [ ] Export CSV works

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Enable Vercel Analytics
- [ ] Enable Vercel Speed Insights
- [ ] Set up error tracking (Sentry)
- [ ] Configure automatic database backups
- [ ] Set up monitoring (Uptime Robot)
- [ ] Add SSL certificate (automatic with Vercel)

## Security Checklist

- [ ] All environment variables set in Vercel
- [ ] No sensitive data in code
- [ ] `.env` files in `.gitignore`
- [ ] Strong `BETTER_AUTH_SECRET` generated
- [ ] Database auth token kept secret
- [ ] CORS configured correctly

## Performance Checklist

- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Database queries optimized
- [ ] Caching configured

## Final Steps

- [ ] Share production URL with team
- [ ] Document demo credentials
- [ ] Create user onboarding guide
- [ ] Plan next features/updates
- [ ] Celebrate! 🎉

---

## Quick Commands Reference

```bash
# Local Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run db:push          # Push schema to local DB
npm run db:seed          # Seed initial data
npm run db:create-demo-users  # Create demo users

# Production (with Turso)
export TURSO_DATABASE_URL=libsql://...
export TURSO_AUTH_TOKEN=...
npm run db:push          # Push schema to Turso
npm run db:seed          # Seed data to Turso
```

---

## Environment Variables Template

```env
# .env.production (DO NOT COMMIT)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token-here
BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies installed
- Clear cache and redeploy

### Database Connection Fails
- Verify Turso URL and token
- Check database is not paused
- Test connection locally first

### Authentication Issues
- Regenerate `BETTER_AUTH_SECRET`
- Clear browser cookies
- Check session configuration

---

**Ready to deploy? Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide!** 🚀
