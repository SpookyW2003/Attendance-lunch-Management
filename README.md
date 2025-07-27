# 🏢 Attendance and Lunch Management System

[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A comprehensive **full-stack attendance and lunch management system** with **web application**, **mobile app**, and **backend API**. Features role-based access control, real-time attendance tracking, automated notifications, and cross-platform mobile support.

## 📱 Download Mobile App

### Android APK
🔗 **[Download Latest APK](https://github.com/SpookyW2003/Attendance-lunch-Management/releases/latest/download/app-release.apk)**

*📝 Note: Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub repository details*

The apk is not working but all the code re working fine. I need pull rquest to fix it.

### Demo Credentials
- **👨‍💼 Admin**: `admin@demo.com` / `password123`
- **👨‍💻 Employee**: `employee@demo.com` / `password123`  
- **👨‍🍳 Chef**: `chef@demo.com` / `password123`

## 📚 Table of Contents

- [📱 Download Mobile App](#-download-mobile-app)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#%EF%B8%8F-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [💻 Installation](#-installation)
- [👥 User Roles](#-user-roles)
- [📈 API Documentation](#-api-documentation)
- [📦 Deployment](#-deployment)
- [🔧 Contributing](#-contributing)
- [📝 License](#-license)

## ✨ Features

### 🎥 Core Functionality
- **📊 Employee Attendance Tracking**: Mark daily attendance with status options (Office/Home/Leave)
- **⏰ 9:30 AM Cutoff System**: Intelligent handling of late attendance marking with automatic next-day assignment
- **📅 Weekend Exclusion**: Smart weekend detection with no attendance tracking on non-working days
- **🔔 Automated Chef Notifications**: Daily 9:30 AM notifications with precise office headcount for lunch planning
- **📆 Interactive Calendar**: Advanced calendar interface for planning future attendance
- **🔐 Role-based Access Control**: Secure multi-role system (Admin, Employee, Chef) with permission-based features

### 📱 Cross-Platform Support
- **🌐 Web Application**: Responsive React.js web interface accessible from any browser
- **📱 Mobile Application**: Native Flutter app for Android and iOS with offline capability
- **🖥️ Desktop Ready**: PWA support for desktop installation
- **🔄 Real-time Sync**: Live data synchronization across all platforms

### 🔒 Security Features
- **🔑 JWT Authentication**: Secure token-based authentication system
- **🛡️ Role-based Authorization**: Granular permission control per user role
- **🔐 Password Encryption**: Bcrypt hashing for secure password storage
- **🚦 Rate Limiting**: API protection against abuse and DDoS attacks
- **✔️ Input Validation**: Comprehensive data validation and sanitization
- **🌐 CORS Protection**: Secure cross-origin resource sharing configuration

### User Roles

#### Employee
- Mark daily attendance before 9:30 AM
- Plan future attendance using calendar
- View attendance history and statistics
- Update profile and preferences

#### Chef
- Receive daily notifications at 9:30 AM with office count
- View lunch planning dashboard
- Access historical lunch counts

#### Admin
- Manage all users (create, update, deactivate)
- View comprehensive attendance reports
- Access analytics and trends
- Export attendance data
- Override attendance records

## 🛠️ Technology Stack

### 🖥️ Backend
| Technology | Purpose | Version |
|------------|---------|----------|
| **Node.js** | Runtime Environment | v14+ |
| **Express.js** | Web Framework | ^4.18.2 |
| **MongoDB** | Database | ^7.5.0 |
| **Mongoose** | ODM | ^7.5.0 |
| **JWT** | Authentication | ^9.0.2 |
| **Firebase Admin** | Push Notifications | ^11.10.1 |
| **Nodemailer** | Email Service | ^6.9.4 |
| **Node-cron** | Task Scheduling | ^3.0.2 |
| **Bcrypt** | Password Hashing | ^2.4.3 |
| **Helmet** | Security Headers | ^7.0.0 |

### 🌐 Frontend (Web)
| Technology | Purpose | Version |
|------------|---------|----------|
| **React.js** | UI Framework | ^18.0.0 |
| **React Router** | Navigation | ^6.0.0 |
| **Axios** | HTTP Client | ^1.0.0 |
| **React Icons** | Icon Library | ^4.0.0 |
| **React Calendar** | Date Picker | ^4.0.0 |
| **Chart.js** | Data Visualization | ^4.0.0 |
| **CSS3** | Styling | - |

### 📱 Mobile App (Flutter)
| Technology | Purpose | Version |
|------------|---------|----------|
| **Flutter** | Cross-platform Framework | ^3.32.8 |
| **Dart** | Programming Language | ^3.8.1 |
| **Material Design** | UI Components | ^3.0.0 |
| **HTTP** | API Integration | ^1.1.0 |
| **SharedPreferences** | Local Storage | ^2.2.2 |
| **Intl** | Internationalization | ^0.19.0 |
| **QR Code Scanner** | QR Functionality | ^1.0.1 |
| **Geolocator** | Location Services | ^10.1.0 |

## 🚀 Quick Start

### Option 1: One-Command Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd attendance-lunch-management

# Install all dependencies and start development servers
npm run install-all
npm run dev
```

### Option 2: Mobile App Only
```bash
# Download the APK directly
wget https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/latest/download/app-release.apk

# Or scan this QR code (replace with actual QR)
# [QR CODE PLACEHOLDER]
```

## 💻 Installation

### 📋 Prerequisites
| Requirement | Version | Download Link |
|-------------|---------|---------------|
| **Node.js** | v14+ | [Download](https://nodejs.org/) |
| **MongoDB** | v4.4+ | [Download](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [Download](https://git-scm.com/) |
| **Flutter** (for mobile) | v3.8+ | [Download](https://flutter.dev/docs/get-started/install) |
| **Android Studio** (for APK) | Latest | [Download](https://developer.android.com/studio) |

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_lunch_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Firebase Configuration (optional)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

### Full Stack Setup

From the root directory, you can run both servers simultaneously:

```bash
npm install
npm run install-all
npm run dev
```

### Mobile App Setup (Flutter)

#### Prerequisites
- Flutter SDK (3.8.1 or higher)
- Android Studio (for Android development)
- Android SDK with API level 21 or higher

#### Installation

1. Navigate to the Flutter app directory:
```bash
cd attendance_flutter_app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app (with backend server running):
```bash
flutter run
```

#### Building Android APK

**Option 1: Using the build script**
```bash
./build-apk.bat
```

**Option 2: Manual build**
```bash
flutter build apk --release
```

#### 📱 Download APK

🔗 **[Download Latest APK](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/latest/download/app-release.apk)**

*Note: Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub repository details*

#### Mobile App Features
- **Cross-platform**: Works on Android and iOS
- **Role-based UI**: Different interfaces for Admin, Employee, and Chef
- **Secure Authentication**: JWT token-based login with persistent sessions
- **Material Design**: Modern, intuitive user interface
- **Offline Capability**: Local storage for user preferences
- **Demo Credentials**: Quick access buttons for testing different roles

## 👥 User Roles

### 📋 Default Demo Users
| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **👨‍💼 Admin** | admin@demo.com | password123 | Full System Access |
| **👨‍💻 Employee** | employee@demo.com | password123 | Attendance & Profile |
| **👨‍🍳 Chef** | chef@demo.com | password123 | Lunch Management |

### 📊 Permission Matrix
| Feature | Admin | Employee | Chef |
|---------|-------|----------|------|
| Mark Attendance | ✅ | ✅ | ❌ |
| View Reports | ✅ | 🔒 Own Only | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Lunch Planning | ✅ | ❌ | ✅ |
| System Settings | ✅ | ❌ | ❌ |

## 📈 API Documentation

### 🔑 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/login` | User authentication | ❌ |
| `POST` | `/api/auth/register` | New user registration | 🔒 Admin |
| `GET` | `/api/auth/profile` | Get user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |
| `POST` | `/api/auth/logout` | User logout | ✅ |

### 📅 Attendance Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/attendance/mark` | Mark daily attendance | ✅ |
| `GET` | `/api/attendance/today` | Get today's attendance | ✅ |
| `GET` | `/api/attendance/history` | Get attendance history | ✅ |
| `GET` | `/api/attendance/stats` | Get attendance statistics | ✅ |
| `GET` | `/api/attendance/calendar` | Get calendar data | ✅ |

### 👨‍💼 Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/users` | Get all users | 🔒 Admin |
| `GET` | `/api/admin/dashboard/stats` | Dashboard statistics | 🔒 Admin |
| `GET` | `/api/admin/attendance/reports` | Attendance reports | 🔒 Admin |
| `POST` | `/api/admin/users` | Create new user | 🔒 Admin |
| `PUT` | `/api/admin/users/:id` | Update user | 🔒 Admin |
| `DELETE` | `/api/admin/users/:id` | Deactivate user | 🔒 Admin |

### 👨‍🍳 Chef/Notifications Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/notifications/chef/today-count` | Today's office count | 🔒 Chef |
| `GET` | `/api/chef/lunch/orders` | Lunch orders | 🔒 Chef |
| `POST` | `/api/chef/menu` | Update menu | 🔒 Chef |

## Key Features Implementation

### 9:30 AM Cutoff Logic
The system automatically handles the 9:30 AM cutoff:
- Attendance marked before 9:30 AM counts for the current day
- Attendance marked after 9:30 AM is considered for the next working day
- Users are notified about this behavior

### Weekend Handling
- No attendance can be marked for weekends (Saturday & Sunday)
- System automatically skips weekends when calculating next working day
- Chef notifications are not sent on weekends

### Chef Notifications
- Automated daily notifications at exactly 9:30 AM
- Only shows the count of employees working from office
- Supports both email and push notifications
- No individual employee data is shared

### Security Features
- JWT-based authentication
- Role-based authorization
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS protection

## Project Structure

```
attendance-lunch-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   ├── admin.js
│   │   └── notifications.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   ├── cronJobs.js
│   │   └── notificationService.js
│   ├── utils/
│   │   └── dateUtils.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   └── public/
├── attendance_flutter_app/
│   ├── lib/
│   │   ├── screens/
│   │   │   ├── login_screen.dart
│   │   │   └── dashboard_screen.dart
│   │   ├── services/
│   │   │   └── auth_service.dart
│   │   ├── models/
│   │   └── main.dart
│   ├── android/
│   ├── build-apk.bat
│   ├── pubspec.yaml
│   └── README.md
└── README.md
```

## 🖼️ Screenshots

### 🌐 Web Application
```
[Web App Login]     [Admin Dashboard]     [Employee Dashboard]
[    Screenshot   ]  [    Screenshot    ]  [    Screenshot    ]
[   Placeholder  ]   [   Placeholder   ]   [   Placeholder   ]
```

### 📱 Mobile Application
```
[Mobile Login]      [Mobile Dashboard]    [Attendance View]
[  Screenshot   ]   [   Screenshot    ]   [  Screenshot   ]
[  Placeholder  ]   [   Placeholder   ]   [  Placeholder  ]
```

## 📦 Deployment

### 🌐 Production Deployment Options

#### 🔊 Backend Deployment
| Platform | Complexity | Cost | Features |
|----------|------------|------|-----------|
| **Heroku** | 🟢 Easy | Free/Paid | Auto-deploy, Add-ons |
| **Railway** | 🟢 Easy | Free/Paid | Git integration |
| **DigitalOcean** | 🟡 Medium | Paid | Full control, Droplets |
| **AWS EC2** | 🔴 Hard | Paid | Scalable, Enterprise |
| **Vercel** | 🟢 Easy | Free/Paid | Serverless functions |

#### 🎬 Frontend Deployment
| Platform | Complexity | Cost | Features |
|----------|------------|------|-----------|
| **Netlify** | 🟢 Easy | Free/Paid | CDN, Forms, Functions |
| **Vercel** | 🟢 Easy | Free/Paid | Git integration, Preview |
| **GitHub Pages** | 🟢 Easy | Free | Static hosting |
| **AWS S3** | 🟡 Medium | Paid | Global CDN |

#### 📱 Mobile App Distribution
| Platform | Cost | Review Time | Features |
|----------|------|-------------|----------|
| **Google Play Store** | $25 (one-time) | 2-3 days | Official, Updates |
| **GitHub Releases** | Free | Instant | Direct APK download |
| **Firebase App Distribution** | Free | Instant | Beta testing |
| **Apple App Store** | $99/year | 1-7 days | iOS distribution |

### 🚀 Quick Deploy Commands

#### Automated Deployment
```bash
# Deploy everything with one command
npm run deploy:all

# Deploy individual components
npm run deploy:backend    # Deploy backend to Heroku
npm run deploy:frontend   # Deploy frontend to Netlify
npm run deploy:mobile     # Build and release APK
```

#### Manual Deployment Steps
```bash
# 1. Backend (Heroku example)
heroku create your-app-backend
git subtree push --prefix backend heroku main

# 2. Frontend (Netlify example)
npm run build
cp build/* ./dist/
# Upload dist/ folder to Netlify

# 3. Mobile (GitHub Releases)
flutter build apk --release
# Upload APK to GitHub Releases
```

## 🔧 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Check existing issues before creating new ones
- Provide detailed steps to reproduce
- Include system information and screenshots

### ✨ Feature Requests
- Explain the use case and benefits
- Provide mockups or examples if possible
- Discuss implementation approach

### 📝 Code Contributions
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.

## 📧 Support & Community

### 👥 Getting Help
- **🐛 Issues**: [Create an issue](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/issues) for bugs or feature requests
- **💬 Discussions**: [Join discussions](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/discussions) for questions and ideas
- **📚 Documentation**: Check our [Wiki](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/wiki) for detailed guides
- **📧 Email**: Contact the development team at `your-email@example.com`

### 🔗 Links
- **🌐 Live Demo**: [View Demo](https://your-demo-url.com)
- **📈 API Docs**: [Postman Collection](https://documenter.getpostman.com/view/your-collection)
- **🔄 Changelog**: [View Releases](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases)

---

## ⚠️ Important Notes

- **🔔 Notifications**: Configure email and Firebase settings for full notification functionality
- **📱 Mobile Network**: For physical device testing, update API baseUrl to your computer's IP address
- **🔒 Security**: Change default passwords and JWT secrets in production
- **📋 Database**: Use MongoDB Atlas or similar cloud database for production deployment

---

<div align="center">

### 🌟 Made with ❤️ by [Your Name]

**If this project helped you, please consider giving it a ⭐ star!**

[📱 Download APK](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/releases/latest/download/app-release.apk) • [🌐 Live Demo](https://your-demo-url.com) • [📈 Documentation](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/wiki)

---

*Built with Node.js, React, Flutter, and MongoDB* • *Licensed under MIT*

</div>
