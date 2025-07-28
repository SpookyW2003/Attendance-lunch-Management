# Attendance & Lunch Management System - Flutter Mobile App

A cross-platform mobile application built with Flutter for the Attendance and Lunch Management System.

## 📱 Download APK

**🔗 [Download Latest APK](https://github.com/SpookyW2003/Attendance-lunch-Management/releases/latest/download/app-release.apk)** | **📋 [View Release Notes](https://github.com/SpookyW2003/Attendance-lunch-Management/releases/latest)**

### 📲 Quick Download Options:

| Method | Link |
|--------|------|
| 🔗 **Direct Download** | [app-release.apk](https://github.com/SpookyW2003/Attendance-lunch-Management/releases/latest/download/app-release.apk) |
| 📱 **QR Code** | Scan with your phone: `https://qr.io/attendance-app` |
| 📋 **Release Page** | [All Releases](https://github.com/SpookyW2003/Attendance-lunch-Management/releases) |

> **📱 App Size**: ~21.7 MB | **⚠️ Requirements**: Android 5.0+ (API 21)

### 🚀 Quick Installation Steps:
1. **Download**: Click the download link above or scan QR code
2. **Enable**: Allow "Install from Unknown Sources" in Android settings
3. **Install**: Tap the APK file and follow installation wizard
4. **Launch**: Open the app and use demo credentials below
5. **Login**: Use any of the demo accounts to explore features

## Features

- **Authentication**: Login with role-based access (Admin, Employee, Chef)
- **Dashboard**: Role-specific dashboards with relevant quick actions
- **Material Design**: Modern UI following Material Design guidelines
- **API Integration**: Connects to Node.js backend server
- **Local Storage**: Secure token storage for persistent login
- **Cross-Platform**: Supports Android and iOS

## Prerequisites

- Flutter SDK (3.8.1 or higher)
- Android Studio (for Android development)
- VS Code or Android Studio IDE
- Backend server running on `http://localhost:5000`

## Installation

1. **Install dependencies**:
   ```bash
   flutter pub get
   ```

2. **Run the app**:
   ```bash
   flutter run
   ```

## Building APK

### Option 1: Using the batch script
```bash
./build-apk.bat
```

### Option 2: Manual build
```bash
# Clean previous builds
flutter clean

# Get dependencies
flutter pub get

# Build release APK
flutter build apk --release
```

The APK will be generated at: `build/app/outputs/flutter-apk/app-release.apk`

## Demo Credentials

- **Admin**: admin@demo.com / password123
- **Employee (DDp)**: employee@demo.com / password123
- **Chef**: chef@demo.com / password123

## Project Structure

```
lib/
├── main.dart              # App entry point
├── screens/
│   ├── login_screen.dart  # Login interface
│   └── dashboard_screen.dart  # Role-based dashboard
├── services/
│   └── auth_service.dart  # Authentication API calls
└── models/               # Data models (future expansion)
```

## Key Dependencies

- `http`: API communication
- `shared_preferences`: Local data storage
- `intl`: Date/time formatting
- `qr_code_scanner`: QR code functionality
- `camera`: Camera access
- `permission_handler`: Device permissions
- `geolocator`: Location services
- `firebase_messaging`: Push notifications

## API Integration

The app connects to the backend server at `http://localhost:5000/api` for:

- User authentication (`/auth/login`)
- Token verification (`/auth/verify`)
- User data retrieval

## Development

### Running in debug mode
```bash
flutter run --debug
```

### Running in release mode
```bash
flutter run --release
```

### Building for specific platform
```bash
# Android APK
flutter build apk --release

# Android App Bundle (for Play Store)
flutter build appbundle --release

# iOS (requires macOS and Xcode)
flutter build ios --release
```

## Troubleshooting

### Common Issues

1. **Backend connection failed**: Ensure the Node.js backend is running on port 5000
2. **Dependencies issues**: Run `flutter pub get` to reinstall packages
3. **Build issues**: Run `flutter clean` then rebuild

### Network Configuration

For testing on physical devices, update the `baseUrl` in `lib/services/auth_service.dart`:

```dart
// Change from localhost to your computer's IP address
static const String baseUrl = 'http://YOUR_IP_ADDRESS:5000/api';
```

## Future Enhancements

- [ ] Biometric authentication
- [ ] Offline mode support
- [ ] Real-time notifications
- [ ] QR code attendance scanning
- [ ] Geofencing for attendance
- [ ] Photo capture for attendance
- [ ] Report generation
- [ ] Dark mode support

## Support

For issues and support, check:
1. Backend server is running
2. All dependencies are installed
3. Flutter SDK is properly configured
4. Device/emulator has internet connectivity

---

**Note**: This app requires the backend server to be running for full functionality. Start the backend with `npm run dev` from the backend directory.
