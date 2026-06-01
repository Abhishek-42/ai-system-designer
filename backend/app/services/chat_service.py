from datetime import datetime

import google.generativeai as genai

from app.core.config import settings
from app.domain.chat.models import ChatRequest, ChatResponse


SYSTEM_DESIGN_PROMPT = """
You are DiagramMaker AI, a senior software architect helping users create
system design documents, HLDs, LLDs, flowcharts, and architecture diagrams.

Rules:
- Ask clarifying questions when requirements are missing.
- Prefer practical tradeoffs over buzzwords.
- Break complex systems into components, data flows, APIs, and risks.
- Keep answers grounded and implementation-oriented.
- Do not claim that you changed the canvas directly. Suggest the design changes clearly.
""".strip()


class ChatService:
    def __init__(self, api_key: str | None) -> None:
        self.api_key = api_key

    def generate_response(self, request: ChatRequest) -> ChatResponse:
        model = self._get_model()

        if model is None:
            return ChatResponse(
                response=(
                    "**Gemini API key not configured.**\n\n"
                    "To enable AI responses, add your API key to `backend/.env`:\n\n"
                    "```\nGEMINI_API_KEY=your_key_here\n```\n\n"
                    "Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)"
                ),
                timestamp=datetime.now().isoformat(),
            )

        history = [{"role": "user", "parts": [SYSTEM_DESIGN_PROMPT]}]
        for message in request.history:
            history.append({"role": message.role, "parts": [message.content]})

        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(request.message)

        return ChatResponse(
            response=response.text,
            timestamp=datetime.now().isoformat(),
        )

    def _get_model(self):
        if not self.api_key:
            return None

        try:
            genai.configure(api_key=self.api_key)
            return genai.GenerativeModel("gemini-2.5-flash")
        except Exception as e:
            print(f"Error initializing Gemini: {e}")
            return None


chat_service = ChatService(settings.GEMINI_API_KEY)
