from __future__ import annotations

from datetime import datetime
from pathlib import Path

from app.domain.design.models import (
    ApplyOperationsRequest,
    DiagramDocument,
    DiagramNode,
    DiagramNodePosition,
)
from app.repositories.design_repository import DesignRepository


ROOT_DIR = Path(__file__).resolve().parents[3]
STATE_FILE = ROOT_DIR / "data" / "project_design.json"


class DesignService:
    def __init__(self, repository: DesignRepository) -> None:
        self.repository = repository

    def load_document(self) -> DiagramDocument:
        return self.repository.load()

    def apply_operations(self, request: ApplyOperationsRequest) -> DiagramDocument:
        document = self.repository.load()

        for operation in request.operations:
            if operation.type == "add_node":
                assert operation.node is not None
                self._ensure_unique_node(document, operation.node.id)
                document.nodes.append(operation.node)
                continue

            if operation.type == "update_node":
                assert operation.node_id is not None
                node = self._get_node(document, operation.node_id)
                if node is None:
                    raise ValueError(f"Node '{operation.node_id}' does not exist")
                for key, value in operation.updates.items():
                    if key == "label":
                        node.data.label = str(value)
                    elif key == "kind":
                        node.data.kind = str(value)
                    elif key == "position":
                        node.position = DiagramNodePosition.model_validate(value)
                    else:
                        node.data.metadata[key] = value
                continue

            if operation.type == "delete_node":
                assert operation.node_id is not None
                self._ensure_node_exists(document, operation.node_id)
                document.nodes = [node for node in document.nodes if node.id != operation.node_id]
                document.edges = [
                    edge
                    for edge in document.edges
                    if edge.source != operation.node_id and edge.target != operation.node_id
                ]
                continue

            if operation.type == "add_edge":
                assert operation.edge is not None
                self._ensure_unique_edge(document, operation.edge.id)
                self._ensure_node_exists(document, operation.edge.source)
                self._ensure_node_exists(document, operation.edge.target)
                document.edges.append(operation.edge)
                continue

            if operation.type == "delete_edge":
                assert operation.edge_id is not None
                if not any(edge.id == operation.edge_id for edge in document.edges):
                    raise ValueError(f"Edge '{operation.edge_id}' does not exist")
                document.edges = [edge for edge in document.edges if edge.id != operation.edge_id]
                continue

            if operation.type == "clear_diagram":
                document.nodes = []
                document.edges = []
                continue

            if operation.type == "set_project_context":
                assert operation.project is not None
                document.project = operation.project
                continue

        document.version += 1
        document.updated_at = datetime.utcnow().isoformat()
        return self.repository.save(document)

    @staticmethod
    def _get_node(document: DiagramDocument, node_id: str) -> DiagramNode | None:
        return next((node for node in document.nodes if node.id == node_id), None)

    def _ensure_unique_node(self, document: DiagramDocument, node_id: str) -> None:
        if self._get_node(document, node_id) is not None:
            raise ValueError(f"Node '{node_id}' already exists")

    @staticmethod
    def _ensure_unique_edge(document: DiagramDocument, edge_id: str) -> None:
        if any(edge.id == edge_id for edge in document.edges):
            raise ValueError(f"Edge '{edge_id}' already exists")

    def _ensure_node_exists(self, document: DiagramDocument, node_id: str) -> None:
        if self._get_node(document, node_id) is None:
            raise ValueError(f"Node '{node_id}' does not exist")


design_service = DesignService(DesignRepository(STATE_FILE))
