# PowerShell script to backup traffic stats before deployment
# Run this BEFORE uploading new files to server

Write-Host "📊 Backing up traffic stats..." -ForegroundColor Cyan

# Check if traffic-data.json exists
if (Test-Path "traffic-data.json") {
    $backupName = "traffic-data.json.backup"
    Copy-Item -Path "traffic-data.json" -Destination $backupName -Force
    Write-Host "✅ Backup created: $backupName" -ForegroundColor Green
    Write-Host "📝 After deployment, restore with:" -ForegroundColor Yellow
    Write-Host "   Copy-Item -Path '$backupName' -Destination 'traffic-data.json' -Force" -ForegroundColor Gray
} else {
    Write-Host "⚠️  traffic-data.json not found (no stats to backup yet)" -ForegroundColor Yellow
}

Write-Host "`n💡 TIP: Always backup stats before deploying updates!" -ForegroundColor Cyan

