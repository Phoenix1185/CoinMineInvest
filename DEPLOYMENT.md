# CryptoMine Pro - Deployment Guide

This guide provides step-by-step instructions for deploying CryptoMine Pro to production with frontend hosting on Vercel and backend hosting on Render or Koyeb.

## Overview

- **Frontend**: React app deployed to Vercel
- **Backend**: Node.js/Express API deployed to Render or Koyeb  
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Replit OAuth integration

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed locally
- Git repository with your code pushed to GitHub
- All deployment files are present (automatically included):
  - `vercel.json` - Vercel configuration
  - `.env.example` - Environment variable documentation
  - `package.json` - Build scripts
- Accounts created on:
  - [Vercel](https://vercel.com) (for frontend)
  - [Render](https://render.com) or [Koyeb](https://koyeb.com) (for backend)
  - [Neon](https://neon.tech) (for database)

## Part 1: Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Database
1. Go to [Neon.tech](https://neon.tech) and sign up/login
2. Click "Create Project"
3. Choose a name like "cryptomine-pro"
4. Select a region close to your users
5. Copy the connection string (DATABASE_URL)

### Step 2: Setup Database Schema
1. In your local project, create a `.env` file using the provided template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Neon database URL:
```bash
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
SESSION_SECRET="your-secure-random-string"
```

3. Install dependencies and push schema:
```bash
npm install
npm run db:push
```

> **Note**: Check `.env.example` for a complete list of all required environment variables.

## Part 2: Backend Deployment

### Option A: Deploy to Render

#### Step 1: Prepare Backend
1. Create a `render.yaml` file in your project root:
```yaml
services:
  - type: web
    name: cryptomine-pro-backend
    env: node
    region: oregon
    plan: starter
    buildCommand: npm install
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        sync: false
      - key: DATABASE_URL
        sync: false
      - key: SESSION_SECRET
        generateValue: true
      - key: GOOGLE_CLIENT_ID
        sync: false
      - key: GOOGLE_CLIENT_SECRET
        sync: false
      - key: GOOGLE_REDIRECT_URI
        sync: false
```

2. The production scripts are already configured in `package.json`:
```json
{
  "scripts": {
    "start": "NODE_ENV=production node dist/index.js",
    "start:prod": "NODE_ENV=production tsx server/index.ts"
  }
}
```

#### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: cryptomine-pro-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon connection string
   - `SESSION_SECRET`: Generate a secure random string
   - `GOOGLE_CLIENT_ID`: From Google OAuth console
   - `GOOGLE_CLIENT_SECRET`: From Google OAuth console  
   - `GOOGLE_REDIRECT_URI`: `https://your-app.onrender.com/auth/google/callback`

6. Click "Create Web Service"

### Option B: Deploy to Koyeb

#### Step 1: Prepare for Koyeb
1. Install Koyeb CLI:
```bash
curl -fsSL https://www.koyeb.com/install.sh | bash
```

2. Login to Koyeb:
```bash
koyeb auth login
```

#### Step 2: Deploy to Koyeb
1. Create deployment:
```bash
koyeb app init cryptomine-pro-backend
```

2. Deploy:
```bash
koyeb service create \
  --app cryptomine-pro-backend \
  --git github.com/yourusername/your-repo \
  --git-branch main \
  --git-build-command "npm install && npm run build" \
  --git-run-command "npm start" \
  --port 5000 \
  --name backend
```

3. Set environment variables:
```bash
koyeb secret create DATABASE_URL --value "your-neon-connection-string"
koyeb secret create SESSION_SECRET --value "your-secure-session-secret"
koyeb secret create GOOGLE_CLIENT_ID --value "your-google-client-id"
koyeb secret create GOOGLE_CLIENT_SECRET --value "your-google-client-secret"
```

## Part 3: Frontend Deployment (Vercel)

### Step 1: Verify Required Files
The project already includes all necessary deployment files:

1. **`vercel.json`** (already created):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.koyeb.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        }
      ]
    }
  ]
}
```

2. **Update the backend URL** in `vercel.json` to match your actual Koyeb deployment:
   - Replace `https://your-backend-url.koyeb.app` with your actual backend URL
   - For example: `https://running-kimberli-suhailtechlnf-4b28b6a4.koyeb.app`

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - **Framework**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

5. Set Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://running-kimberli-suhailtechlnf-4b28b6a4.koyeb.app`)

6. Click "Deploy"

> **Important**: The frontend is configured to automatically use your backend URL in production. In development, it uses relative URLs to work with the local server.

## Part 4: Configure OAuth & Final Setup

### Step 1: Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     - `https://your-backend-url/auth/google/callback`
   - **Authorized origins**:
     - `https://your-frontend-url.vercel.app`
     - `https://your-backend-url`

### Step 2: Update Backend Environment Variables
Update your backend deployment with:
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `GOOGLE_REDIRECT_URI`: `https://your-backend-url/auth/google/callback`
- `FRONTEND_URL`: Your Vercel app URL

### Step 3: Test Deployment
1. Visit your Vercel app URL
2. Test user registration/login
3. Verify mining plans display correctly
4. Test admin functionality
5. Check database connections

## Troubleshooting

### Common Issues

#### CORS Errors
Add CORS configuration in your backend:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Check if Neon database allows connections from your hosting provider
- Ensure SSL is enabled in connection string

#### Build Failures
- Check Node.js version compatibility (use 18+)
- Verify all dependencies are listed in `package.json`
- Check for TypeScript errors

#### OAuth Issues
- Verify redirect URIs match exactly
- Check that OAuth credentials are correctly set
- Ensure domains are added to authorized origins

### Performance Optimization

1. **Enable Gzip Compression**:
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Database Connection Pooling**:
```typescript
const connectionString = process.env.DATABASE_URL;
const db = postgres(connectionString, { max: 20 });
```

3. **Add Caching Headers**:
```typescript
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});
```

## Environment Variables Reference

All required environment variables are documented in `.env.example`.

### Backend (Koyeb/Render)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
SESSION_SECRET=your-super-secret-session-key-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-url.koyeb.app/api/auth/google/callback
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend-url.koyeb.app
```

> **Important**: Replace `your-backend-url.koyeb.app` with your actual deployed backend URL.

## Monitoring & Maintenance

### Backend Monitoring
- Monitor server logs in Render/Koyeb dashboard
- Set up alerts for high error rates
- Monitor database performance in Neon dashboard

### Frontend Monitoring  
- Use Vercel Analytics for performance monitoring
- Monitor Core Web Vitals
- Set up error tracking with services like Sentry

### Database Maintenance
- Monitor database usage in Neon dashboard
- Set up automated backups
- Monitor connection pool usage

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] OAuth redirect URIs are configured properly
- [ ] Database uses SSL connections
- [ ] Session secrets are secure and unique
- [ ] CORS is properly configured
- [ ] HTTPS is enabled on all domains
- [ ] API rate limiting is implemented (recommended)

## Support

If you encounter issues during deployment:

1. Check the application logs in your hosting provider's dashboard
2. Verify all environment variables are set correctly
3. Test database connectivity separately
4. Check OAuth configuration in Google Cloud Console
5. Review this deployment guide for any missed steps

Your CryptoMine Pro application should now be successfully deployed and accessible to users worldwide!