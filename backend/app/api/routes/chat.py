from fastapi import APIRouter, HTTPException

from app.domain.chat.models import ChatRequest, ChatResponse
from app.services.chat_service import chat_service


router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        return chat_service.generate_response(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")
