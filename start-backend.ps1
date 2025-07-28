# Start the backend server
Write-Host "Starting Attendance & Lunch Management Backend Server..." -ForegroundColor Green

# Change to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Check if MongoDB is running
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB is not running. Please start MongoDB service." -ForegroundColor Yellow
    Write-Host "You can start it with: net start MongoDB" -ForegroundColor Yellow
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "Starting server on port 5000..." -ForegroundColor Green
Write-Host "Backend will be accessible at:" -ForegroundColor Cyan
Write-Host "  Local: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "  Network: http://192.168.1.8:5000/api" -ForegroundColor Cyan
Write-Host "  Health Check: http://192.168.1.8:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm start
