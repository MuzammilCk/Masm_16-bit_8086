# Kill any existing backend process on port 3001
Write-Host "🔍 Checking for existing processes on port 3001..." -ForegroundColor Cyan

$existingProcess = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | 
    Select-Object -First 1 -ExpandProperty OwningProcess

if ($existingProcess) {
    Write-Host "⚠️  Found process $existingProcess on port 3001. Terminating..." -ForegroundColor Yellow
    Stop-Process -Id $existingProcess -Force
    Start-Sleep -Seconds 1
    Write-Host "✅ Process terminated" -ForegroundColor Green
} else {
    Write-Host "✅ Port 3001 is free" -ForegroundColor Green
}

# Start the backend
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host "Backend will run on http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Cyan
Write-Host ""

npm run dev
