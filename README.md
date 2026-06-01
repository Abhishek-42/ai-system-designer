# DiagramMaker AI

DiagramMaker AI is an AI-assisted system design workspace for turning project ideas into editable design artifacts. The current foundation combines a Vite frontend, a Cytoscape canvas, and a FastAPI backend with Gemini-powered architecture chat. The product direction is broader than a normal diagram editor: the long-term goal is to support system design diagrams, flowcharts, HLDs, LLDs, service maps, and architecture reasoning from one shared project model.

## What Changed

The repo has been cleaned up to match the real architecture:

- Removed old duplicate frontend modules and the unused temporary Django-style frontend.
- Replaced hardcoded canvas state with a backend-owned design document in `data/project_design.json`.
- Added validated diagram operations so the app updates design state through safe backend actions instead of relying only on local frontend changes.
- Refocused the Gemini assistant on system design guidance rather than generic chat responses.

## Current Architecture

| Service | Directory | Port | Role |
|---------|-----------|------|------|
| Vite frontend | `frontend/` | 5173 | App shell, feature modules, shared client utilities |
| FastAPI backend | `backend/` | 8001 | API routes, domain models, services, repositories |
| Design document | `data/` | n/a | Backend-owned JSON design state used by the canvas |

## Backend Design Model

The backend now treats the design as a validated document rather than an arbitrary blob edited by the model.

- `backend/app/domain/design/models.py`: project context, nodes, edges, and operation schemas
- `backend/app/repositories/design_repository.py`: persistence for the design document
- `backend/app/services/design_service.py`: validation and operation application
- `backend/app/api/routes/`: health, chat, and design route modules
- `data/project_design.json`: starter design document for the canvas

Supported operation types today:

- `add_node`
- `update_node`
- `delete_node`
- `add_edge`
- `delete_edge`
- `clear_diagram`
- `set_project_context`

This is the direction the product should keep following: the AI and frontend should work through typed operations, while the backend remains the source of truth.

## Frontend Notes

The active frontend is organized by app, features, and shared utilities.

- `src/app/`: bootstrap and app entry
- `src/features/chat/`: Gemini-backed architecture chat
- `src/features/canvas/`: backend-synced Cytoscape canvas
- `src/features/settings/`: canvas settings and actions
- `src/shared/api/`: frontend API client
- `src/shared/utils/`: reusable formatting helpers

The canvas now loads its initial graph from the backend and persists node and edge changes through the validated operations API.

## Source Tree

```text
main_file/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- routes/
|   |   |   `-- router.py
|   |   |-- core/
|   |   |-- domain/
|   |   |   |-- chat/
|   |   |   `-- design/
|   |   |-- repositories/
|   |   `-- services/
|   `-- requirements.txt
|-- data/
|   `-- project_design.json
|-- docs/
|   `-- ARCHITECTURE.md
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- app/
|       |-- features/
|       |   |-- canvas/
|       |   |-- chat/
|       |   `-- settings/
|       |-- shared/
|       |   |-- api/
|       |   `-- utils/
|       `-- styles/
`-- scripts/
```

## Quick Start

### 1. Configure Gemini

Create or edit `backend/.env`:

```bash
GEMINI_API_KEY=your_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

### 2. Install Dependencies

Use the helper script:

```bash
scripts\setup.bat
```

Or install manually:

- Backend: `cd backend && python -m pip install -r requirements.txt`
- Frontend: `cd frontend && npm install`

### 3. Start the App

```bash
scripts\start.bat
```

Manual startup:

- Backend: `cd backend && python -m uvicorn app.main:app --port 8001 --reload`
- Frontend: `cd frontend && npm run dev`

### 4. Open the UI

Visit [http://localhost:5173](http://localhost:5173).

## API Endpoints

- `GET /api/health`
- `POST /api/chat`
- `GET /api/design/state`
- `POST /api/design/operations`

## Best Next Steps

The current repo is now cleaner and safer, but it is still a foundation. The best next engineering moves are:

1. Move the frontend from vanilla JS to React + TypeScript.
2. Replace the raw JSON document with PostgreSQL-backed project storage.
3. Expand the project model beyond nodes and edges into HLD/LLD concepts, assumptions, constraints, and views.
4. Introduce structured Gemini outputs for design planning and future operation generation.
5. Add retrieval for curated system design knowledge once the core design-state flow is stable.
