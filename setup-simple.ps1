# ASM-Studio Pro - Simple Setup Script
# Run with: .\setup-simple.ps1

param(
    [switch]$Docker,
    [switch]$Dev
)

Write-Host ""
Write-Host "ASM-Studio Pro Setup" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    Write-Host ""
    Write-Host "Steps to fix:" -ForegroundColor Yellow
    Write-Host "1. Open Docker Desktop from Start menu" -ForegroundColor White
    Write-Host "2. Wait for it to fully start (check system tray)" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Create .env files if they don't exist
Write-Host ""
Write-Host "Checking environment files..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[CREATED] Root .env file" -ForegroundColor Yellow
        Write-Host "IMPORTANT: Edit .env and add your GEMINI_API_KEY" -ForegroundColor Red
    }
} else {
    Write-Host "[OK] Root .env exists" -ForegroundColor Green
}

if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "[CREATED] Backend .env file" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] Backend .env exists" -ForegroundColor Green
}

if (-not (Test-Path "ai-engine\.env")) {
    if (Test-Path "ai-engine\.env.example") {
        Copy-Item "ai-engine\.env.example" "ai-engine\.env"
        Write-Host "[CREATED] AI Engine .env file" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] AI Engine .env exists" -ForegroundColor Green
}

if ($Docker) {
    # Docker Mode
    Write-Host ""
    Write-Host "Starting in Docker Mode..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Building Docker images..." -ForegroundColor Yellow
    docker-compose build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Docker images built" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Docker build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Starting all services..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] All services started" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to start services" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "Application URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend:    http://localhost" -ForegroundColor White
    Write-Host "  Backend:     http://localhost:3001" -ForegroundColor White
    Write-Host "  Health:      http://localhost:3001/health" -ForegroundColor White
    Write-Host ""
    Write-Host "View logs:   docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "Stop:        docker-compose down" -ForegroundColor Yellow
    Write-Host ""
    
} elseif ($Dev) {
    # Development Mode
    Write-Host ""
    Write-Host "Starting in Development Mode..." -ForegroundColor Cyan
    Write-Host ""
    
    # Install dependencies if needed
    if (-not (Test-Path "backend\node_modules")) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        Push-Location backend
        npm install
        Pop-Location
    }
    
    if (-not (Test-Path "frontend\node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Push-Location frontend
        npm install
        Pop-Location
    }
    
    if (-not (Test-Path "ai-engine\node_modules")) {
        Write-Host "Installing AI engine dependencies..." -ForegroundColor Yellow
        Push-Location ai-engine
        npm install
        Pop-Location
    }
    
    Write-Host ""
    Write-Host "Starting MongoDB and Redis..." -ForegroundColor Yellow
    docker-compose up mongodb redis -d
    
    Start-Sleep -Seconds 3
    
    $mongoRunning = docker ps --filter "name=asmstudio-mongodb" --filter "status=running" -q
    $redisRunning = docker ps --filter "name=asmstudio-redis" --filter "status=running" -q
    
    if ($mongoRunning -and $redisRunning) {
        Write-Host "[OK] MongoDB and Redis are running" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to start MongoDB or Redis" -ForegroundColor Red
        Write-Host ""
        Write-Host "Checking logs..." -ForegroundColor Yellow
        docker-compose logs mongodb redis
        exit 1
    }
    
    Write-Host ""
    Write-Host "Connection Information:" -ForegroundColor Cyan
    Write-Host "  MongoDB: mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin" -ForegroundColor White
    Write-Host "  Redis:   redis://localhost:6379" -ForegroundColor White
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Open a new terminal and run:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Open another terminal and run:" -ForegroundColor Yellow
    Write-Host "   cd frontend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Application URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:     http://localhost:3001" -ForegroundColor White
    Write-Host "  Health:      http://localhost:3001/health" -ForegroundColor White
    Write-Host ""
    Write-Host "To stop MongoDB/Redis: docker-compose down" -ForegroundColor Yellow
    Write-Host ""
    
} else {
    # Show help
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-simple.ps1 -Dev     # Development mode (recommended)"
    Write-Host "  .\setup-simple.ps1 -Docker  # Full Docker mode"
    Write-Host ""
    Write-Host "Development Mode:" -ForegroundColor Yellow
    Write-Host "  - MongoDB and Redis in Docker"
    Write-Host "  - Backend and Frontend run locally with hot-reload"
    Write-Host ""
    Write-Host "Docker Mode:" -ForegroundColor Yellow
    Write-Host "  - Everything runs in Docker containers"
    Write-Host ""
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
