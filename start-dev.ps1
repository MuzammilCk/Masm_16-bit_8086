# ASM-Studio Pro - Development Startup Script
# This script starts MongoDB in Docker and runs backend/frontend locally

Write-Host "🚀 Starting ASM-Studio Pro Development Environment" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "📦 Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Start MongoDB and Redis
Write-Host ""
Write-Host "🗄️  Starting MongoDB and Redis..." -ForegroundColor Yellow
docker-compose up mongodb redis -d

# Wait for MongoDB to be ready
Write-Host "⏳ Waiting for MongoDB to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if MongoDB is running
$mongoRunning = docker ps --filter "name=asmstudio-mongodb" --filter "status=running" -q
if ($mongoRunning) {
    Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB failed to start" -ForegroundColor Red
    exit 1
}

# Check if Redis is running
$redisRunning = docker ps --filter "name=asmstudio-redis" --filter "status=running" -q
if ($redisRunning) {
    Write-Host "✅ Redis is running on port 6379" -ForegroundColor Green
} else {
    Write-Host "❌ Redis failed to start" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Connection Information:" -ForegroundColor Cyan
Write-Host "   MongoDB: mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin" -ForegroundColor White
Write-Host "   Redis:   redis://localhost:6379" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open a new terminal and run: cd backend && npm run dev" -ForegroundColor White
Write-Host "   2. Open another terminal and run: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Health:   http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop MongoDB and Redis:" -ForegroundColor Yellow
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
