# MindSpace FastAPI Backend

This replaces the Node/Express backend with a FastAPI app that preserves the same public routes used by the frontend.

- Base URL: <http://localhost:5000>
- API prefix: /api
- Routes:
  - POST /api/ai/chat { message }
  - POST /api/ai/art { prompt }
  - GET  /api/ai/health
  - GET  /api/tasks/{user_id}
  - POST /api/tasks { title, user_id? }
  - PUT  /api/tasks/{task_id} { title?, completed? }
  - DELETE /api/tasks/{task_id}

\n## Prereqs
\n- Python 3.10+

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Copy and edit env
cp .env.example .env  # On PowerShell use: copy .env.example .env
# Edit .env and set:
# - GEMINI_API_KEY (and optional GEMINI_MODEL)
# - HF_API_KEY (and optional HF_MODEL, HF_ALLOW_FALLBACK, HF_PLACEHOLDER_ON_FAIL)
# - DB_URL (optional; defaults to sqlite:///backend.db)
```

## Run

```powershell
# Run on port 5000 to match frontend
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000

# If port 5000 is stuck (phantom LISTEN), use an alternate port and update the frontend baseURL:
uvicorn app.main:app --reload --host 0.0.0.0 --port 5001
```

## Notes

- SQLite DB is created at `backend.db` in the backend folder by default.
- If you previously used the Node backend, stop it before starting this one.
- The frontend base URL stays the same: `http://localhost:5000/api`.
- If Hugging Face models are gated, open the model page in your browser and click “Agree and access repository”.
