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

Write-Host "`n✨ Deployment folder updated!" -ForegroundColor Green
Write-Host "📦 Ready to upload deploy/ folder to Apache server" -ForegroundColor Cyan

