import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarCheck, 
  FaHome, 
  FaBuilding, 
  FaClock, 
  FaExclamationTriangle,
  FaChartLine,
  FaUsers,
  FaUtensils
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI, adminAPI } from '../../services/api';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeInfo, setTimeInfo] = useState({
    currentTime: new Date(),
    canMarkToday: false,
    isAfterCutoff: false
  });

  useEffect(() => {
    fetchDashboardData();
    
    // Update time every minute
    const timer = setInterval(() => {
      setTimeInfo(prev => ({
        ...prev,
        currentTime: new Date()
      }));
    }, 60000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user.role === 'employee' || user.role === 'admin') {
        const [todayResponse, statsResponse] = await Promise.all([
          attendanceAPI.getToday(),
          attendanceAPI.getStats()
        ]);
        
        setTodayAttendance(todayResponse.data.attendance);
        setTimeInfo({
          currentTime: new Date(),
          canMarkToday: todayResponse.data.canMarkToday,
          isAfterCutoff: todayResponse.data.isAfterCutoff
        });
        setStats(statsResponse.data.stats);
      }
      
      if (user.role === 'admin') {
        const adminStatsResponse = await adminAPI.getDashboardStats();
        setStats(prev => ({
          ...prev,
          ...adminStatsResponse.data.stats
        }));
      }
      
      if (user.role === 'chef') {
        const chefStatsResponse = await api.get('/chef/today-count');
        setStats(chefStatsResponse.data);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = timeInfo.currentTime.getHours();
    const name = user.name.split(' ')[0];
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'office': return '#28a745';
      case 'home': return '#007bff';
      case 'leave': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getAttendanceStatusLabel = (status) => {
    switch (status) {
      case 'office': return 'Working from Office';
      case 'home': return 'Working from Home';
      case 'leave': return 'On Leave';
      default: return 'Not Marked';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}</h1>
          <p className="current-time">
            Current time: {formatTime(timeInfo.currentTime)}
          </p>
          {timeInfo.isAfterCutoff && (
            <div className="cutoff-warning">
              <FaExclamationTriangle />
              <span>After 9:30 AM cutoff - attendance will be marked for next working day</span>
            </div>
          )}
        </div>
        
        <div className="user-role-badge">
          <span className={`role-badge role-${user.role}`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Employee/Admin Dashboard */}
      {(user.role === 'employee' || user.role === 'admin') && (
        <>
          {/* Today's Attendance Status */}
          <div className="dashboard-card attendance-status-card">
            <div className="card-header">
              <h2>Today's Attendance</h2>
              <FaCalendarCheck className="card-icon" />
            </div>
            <div className="card-content">
              {todayAttendance ? (
                <div className="attendance-status">
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getAttendanceStatusColor(todayAttendance.status) }}
                  >
                    <div className="status-icon">
                      {todayAttendance.status === 'office' && <FaBuilding />}
                      {todayAttendance.status === 'home' && <FaHome />}
                      {todayAttendance.status === 'leave' && <FaClock />}
                    </div>
                    <div className="status-text">
                      <h3>{getAttendanceStatusLabel(todayAttendance.status)}</h3>
                      <p>Marked at: {new Date(todayAttendance.markedAt).toLocaleTimeString()}</p>
                      {todayAttendance.isLateMarking && (
                        <span className="late-badge">Late Marking</span>
                      )}
                    </div>
                  </div>
                  {todayAttendance.notes && (
                    <div className="attendance-notes">
                      <strong>Notes:</strong> {todayAttendance.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-attendance">
                  <FaExclamationTriangle className="warning-icon" />
                  <h3>Attendance Not Marked</h3>
                  <p>You haven't marked your attendance for today yet.</p>
                  {timeInfo.canMarkToday ? (
                    <Link to="/attendance" className="mark-attendance-btn">
                      Mark Attendance Now
                    </Link>
                  ) : (
                    <p className="cutoff-message">
                      After cutoff time - attendance will be considered for next working day
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon office">
                  <FaBuilding />
                </div>
                <div className="stat-content">
                  <h3>{stats.office || 0}</h3>
                  <p>Days in Office</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon home">
                  <FaHome />
                </div>
                <div className="stat-content">
                  <h3>{stats.home || 0}</h3>
                  <p>Days from Home</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon leave">
                  <FaClock />
                </div>
                <div className="stat-content">
                  <h3>{stats.leave || 0}</h3>
                  <p>Days on Leave</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon total">
                  <FaCalendarCheck />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalDays || 0}</h3>
                  <p>Total Days</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Admin Specific Dashboard */}
      {user.role === 'admin' && (
        <div className="admin-dashboard-section">
          <h2>Admin Overview</h2>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats?.totalUsers || 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon analytics">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>{stats?.todayOfficeCount || 0}</h3>
                <p>In Office Today</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chef Specific Dashboard */}
      {user.role === 'chef' && (
        <div className="chef-dashboard-section">
          <h2>Lunch Planning</h2>
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Today's Lunch Count</h3>
              <FaUtensils className="card-icon" />
            </div>
            <div className="card-content">
              <div className="lunch-count">
                <div className="count-display">
                  <h2>{stats?.officeCount || 0}</h2>
                  <p>Employees in office today</p>
                </div>
                <div className="lunch-details">
                  <p>Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Not available'}</p>
                  <Link to="/chef/planning" className="planning-btn">
                    View Lunch Planning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="card-content">
          <div className="quick-actions">
            {(user.role === 'employee' || user.role === 'admin') && (
              <>
                <Link to="/attendance" className="action-btn primary">
                  <FaCalendarCheck />
                  Mark Attendance
                </Link>
                <Link to="/attendance/history" className="action-btn secondary">
                  <FaChartLine />
                  View History
                </Link>
              </>
            )}
            
            {user.role === 'admin' && (
              <>
                <Link to="/admin/users" className="action-btn secondary">
                  <FaUsers />
                  Manage Users
                </Link>
                <Link to="/admin/reports" className="action-btn secondary">
                  <FaChartLine />
                  View Reports
                </Link>
              </>
            )}
            
            {user.role === 'chef' && (
              <Link to="/chef/planning" className="action-btn primary">
                <FaUtensils />
                Lunch Planning
              </Link>
            )}
            
            <Link to="/profile" className="action-btn secondary">
              <FaUsers />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
