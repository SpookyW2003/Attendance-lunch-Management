Write-Host "======================================"
Write-Host "Attendance & Lunch Management System"
Write-Host "Status Check" 
Write-Host "======================================"
Write-Host ""

Write-Host "1. Backend Server:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://192.168.1.8:5000/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✓ Backend running on port 5000" -ForegroundColor Green
} catch {
    Write-Host "   X Backend not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Frontend Server:" -ForegroundColor Yellow
$frontendTest = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
if ($frontendTest.TcpTestSucceeded) {
    Write-Host "   ✓ Frontend running on port 3000" -ForegroundColor Green 
} else {
    Write-Host "   X Frontend not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Mobile App Server:" -ForegroundColor Yellow
$mobileTest = Test-NetConnection -ComputerName localhost -Port 8081 -WarningAction SilentlyContinue
if ($mobileTest.TcpTestSucceeded) {
    Write-Host "   ✓ Mobile app running on port 8081" -ForegroundColor Green
} else {
    Write-Host "   X Mobile app not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================"
Write-Host "Access URLs:"
Write-Host "======================================"
Write-Host "Backend API: http://192.168.1.8:5000/api/health"
Write-Host "Frontend:    http://localhost:3000"  
Write-Host "Mobile Web:  http://localhost:8081"
Write-Host "Mobile QR:   exp://192.168.1.8:8081"

Write-Host ""
Write-Host "Demo Credentials:"
Write-Host "Admin:    admin@demo.com / password123"
Write-Host "Employee: employee@demo.com / password123" 
Write-Host "Chef:     chef@demo.com / password123"
