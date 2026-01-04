@echo off
REM TaskFlow Lite - Quick Start Setup Script for Windows
REM This script helps set up the entire application

echo.
echo ==========================================
echo TaskFlow Lite - Quick Start Setup
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js 16+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% detected
echo.

REM Check PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: PostgreSQL is not installed. Please install PostgreSQL 12+ first.
    echo Visit: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)
echo [OK] PostgreSQL detected
echo.

REM Ask for PostgreSQL password
set /p PG_PASSWORD="Enter PostgreSQL admin password (default: postgres): "
if "%PG_PASSWORD%"=="" set PG_PASSWORD=postgres

REM Create database
echo.
echo Creating taskflow_lite database...
set PGPASSWORD=%PG_PASSWORD%
psql -U postgres -h localhost -c "CREATE DATABASE taskflow_lite;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database created successfully
) else (
    echo [WARNING] Database might already exist, continuing...
)
set PGPASSWORD=

REM Setup Server
echo.
echo ==========================================
echo Setting up Backend Server
echo ==========================================
echo.
cd server

REM Update .env file
echo Updating server\.env with database credentials...
REM Note: This requires a more complex replace in Windows, so we'll skip the automated update
REM User should manually update the .env file
echo [WARNING] Please manually update server\.env with your PostgreSQL password
echo Looking for: DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/taskflow_lite"
echo.

REM Install dependencies
echo Installing server dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)

REM Generate Prisma Client
echo.
echo Generating Prisma Client...
call npm run prisma:generate
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to generate Prisma Client
    cd ..
    pause
    exit /b 1
)

REM Run migrations
echo.
echo Running database migrations...
call npm run migrate
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to run migrations
    echo Make sure your PostgreSQL credentials are correct in .env
    cd ..
    pause
    exit /b 1
)

echo [OK] Backend setup complete!

REM Setup Client
echo.
echo ==========================================
echo Setting up Frontend Client
echo ==========================================
echo.
cd ..\client

REM Install dependencies
echo Installing client dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install client dependencies
    cd ..\..
    pause
    exit /b 1
)

echo [OK] Frontend setup complete!

REM Print completion message
echo.
echo ==========================================
echo Setup Complete! 
echo ==========================================
echo.
echo Next steps:
echo.
echo 1. Open TWO terminal windows
echo.
echo Terminal 1 - Start the backend server:
echo    cd server
echo    npm run dev
echo.
echo Terminal 2 - Start the frontend:
echo    cd client
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo 4. Register or login to start using TaskFlow Lite!
echo.
pause
