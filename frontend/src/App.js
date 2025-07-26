import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Authentication components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Employee components
import Dashboard from './pages/employee/Dashboard';
import AttendanceCalendar from './pages/employee/AttendanceCalendar';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import Profile from './pages/employee/Profile';

// Admin components
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AttendanceReports from './pages/admin/AttendanceReports';
import Analytics from './pages/admin/Analytics';

// Chef components
import ChefDashboard from './pages/chef/ChefDashboard';
import LunchPlanning from './pages/chef/LunchPlanning';

import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Common routes for all authenticated users */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Employee routes */}
          <Route 
            path="attendance" 
            element={
              <ProtectedRoute allowedRoles={['employee', 'admin']}>
                <AttendanceCalendar />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="attendance/history" 
            element={
              <ProtectedRoute allowedRoles={['employee', 'admin']}>
                <AttendanceHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/register" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Register />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AttendanceReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/analytics" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          
          {/* Chef routes */}
          <Route 
            path="chef" 
            element={
              <ProtectedRoute allowedRoles={['chef', 'admin']}>
                <ChefDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="chef/planning" 
            element={
              <ProtectedRoute allowedRoles={['chef', 'admin']}>
                <LunchPlanning />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

// PWA Install Component
function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <button 
      className={`install-prompt ${showInstall ? 'show' : ''}`}
      onClick={handleInstallClick}
    >
      📱 Install App
    </button>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
        <PWAInstallPrompt />
      </div>
    </AuthProvider>
  );
}

export default App;
