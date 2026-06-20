@echo off
echo Starting DiagramMaker Setup...

echo.
echo Setting up Backend Environment...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Installing Backend Dependencies...
call venv\Scripts\python -m pip install -r requirements.txt

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
) else (
    findstr /C:"GROQ_API_KEY" .env >nul
    if errorlevel 1 (
        echo Updating existing .env with GROQ_API_KEY...
        echo.>> .env
        echo # Added by setup.bat >> .env
        echo GROQ_API_KEY=your_groq_api_key_here >> .env
    )
)
cd ..

echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo Setup Complete!
echo Next steps: Add your GROQ_API_KEY to backend\.env and run scripts\start.bat
pause
