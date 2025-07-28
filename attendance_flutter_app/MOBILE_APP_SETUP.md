# Quick Setup Guide - Mobile App

## 🚀 Quick Start

### Option 1: Download APK (Recommended)
1. **Download**: [Latest APK v1.0.2](https://github.com/SpookyW2003/Attendance-lunch-Management/releases/latest/download/app-release.apk)
2. **Install**: Enable "Unknown Sources" and install APK
3. **Backend**: Start backend server (see below)
4. **Login**: Use demo credentials

### Option 2: Build from Source
```bash
cd attendance_flutter_app
flutter pub get
flutter build apk --release
```

## 🖥️ Backend Server Setup

### Start Backend Server
```bash
# Option 1: Navigate to backend folder
cd backend
npm start

# Option 2: Use PowerShell script (Windows)
PowerShell -ExecutionPolicy Bypass -File start-backend.ps1
```

### Verify Backend is Running
- Open browser and visit: http://192.168.1.8:5000/api/health
- Should see: `{"status":"OK","timestamp":"...","message":"Attendance and Lunch Management System API is running"}`

## 📱 Mobile App Features

### Network Auto-Discovery
The app automatically tries these endpoints:
- `http://192.168.1.8:5000/api` (Your network IP)
- `http://localhost:5000/api` (Local development)
- `http://127.0.0.1:5000/api` (Loopback)
- `http://10.0.2.2:5000/api` (Android emulator)

### Demo Credentials
- **Admin**: admin@demo.com / password123
- **Employee (DDp)**: employee@demo.com / password123
- **Chef**: chef@demo.com / password123

## 🔧 Troubleshooting

### Connection Issues
1. **Ensure backend is running**: Check http://192.168.1.8:5000/api/health
2. **Same network**: Make sure phone and computer are on same WiFi
3. **Firewall**: Temporarily disable Windows Firewall to test
4. **MongoDB**: Ensure MongoDB service is running

### Common Fixes
```bash
# Restart MongoDB
net start MongoDB

# Check if port 5000 is in use
netstat -an | findstr :5000

# Kill any existing node processes
taskkill /f /im node.exe
```

## 📊 App Capabilities

### Role-Based Access
- **Admin**: User management, reports, analytics
- **Employee**: Mark attendance, view history
- **Chef**: Lunch planning, count notifications

### Features
- ✅ Automatic endpoint discovery
- ✅ Retry logic with intelligent backoff
- ✅ Offline credential caching
- ✅ Material Design UI
- ✅ Role-specific dashboards
- ✅ QR code integration ready
- ✅ Location services ready
- ✅ Push notifications ready

## 🛡️ Security
- JWT token authentication
- Secure local storage
- Encrypted SharedPreferences
- Input validation
- Rate limiting protection

---

**Need Help?** Check the backend console output for any error messages.
