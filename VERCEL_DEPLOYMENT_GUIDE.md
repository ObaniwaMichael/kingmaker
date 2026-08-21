# Vercel Deployment Guide

This guide explains how to deploy your portfolio to Vercel.

## Prerequisites

- GitHub account with your portfolio repository
- Vercel account (free tier available)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `https://github.com/Raidreaper/folio`
4. Select the repository and click "Import"

### 2. Configure Project Settings

**Framework Preset:** Vite  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### 3. Deploy

Click "Deploy" and wait for the build to complete.

## Project Structure

```
/
├── dist/                 # Build output (auto-generated)
├── assets/               # Static assets
├── index.html            # Main page
├── projects.html         # Projects page
├── skills.html           # Skills page
├── main.js               # Main JavaScript functionality
├── style.css             # Styles
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and scripts
```

## Custom Domain (Optional)

After deployment, you can add a custom domain in your Vercel project settings.

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that `npm run build` works locally

### Performance Issues
- Vercel automatically optimizes static assets
- CDN is enabled by default

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Support

For Vercel-specific issues, check the [Vercel documentation](https://vercel.com/docs).
For project-specific issues, check the repository or contact the developer.
