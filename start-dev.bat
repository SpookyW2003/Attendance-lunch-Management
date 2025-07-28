@echo off
echo Starting Attendance and Lunch Management System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo =====================================================
echo  Attendance and Lunch Management System Started!
echo =====================================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo =====================================================
echo.
echo Demo Login Credentials:
echo  Admin:    admin@demo.com / password123
echo  Employee: employee@demo.com / password123
echo  Chef:     chef@demo.com / password123
echo.
pause
