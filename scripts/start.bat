@echo off
echo Starting DiagramMaker Services in this terminal...

set PYTHON_CMD=python
if exist "backend\venv\Scripts\python.exe" (
    set PYTHON_CMD=.\venv\Scripts\python
)

echo Starting Backend Service (Port 8001)...
start cmd /k "cd backend && %PYTHON_CMD% -m uvicorn app.main:app --port 8001 --reload"
cd frontend && npm run dev
