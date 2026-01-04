@echo off
REM TaskFlow Lite - Demo Setup Guide (Windows)
REM This file provides instructions for setting up and running demos

echo.
echo ==========================================
echo TaskFlow Lite - Demo Setup Guide
echo ==========================================
echo.
echo Demo accounts for testing the application:
echo.
echo Account 1 (Product Lead):
echo   Email:    alice@taskflow.demo
echo   Password: Demo@123
echo   Role:     Team Leader
echo.
echo Account 2 (Developer):
echo   Email:    bob@taskflow.demo
echo   Password: Demo@123
echo   Role:     Team Member
echo.
echo Account 3 (Developer):
echo   Email:    charlie@taskflow.demo
echo   Password: Demo@123
echo   Role:     Team Member
echo.
echo Account 4 (Marketing Lead):
echo   Email:    diana@taskflow.demo
echo   Password: Demo@123
echo   Role:     Team Leader
echo.
echo Account 5 (Admin):
echo   Email:    eve@taskflow.demo
echo   Password: Demo@123
echo   Role:     Admin
echo.
echo ==========================================
echo Database Demo Data
echo ==========================================
echo.
echo To populate the database with demo data:
echo.
echo Option 1 - Using PostgreSQL Client:
echo   1. Open Command Prompt or PowerShell
echo   2. Run: psql -U postgres -d taskflow_lite
echo   3. In PostgreSQL: \i task-flow-lite.session.sql
echo   4. Exit: \q
echo.
echo Option 2 - Using Command Line:
echo   psql -U postgres -d taskflow_lite -f task-flow-lite.session.sql
echo.
echo ==========================================
echo Demo Data Includes:
echo ==========================================
echo.
echo * 5 Demo Users (different roles)
echo * 3 Demo Teams (Product, Marketing, Design)
echo * 11 Demo Tasks (various statuses/priorities)
echo * 13 Activity Logs (showing task lifecycle)
echo.
echo Demo data uses IDs ending with '_demo' for easy identification.
echo.
echo ==========================================
echo Quick Start Steps
echo ==========================================
echo.
echo 1. Ensure database migrations are complete:
echo    cd server
echo    npm run migrate
echo.
echo 2. Load demo data (optional):
echo    psql -U postgres -d taskflow_lite -f task-flow-lite.session.sql
echo.
echo 3. Start the backend server:
echo    cd server
echo    npm run dev
echo.
echo 4. In another terminal, start the frontend:
echo    cd client
echo    npm run dev
echo.
echo 5. Open browser and register:
echo    http://localhost:5173/register
echo    Email: alice@taskflow.demo
echo    Password: Demo@123
echo.
echo 6. Login and explore the features!
echo.
echo ==========================================
echo Demo Features to Explore
echo ==========================================
echo.
echo After logging in, try:
echo - Creating a new team
echo - Adding team members
echo - Creating tasks with different priorities
echo - Updating task status
echo - Viewing team analytics
echo - Checking activity logs
echo.
echo ==========================================
echo Testing Scenarios
echo ==========================================
echo.
echo Scenario 1 - Single User:
echo   - Register one account
echo   - Create team
echo   - Create tasks
echo   - Update statuses
echo   - View analytics
echo.
echo Scenario 2 - Multiple Users:
echo   - Register Account A (alice)
echo   - Register Account B (bob)
echo   - Account A creates team and adds B
echo   - Both users create/update tasks
echo   - View team analytics
echo.
echo Scenario 3 - Full Workflow:
echo   - Create team with members
echo   - Create 10+ tasks
echo   - Update multiple task statuses
echo   - Check analytics calculations
echo   - Review activity history
echo.
echo ==========================================
echo Additional Resources
echo ==========================================
echo.
echo For more information, see:
echo - DEMO_GUIDE.md - Detailed demo instructions
echo - START_HERE.md - Quick start guide
echo - SETUP_GUIDE.md - Complete setup instructions
echo.
pause
