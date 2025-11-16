@echo off
REM Backup traffic stats before deployment
REM Run this BEFORE uploading new files to server

echo 📊 Backing up traffic stats...

REM Check if traffic-data.json exists on server
REM This assumes you're in the server directory or have access
if exist "traffic-data.json" (
    copy /Y traffic-data.json traffic-data.json.backup
    echo ✅ Backup created: traffic-data.json.backup
    echo 📝 After deployment, restore with: copy traffic-data.json.backup traffic-data.json
) else (
    echo ⚠️  traffic-data.json not found (no stats to backup yet)
)

echo.
echo 💡 TIP: Always backup stats before deploying updates!
pause

