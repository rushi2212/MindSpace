# 🚀 Deployment Guide: Backend on Render + Frontend on Vercel

## Architecture
- **Backend**: Render (Python/FastAPI)
- **Frontend**: Vercel (React/Vite)
- **Database**: SQLite (on Render)

---

## Part 1: Deploy Backend to Render

### Step 1: Sign in to Render
Go to https://render.com and sign in with GitHub

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect repository: `rushi2212/MindSpace`
3. Render will auto-detect the backend

### Step 3: Configure Backend

**Basic Settings:**
- **Name**: `mindspace-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Python 3

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables

Click **"Add Environment Variable"** for each:

```
GEMINI_API_KEY=your_gemini_api_key_here
HF_API_KEY=your_huggingface_key_here
GROQ_API_KEY=your_groq_key_here
GEMINI_MODEL=gemini-2.5-flash
DB_URL=sqlite:///tmp/backend.db
```

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your backend URL: `https://mindspace-backend.onrender.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Sign in to Vercel
Go to https://vercel.com and sign in with GitHub

### Step 2: Import Project

1. Click **"Add New Project"**
2. Import repository: `rushi2212/MindSpace`
3. Configure project settings

### Step 3: Configure Frontend

**Framework Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variable

Click **"Add Environment Variable"**:

```
Key: VITE_API_URL
Value: https://mindspace-backend.onrender.com/api
```

⚠️ **Important**: Replace with your actual Render backend URL + `/api`

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site will be live at: `https://mindspace-frontend.vercel.app`

---

## Part 3: Update Backend CORS

After deploying frontend, update CORS in backend:

### Via Render Dashboard

1. Go to your backend service on Render
2. **Environment** → **Add Environment Variable**
3. Add:
   ```
   Key: ALLOWED_ORIGINS
   Value: https://your-frontend-url.vercel.app,http://localhost:5173
   ```
4. Click **"Save Changes"**
5. Service will auto-redeploy

---

## ✅ Verify Deployment

### Test Backend
Visit: `https://your-backend-url.onrender.com/`

Should return:
```json
{"status":"ok","service":"MindSpace FastAPI"}
```

### Test Frontend
Visit your Vercel URL and test:
- ✅ AI Chat
- ✅ Art Generator
- ✅ Audio Generator
- ✅ Mind Map Builder

---

## 🔧 Troubleshooting

### Backend Issues

**Build fails:**
- Check Python version (should be 3.10+)
- Verify `requirements.txt` is correct
- Check Render build logs

**API key errors:**
- Verify all environment variables are set
- Check no extra spaces in keys

### Frontend Issues

**API connection failed:**
- Verify `VITE_API_URL` is set correctly
- Must include `/api` at the end
- Check backend URL is accessible

**CORS errors:**
- Add frontend URL to `ALLOWED_ORIGINS` in backend
- Include both production URL and localhost
- Redeploy backend after changes

---

## 🔄 Update Your Deployment

### Backend (Render)
Push to GitHub → Render auto-deploys ✅

### Frontend (Vercel)
Push to GitHub → Vercel auto-deploys ✅

---

## 💰 Cost & Limitations

### Render Free Tier (Backend)
- ✅ 750 hours/month free
- ⏳ Spins down after 15 min inactivity (first request takes 30-60 sec)
- ⚠️ Ephemeral storage (database resets on restart)

### Vercel Free Tier (Frontend)
- ✅ 100 GB bandwidth/month
- ✅ Always-on (no sleep)
- ✅ Global CDN
- ✅ Automatic HTTPS

---

Made with 💜 by Rushikesh
