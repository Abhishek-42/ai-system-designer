from datetime import datetime

from fastapi import APIRouter

from app.core.config import settings


router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "timestamp": datetime.now().isoformat(),
    }
