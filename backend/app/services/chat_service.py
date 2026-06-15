import json
import re
from datetime import datetime

from groq import Groq

from app.core.config import settings
from app.domain.chat.models import ChatRequest, ChatResponse


SYSTEM_PROMPT = """
You are DiagramMaker AI, a senior software architect that helps users design systems
by BOTH explaining the architecture AND directly building it on an interactive canvas.

Rules:

1. Your output must be strictly in json format  . 

```

- `output`: A human-readable markdown explanation shown in the chat. Be helpful, concise, and use formatting (bold, lists, code blocks).
- `operations`: An array of diagram operations to execute on the canvas. Use an empty array `[]` when no diagram changes are needed (e.g. answering questions, asking for clarification).

AVAILABLE OPERATIONS:


1. **clear_diagram** — Wipe the canvas clean before building a new design.
   `{"type": "clear_diagram"}`

2. **add_node** — Add a component to the canvas.
   `{"type": "add_node", "node": {"id": "n1", "data": {"label": "API Gateway", "kind": "service"}, "position": {"x": 300, "y": 200}}}`
   - `id`: Unique string like "n1", "n2", etc. Check existing IDs to avoid conflicts.
   - `kind`: One of "actor", "service", "storage", "queue", "external", "gateway", "cache".
   - `position`: {x, y} coordinates. Space nodes ~250px apart horizontally, ~180px vertically. Start around x:150, y:200.

3. **add_edge** — Connect two nodes.
   `{"type": "add_edge", "edge": {"id": "e1", "source": "n1", "target": "n2", "data": {"label": "REST API"}}}`
   - `source` and `target` must be existing node IDs.
   - `data.label` is optional — use for protocol/description (e.g., "gRPC", "WebSocket", "reads from").

4. **delete_node** — Remove a node (also removes connected edges).
   `{"type": "delete_node", "node_id": "n3"}`

5. **delete_edge** — Remove a connection.
   `{"type": "delete_edge", "edge_id": "e2"}`

6. **update_node** — Rename or restyle an existing node.
   `{"type": "update_node", "node_id": "n1", "updates": {"label": "New Name", "kind": "storage"}}`

GUIDELINES: 

- When a user asks to "design X" or "create X", ALWAYS include operations to build the diagram.
- When a user asks to "modify", "add", "remove", or "change" something, do INCREMENTAL edits — don't clear the whole diagram.
- When a user asks a question (e.g. "what is a load balancer?"), return output only with empty operations.
- Before building a NEW diagram from scratch, use clear_diagram first.
- Use incrementing IDs: check the current diagram state and pick IDs that don't conflict.
- Layout nodes in a logical flow: left-to-right or top-to-bottom. Avoid stacking nodes on top of each other.
- Keep output explanations concise — let the diagram do the heavy lifting.
- NEVER wrap your response in markdown code fences. Return RAW JSON only.
""".strip()


def _build_diagram_context(request: ChatRequest) -> str:
    """Build a context string describing the current diagram state."""
    if not request.current_diagram:
        return "\n\nCurrent canvas: EMPTY (no nodes or edges)"

    nodes = request.current_diagram.nodes
    edges = request.current_diagram.edges

    if not nodes and not edges:
        return "\n\nCurrent canvas: EMPTY (no nodes or edges)"

    lines = ["\n\nCurrent canvas state:"]
    if nodes:
        lines.append(f"Nodes ({len(nodes)}):")
        for n in nodes:
            nid = n.get("id", "?")
            label = n.get("data", {}).get("label", "?")
            kind = n.get("data", {}).get("kind", "service")
            pos = n.get("position", {})
            lines.append(f'  - {nid}: "{label}" (kind={kind}, x={pos.get("x", 0)}, y={pos.get("y", 0)})')

    if edges:
        lines.append(f"Edges ({len(edges)}):")
        for e in edges:
            eid = e.get("id", "?")
            src = e.get("source", "?")
            tgt = e.get("target", "?")
            lbl = e.get("data", {}).get("label") or ""
            lines.append(f'  - {eid}: {src} → {tgt}' + (f' "{lbl}"' if lbl else ''))

    return "\n".join(lines)


def _extract_json_response(raw_text: str) -> dict:
    """
    Parse Gemini's response into {output, operations}.
    Handles: raw JSON, JSON in code fences, or plain text fallback.
    """
    text = raw_text.strip()

    # 1. Try to extract JSON from markdown code fences
    fence_match = re.search(r'```(?:json)?\s*\n?([\s\S]*?)\n?\s*```', text)
    if fence_match:
        text = fence_match.group(1).strip()

    # 2. Try to parse as JSON directly
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict) and "output" in parsed:
            return {
                "output": str(parsed.get("output", "")),
                "operations": parsed.get("operations", []),
            }
    except json.JSONDecodeError:
        pass

    # 3. Try to find a JSON object in the text (Gemini sometimes adds preamble)
    json_match = re.search(r'\{[\s\S]*"output"[\s\S]*\}', text)
    if json_match:
        try:
            parsed = json.loads(json_match.group(0))
            if isinstance(parsed, dict) and "output" in parsed:
                return {
                    "output": str(parsed.get("output", "")),
                    "operations": parsed.get("operations", []),
                }
        except json.JSONDecodeError:
            pass

    # 4. Fallback: treat entire response as output, no operations
    return {
        "output": raw_text,
        "operations": [],
    }


class ChatService:
    def __init__(self, api_key: str | None) -> None:
        self.api_key = api_key

    def generate_response(self, request: ChatRequest) -> ChatResponse:
        client = self._get_client()

        if client is None:
            return ChatResponse(
                response=(
                    "**Groq API key not configured.**\n\n"
                    "To enable AI responses, add your API key to `backend/.env`:\n\n"
                    "```\nGROQ_API_KEY=your_key_here\n```\n\n"
                    "Get a key at [console.groq.com](https://console.groq.com)"
                ),
                operations=[],
                timestamp=datetime.now().isoformat(),
            )

        # Build system prompt with current diagram context
        diagram_context = _build_diagram_context(request)
        full_system = SYSTEM_PROMPT + diagram_context

        # Construct messages for Groq
        messages = [
            {"role": "system", "content": full_system}
        ]
        for message in request.history:
            role = "assistant" if message.role == "model" else "user"
            messages.append({"role": role, "content": message.content})
        
        messages.append({"role": "user", "content": request.message})

        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
            )
            raw_response = chat_completion.choices[0].message.content
        except Exception as e:
            return ChatResponse(
                response=f"**Groq API Error:** {str(e)}",
                operations=[],
                timestamp=datetime.now().isoformat(),
            )

        # Parse structured response
        parsed = _extract_json_response(raw_response)

        return ChatResponse(
            response=parsed["output"],
            operations=parsed["operations"],
            timestamp=datetime.now().isoformat(),
        )

    def _get_client(self):
        if not self.api_key:
            return None

        try:
            return Groq(api_key=self.api_key)
        except Exception as e:
            print(f"Error initializing Groq client: {e}")
            return None


chat_service = ChatService(settings.GROQ_API_KEY)
