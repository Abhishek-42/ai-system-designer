from __future__ import annotations

import json
from pathlib import Path

from app.domain.design.models import DiagramDocument, DiagramEdge, DiagramNode, ProjectContext


class DesignRepository:
    def __init__(self, state_file: Path) -> None:
        self.state_file = state_file
        self.data_dir = state_file.parent

    def load(self) -> DiagramDocument:
        self._ensure_state_file()
        return DiagramDocument.model_validate_json(self.state_file.read_text(encoding="utf-8"))

    def save(self, document: DiagramDocument) -> DiagramDocument:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.state_file.write_text(
            json.dumps(document.model_dump(mode="json"), indent=2),
            encoding="utf-8",
        )
        return document

    def _ensure_state_file(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        if not self.state_file.exists():
            self.save(self._build_default_document())

    @staticmethod
    def _build_default_document() -> DiagramDocument:
        return DiagramDocument(
            project=ProjectContext(
                name="DiagramMaker prototype",
                summary="A starter workspace for AI-assisted system design.",
                design_type="mixed",
                assumptions=[
                    "Start with a single editable architecture view.",
                    "Persist diagram changes through validated operations.",
                ],
                requirements=[
                    "Users can add, edit, connect, and delete nodes.",
                    "The canvas state stays in sync with the backend document.",
                ],
            ),
            nodes=[
                DiagramNode.model_validate(
                    {
                        "id": "n1",
                        "data": {"label": "Client", "kind": "actor"},
                        "position": {"x": 180, "y": 220},
                    }
                ),
                DiagramNode.model_validate(
                    {
                        "id": "n2",
                        "data": {"label": "API service", "kind": "service"},
                        "position": {"x": 430, "y": 220},
                    }
                ),
                DiagramNode.model_validate(
                    {
                        "id": "n3",
                        "data": {"label": "Design store", "kind": "storage"},
                        "position": {"x": 680, "y": 220},
                    }
                ),
            ],
            edges=[
                DiagramEdge.model_validate({"id": "e1", "source": "n1", "target": "n2"}),
                DiagramEdge.model_validate({"id": "e2", "source": "n2", "target": "n3"}),
            ],
        )
