"""
api/health.py — Health check endpoint (minimal dependencies).
"""

from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
async def health():
    return {"status": "ok", "database": "hostpathogen.db"}
