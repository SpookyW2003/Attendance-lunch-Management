Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Attendance & Lunch Management System" -ForegroundColor Cyan
Write-Host "System Status Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Backend Server
Write-Host "1. Backend Server (Node.js/Express):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://192.168.1.8:5000/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Backend server is running on port 5000" -ForegroundColor Green
        Write-Host "   URL: http://192.168.1.8:5000/api/health" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Backend server is not running" -ForegroundColor Red
    Write-Host "   💡 Start with: cd backend; npm run dev" -ForegroundColor Gray
}

# Check Frontend Server
Write-Host ""
Write-Host "2. Frontend Server (React):" -ForegroundColor Yellow
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "   ✅ Frontend server is running on port 3000" -ForegroundColor Green
        Write-Host "   📍 URL: http://localhost:3000" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Frontend server is not running" -ForegroundColor Red
        Write-Host "   💡 Start with: cd frontend; npm start" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Frontend server is not running" -ForegroundColor Red
}

# Check Mobile Server
Write-Host ""
Write-Host "3. Mobile App Server (Expo):" -ForegroundColor Yellow
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 8081 -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "   ✅ Mobile app server is running on port 8081" -ForegroundColor Green
        Write-Host "   📍 Web: http://localhost:8081" -ForegroundColor Gray
        Write-Host "   📱 Mobile: exp://192.168.1.8:8081" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Mobile app server is not running" -ForegroundColor Red
        Write-Host "   💡 Start with: cd attendance-mobile; npx expo start" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Mobile app server is not running" -ForegroundColor Red
}

# Check Database Connection
Write-Host ""
Write-Host "4. Database Connection:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://192.168.1.8:5000/api/health" -UseBasicParsing -TimeoutSec 5
    $content = $response.Content | ConvertFrom-Json
    if ($content.status -eq "OK") {
        Write-Host "   ✅ Database connection is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Database connection failed" -ForegroundColor Red
    Write-Host "   💡 Check MongoDB connection in backend/.env" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Demo Credentials:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Admin:    admin@demo.com / password123" -ForegroundColor White
Write-Host "Employee: employee@demo.com / password123" -ForegroundColor White
Write-Host "Chef:     chef@demo.com / password123" -ForegroundColor White

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Quick Start Commands:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Backend:  cd backend; npm run dev" -ForegroundColor White
Write-Host "Frontend: cd frontend; npm start" -ForegroundColor White
Write-Host "Mobile:   cd attendance-mobile; npx expo start" -ForegroundColor White

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
