# Deployment Guide

Deploy VeloxPark to production hosting.

---

## Pre-Deployment Checklist

- [ ] All tests passed ([Testing Guide](./testing-guide.md))
- [ ] Firebase configuration correct
- [ ] UPI details in `public/config.json` updated
- [ ] Admin user created in Firebase Auth
- [ ] Database rules published
- [ ] No console errors in production build
- [ ] Mobile responsive tested

---

##firebase Deploy (Recommended)

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login

```bash
firebase login
```

### 3. Initialize

```bash
firebase init hosting
```

**Configuration:**
- Use existing project
- Public directory: `dist`
- Single-page app: **Yes**
- GitHub auto-deploy: Optional

### 4. Build & Deploy

```bash
npm run build
firebase deploy
```

**Your site will be live at:**
`https://your-project.web.app`

---

## Vercel Deploy

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
npm run build
vercel --prod
```

**Or use Vercel GitHub integration:**
1. Push code to GitHub
2. Import to Vercel
3. Auto-deploys on push

**Configuration:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

## Netlify Deploy

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Deploy

```bash
npm run build
netlify deploy --prod --dir=dist
```

**Or use Netlify UI:**
1. Push to GitHub
2. Connect repo in Netlify
3. Configure build settings

**Settings:**
- Build Command: `npm run build`
- Publish Directory: `dist`

---

## Environment Variables

For different environments (dev/prod):

**Option 1: Vite Environment Files**

Create `.env.production`:
```env
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_DATABASE_URL=your_prod_db_url
```

Update `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  // ...
};
```

**Option 2: Multiple Firebase Configs**

Create separate config files:
- `firebase.dev.js`
- `firebase.prod.js`

Import based on environment.

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Visit production URL
- [ ] Test user panel search
- [ ] Test admin login
- [ ] Test manual entry
- [ ] Check real-time updates
- [ ] Test on mobile device

### 2. Configure Custom Domain (Optional)

**Firebase Hosting:**
```bash
firebase hosting:channel:deploy live --expires 30d
```

**Vercel/Netlify:**
- Add custom domain in dashboard
- Update DNS records
- Enable HTTPS

### 3. Set Up Monitoring

**Firebase Console:**
- Enable Performance Monitoring
- Set up crash reporting
- Configure usage alerts

**Analytics (Optional):**
- Google Analytics
- Firebase Analytics
- Mixpanel

---

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-project-id
```

---

## Rollback Plan

**If deployment has issues:**

**Firebase:**
```bash
firebase hosting:rollback
```

**Vercel:**
- Go to Deployments
- Select previous deployment
- Click "Promote to Production"

**Netlify:**
- Go to Deploys
- Select working deploy
- Click "Publish deploy"

---

## Performance Optimization

### 1. Enable Compression

Most hosts enable automatically. Verify:
- Gzip/Brotli compression
- Minified assets
- Tree-shaking applied

### 2. CDN Configuration

Firebase/Vercel/Netlify provide CDN automatically.

### 3. Cache Headers

Configure for static assets:
```
Cache-Control: public, max-age=31536000, immutable
```

---

## Security

- [ ] HTTPS enabled (automatic on most hosts)
- [ ] Firebase security rules published
- [ ] No API keys exposed in client code
- [ ] CORS configured if needed

---

## Cost Estimation

### Firebase (Spark Plan - Free)
- Realtime Database: 1GB storage, 10GB/month download
- Hosting: 10GB storage, 360MB/day bandwidth
- Auth: Unlimited

### Firebase (Blaze Plan - Pay as you go)
- After free tier limits
- ~$5-25/month for small parking lot
- ~$50-100/month for medium lot

### Vercel/Netlify
- Free tier sufficient for most use cases
- Pro plans: $20-40/month

---

**Deployment Complete!** 🚀

Your VeloxPark is now live!
