import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .db import init_db
from .routers import ai, tasks, media

load_dotenv()

app = FastAPI(title="MindSpace Backend (FastAPI)")

# CORS - allow local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB
init_db()

# Routers
app.include_router(ai.router)
app.include_router(tasks.router)
app.include_router(media.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "MindSpace FastAPI"}

# Entrypoint helper for `python -m uvicorn app.main:app --reload --port 5000`
