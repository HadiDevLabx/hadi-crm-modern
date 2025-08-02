# Vercel Deployment Guide

This guide will help you deploy your CRM project to Vercel for fast global hosting with automatic HTTPS and CDN.

## Method 1: Deploy from GitHub (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `hadi-crm-sales`

3. **Configure Project**
   - Framework Preset: Select "Vite"
   - Build Command: `npm run build`
   - Output Directory: `build` (already configured in vercel.json)
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site

## Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **For Production Deployment**
   ```bash
   vercel --prod
   ```

## Custom Domain Setup (Optional)

1. **Go to Project Settings**
   - Navigate to project dashboard in Vercel
   - Click "Settings" → "Domains"

2. **Add Your Domain**
   - Enter your domain name
   - Follow verification steps

3. **Configure DNS**
   - Update your domain's nameservers or add the required records

## Environment Variables (If Needed)

1. **Project Settings** → **Environment Variables**
2. Add any required environment variables for your project

## Project URL

After deployment, your project will be available at:
- `https://hadi-crm-sales.vercel.app`
- Or your custom domain if configured
