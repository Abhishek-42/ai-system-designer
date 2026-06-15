from datetime import datetime

from fastapi import APIRouter

from app.core.config import settings


router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "groq_configured": bool(settings.GROQ_API_KEY),
        "timestamp": datetime.now().isoformat(),
    }
