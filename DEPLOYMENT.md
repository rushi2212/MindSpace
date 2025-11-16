# 🚀 MindSpace Deployment Guide

## Recommended: Vercel Deployment (Free & Easy)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Google Gemini API key
- Hugging Face API key (optional for media features)

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository

Your project is already on GitHub at `https://github.com/rushi2212/MindSpace`

### Step 2: Deploy Backend to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `rushi2212/MindSpace`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. Add Environment Variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   HF_API_KEY=your_huggingface_key_here
   GROQ_API_KEY=your_groq_key_here
   DB_URL=sqlite:///tmp/backend.db
   MOCK_AI=false
   ```

6. Click **Deploy**

7. Note your backend URL (e.g., `https://mindspace-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. In Vercel dashboard, click **"Add New Project"** again
2. Import the same repository: `rushi2212/MindSpace`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```

5. Click **Deploy**

### Step 4: Update Frontend API URL

After deployment, update the API URL in your frontend:

1. Edit `frontend/src/api/api.js`
2. Change:
   ```javascript
   const API = axios.create({ baseURL: "http://localhost:5000/api" });
   ```
   To:
   ```javascript
   const API = axios.create({ 
     baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" 
   });
   ```

3. Commit and push changes - Vercel will auto-redeploy

---

## Option 2: Deploy to Render (Alternative)

### Backend Deployment

1. Go to [Render](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: mindspace-backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.10+

5. Add Environment Variables (same as Vercel)

6. Click **Create Web Service**

### Frontend Deployment

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name**: mindspace-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://mindspace-backend.onrender.com/api
   ```

5. Click **Create Static Site**

---

## Option 3: Deploy to Railway (Alternative)

### Quick Deploy

1. Go to [Railway](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `rushi2212/MindSpace`

### Backend Service

1. Railway will detect the Python app
2. Add these environment variables:
   - `GEMINI_API_KEY`
   - `HF_API_KEY`
   - `GROQ_API_KEY`
   - `PORT=8000`

3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Service

1. Add new service from same repo
2. Set root directory to `frontend`
3. Build command: `npm install && npm run build`
4. Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`

---

## Option 4: Docker Deployment (Advanced)

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - HF_API_KEY=${HF_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - ./backend:/app
      - backend-data:/app/data

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  backend-data:
```

Deploy to any Docker hosting (AWS ECS, Google Cloud Run, DigitalOcean App Platform)

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API keys added to environment variables
- [ ] Frontend API URL updated to production backend
- [ ] CORS configured in backend for frontend domain
- [ ] Database persisting data correctly
- [ ] SSL/HTTPS enabled (Vercel/Render do this automatically)
- [ ] Test all features:
  - [ ] AI Chat
  - [ ] Art Generation
  - [ ] Audio Generation
  - [ ] Mind Map Builder
  - [ ] PNG/JSON Export

---

## Troubleshooting

### Backend Issues

**CORS Errors:**
Update `backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend-domain.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**API Key Errors:**
- Verify environment variables are set correctly
- Check API key validity on provider websites

**Database Issues:**
- Vercel: Use `/tmp/backend.db` for SQLite
- For production, consider PostgreSQL (free tier on Render/Railway)

### Frontend Issues

**API Connection Failed:**
- Verify `VITE_API_URL` environment variable
- Check network tab in browser dev tools
- Ensure backend is running

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for linting errors: `npm run lint`

---

## Monitoring & Maintenance

### Vercel
- View logs in Vercel dashboard
- Monitor function execution times
- Check bandwidth usage

### Render/Railway
- View logs in dashboard
- Set up health check endpoints
- Monitor resource usage

---

## Cost Considerations

**Free Tiers:**
- **Vercel**: 100GB bandwidth/month, unlimited requests
- **Render**: 750 hours/month free
- **Railway**: $5 free credit/month
- **Netlify**: 100GB bandwidth/month (frontend only)

**Paid Options (if you exceed free tier):**
- Vercel Pro: $20/month
- Render Standard: $7/month per service
- Railway: Pay as you go

---

## Recommended Setup for Production

1. **Frontend**: Vercel (automatic HTTPS, CDN, git-based deployment)
2. **Backend**: Railway or Render (better for Python apps with persistent storage)
3. **Database**: Upgrade to PostgreSQL on Railway/Render for better persistence

This combination gives you:
- ✅ Automatic deployments on git push
- ✅ Free SSL certificates
- ✅ CDN for fast global access
- ✅ Easy rollbacks
- ✅ Environment variable management
- ✅ Logs and monitoring

---

**Need help?** Create an issue on GitHub or check the troubleshooting section above.
