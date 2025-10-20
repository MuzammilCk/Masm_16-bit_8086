# ASM-Studio Pro - Complete Setup and Run Script
# This script will set up and start the entire project

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

param(
    [switch]$Docker,
    [switch]$Dev,
    [switch]$Help
)

function Show-Help {
    Write-Host ""
    Write-Host "ASM-Studio Pro - Setup and Run Script" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-and-run.ps1 -Dev     # Run in development mode (recommended)"
    Write-Host "  .\setup-and-run.ps1 -Docker  # Run everything in Docker"
    Write-Host "  .\setup-and-run.ps1 -Help    # Show this help"
    Write-Host ""
    Write-Host "Development Mode:" -ForegroundColor Yellow
    Write-Host "  - MongoDB and Redis in Docker"
    Write-Host "  - Backend and Frontend run locally with hot-reload"
    Write-Host ""
    Write-Host "Docker Mode:" -ForegroundColor Yellow
    Write-Host "  - Everything runs in Docker containers"
    Write-Host "  - Production-like environment"
    Write-Host ""
    exit
}

if ($Help) {
    Show-Help
}

Write-Host ""
Write-Host "🚀 ASM-Studio Pro Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "📦 Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if .env exists
Write-Host ""
Write-Host "🔑 Checking environment files..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Root .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Please edit .env and add your GEMINI_API_KEY" -ForegroundColor Yellow
        Write-Host "   Get your key from: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
        notepad .env
    }
}

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Backend .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
    }
}

if (-not (Test-Path "ai-engine\.env")) {
    Write-Host "⚠️  AI Engine .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path "ai-engine\.env.example") {
        Copy-Item "ai-engine\.env.example" "ai-engine\.env"
    }
}

Write-Host "✅ Environment files ready" -ForegroundColor Green

# Check Node.js
Write-Host ""
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

if ($Docker) {
    # Docker Mode
    Write-Host ""
    Write-Host "🐳 Starting in Docker Mode..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "📦 Building Docker images..." -ForegroundColor Yellow
    docker-compose build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker images built successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "🚀 Starting all services..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ All services started" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to start services" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend:    http://localhost" -ForegroundColor White
    Write-Host "   Backend:     http://localhost:3001" -ForegroundColor White
    Write-Host "   Health:      http://localhost:3001/health" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 View logs:" -ForegroundColor Yellow
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Stop services:" -ForegroundColor Yellow
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
    
} elseif ($Dev) {
    # Development Mode
    Write-Host ""
    Write-Host "💻 Starting in Development Mode..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check if node_modules exist
    $needsInstall = $false
    
    if (-not (Test-Path "backend\node_modules")) {
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        Push-Location backend
        npm install
        Pop-Location
        $needsInstall = $true
    }
    
    if (-not (Test-Path "frontend\node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        Push-Location frontend
        npm install
        Pop-Location
        $needsInstall = $true
    }
    
    if (-not (Test-Path "ai-engine\node_modules")) {
        Write-Host "📦 Installing AI engine dependencies..." -ForegroundColor Yellow
        Push-Location ai-engine
        npm install
        Pop-Location
        $needsInstall = $true
    }
    
    if ($needsInstall) {
        Write-Host "✅ Dependencies installed" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🗄️  Starting MongoDB and Redis..." -ForegroundColor Yellow
    docker-compose up mongodb redis -d
    
    Start-Sleep -Seconds 3
    
    $mongoRunning = docker ps --filter "name=asmstudio-mongodb" --filter "status=running" -q
    $redisRunning = docker ps --filter "name=asmstudio-redis" --filter "status=running" -q
    
    if ($mongoRunning -and $redisRunning) {
        Write-Host "✅ MongoDB and Redis are running" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to start MongoDB or Redis" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "📝 Connection Information:" -ForegroundColor Cyan
    Write-Host "   MongoDB: mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin" -ForegroundColor White
    Write-Host "   Redis:   redis://localhost:6379" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  Open a new terminal and run:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "2️⃣  Open another terminal and run:" -ForegroundColor Yellow
    Write-Host "   cd frontend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:     http://localhost:3001" -ForegroundColor White
    Write-Host "   Health:      http://localhost:3001/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop MongoDB and Redis:" -ForegroundColor Yellow
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
    
} else {
    Show-Help
}

Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
