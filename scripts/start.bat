@echo off
echo Starting DiagramMaker Services in this terminal...
echo.

set PYTHON_CMD=python
if exist "backend\venv\Scripts\python.exe" (
    set PYTHON_CMD=backend\venv\Scripts\python
)

echo [1/2] Starting Backend Service (Port 8001)...
start /b %PYTHON_CMD% -m uvicorn app.main:app --port 8001 --reload --app-dir backend

echo [2/2] Starting Frontend Dev Server...
echo.
cd frontend && npm run dev
