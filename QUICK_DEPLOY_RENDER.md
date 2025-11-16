# 🚀 Quick Deploy: Frontend to Render

## Your Backend (Already Deployed)
✅ **URL**: `https://mind-space-c4eacmh0h-rushikeshs-projects-7882b715.vercel.app/`

---

## Deploy Frontend to Render - 5 Steps

### 1️⃣ Go to Render
Visit: https://render.com and sign in with GitHub

### 2️⃣ Create Static Site
- Click **"New +"** → **"Static Site"**
- Connect repository: `rushi2212/MindSpace`

### 3️⃣ Configure Settings

**Basic:**
- Name: `mindspace-frontend`
- Branch: `main`
- Root Directory: `frontend` ⚠️ **No trailing spaces!**

**Build:**
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### 4️⃣ Add Environment Variable

Click **"Add Environment Variable"**:

```
Key: VITE_API_URL
Value: https://mind-space-c4eacmh0h-rushikeshs-projects-7882b715.vercel.app/api
```

⚠️ **Important**: Include `/api` at the end!

### 5️⃣ Deploy

Click **"Create Static Site"** and wait 2-3 minutes ⏳

---

## ✅ After Deployment

Your site will be live at:
`https://mindspace-frontend.onrender.com`

---

## 🔧 Important: Update Backend CORS

Your Vercel backend needs to allow requests from Render:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   ```
   Key: ALLOWED_ORIGINS
   Value: https://mindspace-frontend.onrender.com,http://localhost:5173
   ```
5. Click **"Redeploy"** to apply changes

---

## 🎯 Test Your Deployment

Visit your frontend URL and test:
- ✅ AI Chat
- ✅ Art Generator
- ✅ Audio Generator  
- ✅ Mind Map Builder

---

## 📚 Full Guide

For detailed troubleshooting and more options, see:
- **[RENDER_DEPLOY.md](./RENDER_DEPLOY.md)** - Complete Render guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - All deployment platforms

---

**Need Help?**
- Check browser console (F12) for errors
- Verify backend URL includes `/api`
- Check Render build logs if deployment fails

---

Made with 💜
