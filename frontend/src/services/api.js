import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          if (data.error?.includes('expired') || data.error?.includes('invalid')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (data.error) {
            toast.error(data.error);
          }
          break;
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other errors
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  updateFCMToken: (fcmToken) => api.put('/auth/fcm-token', { fcmToken }),
  verifyToken: () => api.get('/auth/verify'),
};

// Attendance API calls
export const attendanceAPI = {
  markAttendance: (attendanceData) => api.post('/attendance/mark', attendanceData),
  getToday: () => api.get('/attendance/today'),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  getHistory: (params = {}) => api.get('/attendance/history', { params }),
  getStats: (params = {}) => api.get('/attendance/stats', { params }),
  deleteAttendance: (date) => api.delete(`/attendance/date/${date}`),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
  getAttendanceReports: (params = {}) => api.get('/admin/attendance/reports', { params }),
  getUserAttendance: (userId, params = {}) => api.get(`/admin/attendance/user/${userId}`, { params }),
  getAttendanceAnalytics: (params = {}) => api.get('/admin/attendance/analytics', { params }),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  exportAttendance: (params = {}) => api.get('/admin/attendance/export', { params }),
};

// Chef API calls
export const chefAPI = {
  getTodayCount: () => api.get('/chef/today-count'),
  getWeeklyCount: (params = {}) => api.get('/chef/weekly-count', { params }),
  getLunchHistory: (params = {}) => api.get('/chef/lunch-history', { params }),
  updateLunchPlanning: (planningData) => api.post('/chef/lunch-planning', planningData),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Utility functions
export const apiUtils = {
  // Format date for API calls
  formatDate: (date) => {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  },
  
  // Parse date from API response
  parseDate: (dateString) => {
    return new Date(dateString);
  },
  
  // Handle file download
  downloadFile: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    }
  },
};

export default api;
