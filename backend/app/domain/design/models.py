from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator


class DiagramNodePosition(BaseModel):
    x: float
    y: float


class DiagramNodeData(BaseModel):
    label: str
    kind: str = "service"
    metadata: dict[str, Any] = Field(default_factory=dict)


class DiagramNode(BaseModel):
    id: str
    data: DiagramNodeData
    position: DiagramNodePosition


class DiagramEdgeData(BaseModel):
    label: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class DiagramEdge(BaseModel):
    id: str
    source: str
    target: str
    data: DiagramEdgeData = Field(default_factory=DiagramEdgeData)


class ProjectContext(BaseModel):
    name: str = "Untitled project"
    summary: str = "A working draft of the system design."
    design_type: Literal["system_design", "flowchart", "hld", "lld", "mixed"] = "mixed"
    assumptions: list[str] = Field(default_factory=list)
    requirements: list[str] = Field(default_factory=list)


class DiagramDocument(BaseModel):
    project: ProjectContext = Field(default_factory=ProjectContext)
    nodes: list[DiagramNode] = Field(default_factory=list)
    edges: list[DiagramEdge] = Field(default_factory=list)
    version: int = 1
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class DiagramOperation(BaseModel):
    type: Literal[
        "add_node",
        "update_node",
        "delete_node",
        "add_edge",
        "delete_edge",
        "clear_diagram",
        "set_project_context",
    ]
    node: DiagramNode | None = None
    edge: DiagramEdge | None = None
    node_id: str | None = None
    edge_id: str | None = None
    updates: dict[str, Any] = Field(default_factory=dict)
    project: ProjectContext | None = None

    @model_validator(mode="after")
    def validate_payload(self) -> "DiagramOperation":
        if self.type == "add_node" and self.node is None:
            raise ValueError("add_node requires node")
        if self.type == "update_node" and (self.node_id is None or not self.updates):
            raise ValueError("update_node requires node_id and updates")
        if self.type == "delete_node" and self.node_id is None:
            raise ValueError("delete_node requires node_id")
        if self.type == "add_edge" and self.edge is None:
            raise ValueError("add_edge requires edge")
        if self.type == "delete_edge" and self.edge_id is None:
            raise ValueError("delete_edge requires edge_id")
        if self.type == "set_project_context" and self.project is None:
            raise ValueError("set_project_context requires project")
        return self


class ApplyOperationsRequest(BaseModel):
    operations: list[DiagramOperation]


class ApplyOperationsResponse(BaseModel):
    document: DiagramDocument
    applied_operations: int
