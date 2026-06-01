# Architecture Foundation

## Product Direction

DiagramMaker AI is evolving from a basic diagram generator into an AI-assisted system design workspace. The intended end state is a product where users can describe a software idea in natural language and receive a structured architecture model, editable diagrams, and supporting HLD/LLD outputs.

## Core Principle

The backend owns the design state.

The frontend and AI should not directly mutate random JSON blobs. They should send validated operations to the backend, and the backend should apply those operations against a canonical design document.

## Current Layers

### Conversation Layer

Gemini handles requirement discovery, architecture discussion, and follow-up questions through `/api/chat`.

- Domain model: `backend/app/domain/chat/`
- Application logic: `backend/app/services/chat_service.py`
- Delivery layer: `backend/app/api/routes/chat.py`

### Design State Layer

`data/project_design.json` is the current persisted design document. It stores:

- project context
- assumptions
- requirements
- nodes
- edges
- version metadata

Code boundaries:

- Domain model: `backend/app/domain/design/`
- Persistence: `backend/app/repositories/design_repository.py`
- Application logic: `backend/app/services/design_service.py`
- Delivery layer: `backend/app/api/routes/design.py`

### Operation Layer

The backend validates a small operation set before changing the design:

- add node
- update node
- delete node
- add edge
- delete edge
- clear diagram
- set project context

### Rendering Layer

The frontend loads the design document from the backend and renders it with Cytoscape. User actions now round-trip through the operations API so the canvas is not only local state.

Frontend boundaries:

- App bootstrap: `frontend/src/app/`
- Feature modules: `frontend/src/features/`
- Shared helpers: `frontend/src/shared/`
- Global styles: `frontend/src/styles/`

## Recommended Future Architecture

### Frontend

- React
- TypeScript
- React Flow
- ELK.js or dagre for layouts

### Backend

- FastAPI
- Pydantic
- structured Gemini outputs
- WebSockets for live updates

### Persistence

- PostgreSQL
- JSONB for design documents
- relational tables for projects, sessions, versions, and users

### Retrieval

Start with Gemini file search or managed retrieval. Add `pgvector` or a dedicated vector store later if custom retrieval becomes necessary.

## Why This Matters

This architecture is important because it gives the project:

- safer state changes
- versionable design history
- easier debugging
- clearer AI boundaries
- a path to multiple diagram views from one canonical model
