# PowerShell script to update deployment folder
# Run this after making changes to copy files to deploy/

Write-Host "🔄 Updating deployment folder..." -ForegroundColor Cyan

# Copy main files
Copy-Item -Path "index.html" -Destination "deploy\index.html" -Force
Write-Host "✅ Copied index.html" -ForegroundColor Green

Copy-Item -Path "app.obf.js" -Destination "deploy\app.obf.js" -Force
Write-Host "✅ Copied app.obf.js" -ForegroundColor Green

Copy-Item -Path "style.css" -Destination "deploy\style.css" -Force
Write-Host "✅ Copied style.css" -ForegroundColor Green

Copy-Item -Path ".htaccess" -Destination "deploy\.htaccess" -Force
Write-Host "✅ Copied .htaccess" -ForegroundColor Green

# Copy traffic counter files
if (Test-Path "traffic-counter.js") {
    Copy-Item -Path "traffic-counter.js" -Destination "deploy\traffic-counter.js" -Force
    Write-Host "✅ Copied traffic-counter.js" -ForegroundColor Green
}
if (Test-Path "traffic-api.php") {
    Copy-Item -Path "traffic-api.php" -Destination "deploy\traffic-api.php" -Force
    Write-Host "✅ Copied traffic-api.php" -ForegroundColor Green
}

# Copy Netlify function
if (Test-Path "netlify\functions\traffic-api.js") {
    if (-not (Test-Path "deploy\netlify\functions")) {
        New-Item -ItemType Directory -Path "deploy\netlify\functions" -Force | Out-Null
    }
    Copy-Item -Path "netlify\functions\traffic-api.js" -Destination "deploy\netlify\functions\traffic-api.js" -Force
    Write-Host "✅ Copied Netlify function" -ForegroundColor Green
}
if (Test-Path "netlify.toml") {
    Copy-Item -Path "netlify.toml" -Destination "deploy\netlify.toml" -Force
    Write-Host "✅ Copied netlify.toml" -ForegroundColor Green
}

# Copy logo
if (Test-Path "assets\images\cyberkit-logo.png") {
    Copy-Item -Path "assets\images\cyberkit-logo.png" -Destination "deploy\assets\images\cyberkit-logo.png" -Force
    Write-Host "✅ Copied logo" -ForegroundColor Green
} else {
    Write-Host "⚠️  Logo not found" -ForegroundColor Yellow
}

# Verify app.js is NOT copied
if (Test-Path "deploy\app.js") {
    Remove-Item "deploy\app.js" -Force
    Write-Host "⚠️  Removed app.js from deploy (source code protection)" -ForegroundColor Yellow
}

# CRITICAL: Remove traffic-data.json from deploy folder if it exists
# This file must NEVER be in deploy folder - it's created on the server!
if (Test-Path "deploy\traffic-data.json") {
    Remove-Item "deploy\traffic-data.json" -Force
    Write-Host "⚠️  Removed traffic-data.json from deploy (must stay on server only!)" -ForegroundColor Yellow
}

# Also remove any backup files
if (Test-Path "deploy\traffic-data.json.backup") {
    Remove-Item "deploy\traffic-data.json.backup" -Force
    Write-Host "⚠️  Removed traffic-data.json.backup from deploy" -ForegroundColor Yellow
}

Write-Host "`n✅ Safety checks passed:" -ForegroundColor Green
Write-Host "   - app.js removed (source code protection)" -ForegroundColor Gray
Write-Host "   - traffic-data.json removed (server-only file)" -ForegroundColor Gray
Write-Host "`n⚠️  IMPORTANT: When uploading to server, DO NOT overwrite traffic-data.json" -ForegroundColor Yellow
Write-Host "📊 The stats file is on the server and must be preserved!" -ForegroundColor Yellow
Write-Host "💡 See DEPLOY-WITH-STATS-PRESERVATION.md for details" -ForegroundColor Cyan
Write-Host "`n✨ Deployment folder updated!" -ForegroundColor Green
Write-Host "📦 Ready to upload deploy/ folder to Netlify or Apache server" -ForegroundColor Cyan
Write-Host "`n📝 Changes included:" -ForegroundColor Cyan
Write-Host "   - Updated index.html (Contact Me link added)" -ForegroundColor Gray
Write-Host "   - All files synced to deploy folder" -ForegroundColor Gray

