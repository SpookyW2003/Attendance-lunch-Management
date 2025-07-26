Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Attendance & Lunch Management System" -ForegroundColor Cyan
Write-Host "System Status Check" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Backend Server
Write-Host "1. Backend Server (Node.js/Express):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Backend server is running on port 5000" -ForegroundColor Green
        Write-Host "   URL: http://localhost:5000/api/health" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Backend server is not running" -ForegroundColor Red
    Write-Host "   💡 Start with: cd backend; npm run dev" -ForegroundColor Gray
}

# Check Frontend Server
Write-Host ""
Write-Host "2. Frontend Server (React):" -ForegroundColor Yellow
try {
    $connection3000 = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
    $connection3001 = Test-NetConnection -ComputerName localhost -Port 3001 -WarningAction SilentlyContinue
    
    if ($connection3000.TcpTestSucceeded) {
        Write-Host "   ✅ Frontend server is running on port 3000" -ForegroundColor Green
        Write-Host "   📍 URL: http://localhost:3000" -ForegroundColor Gray
    } elseif ($connection3001.TcpTestSucceeded) {
        Write-Host "   ✅ Frontend server is running on port 3001" -ForegroundColor Green
        Write-Host "   📍 URL: http://localhost:3001" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Frontend server is not running" -ForegroundColor Red
        Write-Host "   💡 Start with: cd frontend; npm start" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Frontend server is not running" -ForegroundColor Red
}

# Check Flutter App
Write-Host ""
Write-Host "3. Mobile App (Flutter):" -ForegroundColor Yellow
try {
    $flutterCheck = flutter doctor --machine 2>$null | ConvertFrom-Json
    if ($flutterCheck) {
        Write-Host "   ✅ Flutter is installed and configured" -ForegroundColor Green
        Write-Host "   📱 Run with: cd attendance_flutter_app; flutter run" -ForegroundColor Gray
        Write-Host "   📦 Build APK: cd attendance_flutter_app; flutter build apk --release" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Flutter not found or not configured" -ForegroundColor Red
    Write-Host "   💡 Install Flutter SDK: https://flutter.dev/docs/get-started/install" -ForegroundColor Gray
}

# Check Database Connection
Write-Host ""
Write-Host "4. Database Connection:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
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
Write-Host "Flutter:  cd attendance_flutter_app; flutter run" -ForegroundColor White
Write-Host "APK:      cd attendance_flutter_app; flutter build apk --release" -ForegroundColor White

Write-Host ""
Write-Host "🎉 System updated! Expo removed, Flutter ready for Android APK!" -ForegroundColor Green
