# GitHub Release Script for Attendance Management System
param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

Write-Host "🚀 Creating GitHub Release v$Version" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build APK
Write-Host "📱 Building Android APK..." -ForegroundColor Yellow
cd attendance_flutter_app

try {
    flutter clean
    flutter pub get
    flutter build apk --release
    Write-Host "✅ APK built successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ APK build failed!" -ForegroundColor Red
    exit 1
}

cd ..

# Step 2: Check if APK exists
$apkPath = "attendance_flutter_app\build\app\outputs\flutter-apk\app-release.apk"
if (-Not (Test-Path $apkPath)) {
    Write-Host "❌ APK file not found at: $apkPath" -ForegroundColor Red
    exit 1
}

$apkSize = (Get-Item $apkPath).Length / 1MB
Write-Host "📦 APK Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Gray

# Step 3: Instructions for GitHub Release
Write-Host ""
Write-Host "📋 MANUAL STEPS TO CREATE GITHUB RELEASE:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push your code to GitHub (if not already done):" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Add Flutter mobile app'" -ForegroundColor Gray  
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create a new release on GitHub:" -ForegroundColor Yellow
Write-Host "   • Go to your repository on GitHub" -ForegroundColor Gray
Write-Host "   • Click 'Releases' → 'Create a new release'" -ForegroundColor Gray
Write-Host "   • Tag version: v$Version" -ForegroundColor Gray
Write-Host "   • Release title: Attendance & Lunch Management v$Version" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Upload the APK file:" -ForegroundColor Yellow
Write-Host "   • Drag and drop: $apkPath" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Use this description:" -ForegroundColor Yellow
Write-Host ""
Write-Host "## 📱 Attendance & Lunch Management System" -ForegroundColor White
Write-Host ""
Write-Host "### Download APK:" -ForegroundColor White
Write-Host "- **Android**: Download the 'app-release.apk' file below" -ForegroundColor White
Write-Host ""
Write-Host "### Demo Credentials:" -ForegroundColor White
Write-Host "- **Admin**: admin@demo.com / password123" -ForegroundColor White
Write-Host "- **Employee**: employee@demo.com / password123" -ForegroundColor White
Write-Host "- **Chef**: chef@demo.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "### Features:" -ForegroundColor White
Write-Host "- ✅ Role-based authentication" -ForegroundColor White
Write-Host "- ✅ Attendance tracking" -ForegroundColor White
Write-Host "- ✅ Lunch management" -ForegroundColor White
Write-Host "- ✅ Material Design UI" -ForegroundColor White
Write-Host "- ✅ Offline capability" -ForegroundColor White
Write-Host ""
Write-Host "### Installation:" -ForegroundColor White
Write-Host "1. Download the APK file" -ForegroundColor White
Write-Host "2. Enable 'Unknown Sources' in Android Settings" -ForegroundColor White
Write-Host "3. Install the APK" -ForegroundColor White
Write-Host "4. Make sure backend server is running" -ForegroundColor White
Write-Host ""
Write-Host "5. Publish the release!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 Your download link will be:" -ForegroundColor Green
Write-Host "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/download/v$Version/app-release.apk" -ForegroundColor Blue
