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

echo.
echo ✨ Deployment folder updated!
echo 📦 Ready to upload deploy/ folder to Apache server
pause

