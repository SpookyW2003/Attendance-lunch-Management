@echo off
echo ====================================
echo Building Flutter APK for Android
echo ====================================
echo.

echo Cleaning previous builds...
flutter clean

echo Getting dependencies...
flutter pub get

echo Building APK (Release)...
flutter build apk --release

echo.
echo ====================================
echo Build completed!
echo ====================================
echo APK Location: build\app\outputs\flutter-apk\app-release.apk

pause
