# Simple backend starter
Write-Host "Starting ASM-Studio Backend..." -ForegroundColor Cyan
Write-Host ""

# Kill any process on port 3001
$connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($connection) {
    $processId = $connection.OwningProcess
    Write-Host "Stopping existing process (PID: $processId)..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
}

Write-Host "Starting backend on port 3001..." -ForegroundColor Green
Write-Host ""

npm run dev
