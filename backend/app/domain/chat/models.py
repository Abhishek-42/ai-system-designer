from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    content: str


class DiagramState(BaseModel):
    """Lightweight snapshot of the current canvas state sent with each chat message."""
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)
    current_diagram: DiagramState | None = None


class ChatResponse(BaseModel):
    response: str
    operations: list[dict[str, Any]] = Field(default_factory=list)
    timestamp: str
