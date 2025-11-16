@echo off
echo 🔄 Updating deployment folder...

REM Copy main files
copy /Y index.html deploy\index.html >nul
echo ✅ Copied index.html

copy /Y app.obf.js deploy\app.obf.js >nul
echo ✅ Copied app.obf.js

copy /Y style.css deploy\style.css >nul
echo ✅ Copied style.css

copy /Y .htaccess deploy\.htaccess >nul
echo ✅ Copied .htaccess

REM Copy traffic counter files
if exist traffic-counter.js (
    copy /Y traffic-counter.js deploy\traffic-counter.js >nul
    echo ✅ Copied traffic-counter.js
)
REM Skip PHP file for GitHub Pages (PHP not supported)
REM if exist traffic-api.php (
REM     copy /Y traffic-api.php deploy\traffic-api.php >nul
REM     echo ✅ Copied traffic-api.php
REM )

REM Skip Netlify files for GitHub Pages deployment
REM (Uncomment if deploying to Netlify instead)
REM if exist netlify\functions\traffic-api.js (
REM     if not exist deploy\netlify\functions mkdir deploy\netlify\functions
REM     copy /Y netlify\functions\traffic-api.js deploy\netlify\functions\traffic-api.js >nul
REM     echo ✅ Copied Netlify function
REM )
REM if exist netlify.toml (
REM     copy /Y netlify.toml deploy\netlify.toml >nul
REM     echo ✅ Copied netlify.toml
REM )

REM Copy logo
if exist assets\images\cyberkit-logo.png (
    copy /Y assets\images\cyberkit-logo.png deploy\assets\images\cyberkit-logo.png >nul
    echo ✅ Copied logo
) else (
    echo ⚠️  Logo not found
)

REM Verify app.js is NOT copied
if exist deploy\app.js (
    del deploy\app.js >nul
    echo ⚠️  Removed app.js from deploy (source code protection)
)

REM CRITICAL: Remove traffic-data.json from deploy folder if it exists
REM This file must NEVER be in deploy folder - it's created on the server!
if exist deploy\traffic-data.json (
    del deploy\traffic-data.json >nul
    echo ⚠️  Removed traffic-data.json from deploy (must stay on server only!)
)

REM Also remove any backup files
if exist deploy\traffic-data.json.backup (
    del deploy\traffic-data.json.backup >nul
    echo ⚠️  Removed traffic-data.json.backup from deploy
)

echo.
echo ✅ Safety checks passed:
echo    - app.js removed (source code protection)
echo    - traffic-data.json removed (server-only file)
echo.
echo ⚠️  IMPORTANT: When uploading to server, DO NOT overwrite traffic-data.json
echo 📊 The stats file is on the server and must be preserved!
echo 💡 See DEPLOY-WITH-STATS-PRESERVATION.md for details
echo.
echo ✨ Deployment folder updated!
echo 📦 Ready to upload deploy/ folder to Netlify or Apache server
echo.
echo 📝 Changes included:
echo    - Updated index.html (Contact Me link added)
echo    - All files synced to deploy folder
pause

