# 🚀 Deploy Frontend to Render - Quick Guide

## Prerequisites
✅ Backend deployed at: `https://mind-space-c4eacmh0h-rushikeshs-projects-7882b715.vercel.app/`
✅ GitHub repository: `https://github.com/rushi2212/MindSpace`
✅ Render account: [Sign up free at render.com](https://render.com)

---

## Step-by-Step Deployment

### 1. Sign in to Render

Go to [https://render.com](https://render.com) and sign in with your GitHub account.

### 2. Create New Static Site

1. Click **"New +"** button in the top right
2. Select **"Static Site"**

### 3. Connect Your Repository

1. Click **"Connect a repository"**
2. Authorize Render to access your GitHub
3. Find and select: **`rushi2212/MindSpace`**

### 4. Configure Build Settings

Fill in the following settings:

**Basic Settings:**
- **Name**: `mindspace-frontend` (or any name you prefer)
- **Branch**: `main`
- **Root Directory**: `frontend`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  dist
  ```

### 5. Add Environment Variable

In the **Environment Variables** section:

Click **"Add Environment Variable"** and enter:

- **Key**: `VITE_API_URL`
- **Value**: `https://mind-space-c4eacmh0h-rushikeshs-projects-7882b715.vercel.app/api`

⚠️ **Important**: Make sure to include `/api` at the end of the URL!

### 6. Configure Auto-Deploy

Keep **"Auto-Deploy"** enabled (default) so your site updates automatically when you push to GitHub.

### 7. Deploy!

1. Click **"Create Static Site"**
2. Render will start building your site
3. Wait 2-5 minutes for the build to complete
4. Your site will be live at: `https://mindspace-frontend.onrender.com`

---

## 🎉 Success!

Your MindSpace frontend is now deployed! 

**Your URLs:**
- 🎨 **Frontend**: `https://mindspace-frontend.onrender.com` (or your chosen name)
- 🔧 **Backend**: `https://mind-space-c4eacmh0h-rushikeshs-projects-7882b715.vercel.app/`

---

## ✅ Test Your Deployment

1. Visit your frontend URL
2. Try the following features:
   - ✅ AI Chat
   - ✅ Art Generation
   - ✅ Audio Generation
   - ✅ Mind Map Builder
   - ✅ PNG/JSON Export

---

## 🔧 Troubleshooting

### Issue: "API Connection Failed"

**Solution 1**: Check Backend CORS Settings

Your backend needs to allow requests from your Render frontend domain.

Update `backend/app/main.py` on Vercel:

1. Go to your Vercel backend project
2. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://mindspace-frontend.onrender.com,http://localhost:5173
   ```
3. Redeploy backend

**Solution 2**: Verify API URL

Check browser console (F12) → Network tab to see if requests are going to the correct URL.

### Issue: "404 on Page Refresh"

This is already handled by the redirect rule in `render.yaml`. If you see this:

1. Check that publish directory is set to `dist`
2. Verify the redirect rule is working

### Issue: "Build Failed"

Check Render build logs:

1. Go to your site dashboard on Render
2. Click on the failed deployment
3. Check the logs for errors

Common fixes:
- Ensure Node version is 18+
- Check that all dependencies are in `package.json`
- Verify build command is correct

### Issue: "Blank Page After Deploy"

1. Check browser console for errors (F12)
2. Verify `VITE_API_URL` is set correctly
3. Check that backend is responding: Visit `https://mind-space-c4eacmh0h-rushikeshs-projects-7882b715.vercel.app/` in browser

---

## 🔄 Update Your Deployment

### Method 1: Push to GitHub (Automatic)

```bash
# Make your changes
git add .
git commit -m "Update frontend"
git push origin main
```

Render will automatically rebuild and deploy! 🚀

### Method 2: Manual Deploy

1. Go to your site on Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Render Free Tier

Your frontend on Render is **100% FREE** ✅

**Free Tier Includes:**
- ✅ 100 GB bandwidth/month
- ✅ Global CDN
- ✅ Free SSL certificate
- ✅ Automatic deploys from GitHub
- ✅ Custom domains

**Note**: Free static sites may spin down after 15 minutes of inactivity. First request might take 10-30 seconds to wake up.

---

## 🎨 Custom Domain (Optional)

To use your own domain:

1. Go to your site on Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain (e.g., `mindspace.yourdomain.com`)
4. Update your DNS records as shown by Render
5. Wait for SSL certificate (automatic, 1-5 minutes)

---

## 📊 Monitor Your Site

**Render Dashboard Shows:**
- Deploy history
- Build logs
- Bandwidth usage
- Custom domain status
- Environment variables

**Access it at**: https://dashboard.render.com

---

## 🔗 Useful Links

- **Render Docs**: https://render.com/docs/static-sites
- **Render Status**: https://status.render.com
- **Support**: https://render.com/support

---

**Need help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for more deployment options or create an issue on GitHub.

---

Made with 💜 by Rushikesh
