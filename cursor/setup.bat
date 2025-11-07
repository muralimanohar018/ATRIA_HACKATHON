@echo off
echo 🚀 Setting up Mastersolis Infotech Project...
echo.

REM Create backend .env file
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo ✅ Created backend\.env
    )
) else (
    echo ⚠️  backend\.env already exists, skipping...
)

REM Create frontend .env file
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Created .env
    )
) else (
    echo ⚠️  .env already exists, skipping...
)

REM Setup backend
echo.
echo 🐍 Setting up Python backend...
cd backend

if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -q -r requirements.txt

cd ..

REM Setup frontend
echo.
echo 📦 Setting up Node.js frontend...
cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
) else (
    echo Node modules already installed, skipping...
)

cd ..

echo.
echo ✨ Setup complete!
echo.
echo To start the backend:
echo   cd backend ^&^& .venv\Scripts\activate ^&^& python app.py
echo.
echo To start the frontend (in a new terminal):
echo   cd frontend ^&^& npm run dev

pause

