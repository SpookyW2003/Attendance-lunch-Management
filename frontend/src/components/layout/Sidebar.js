import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTimes, 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaHistory, 
  FaUsers, 
  FaChartBar, 
  FaUserPlus, 
  FaFileAlt,
  FaUtensils,
  FaClipboardList,
  FaUser
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    // Common items for all users
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FaTachometerAlt,
      roles: ['admin', 'employee', 'chef']
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: FaUser,
      roles: ['admin', 'employee', 'chef']
    },
    
    // Employee/Admin items
    {
      path: '/attendance',
      label: 'Mark Attendance',
      icon: FaCalendarAlt,
      roles: ['employee', 'admin']
    },
    {
      path: '/attendance/history',
      label: 'Attendance History',
      icon: FaHistory,
      roles: ['employee', 'admin']
    },
    
    // Admin only items
    {
      path: '/admin',
      label: 'Admin Dashboard',
      icon: FaTachometerAlt,
      roles: ['admin']
    },
    {
      path: '/admin/users',
      label: 'User Management',
      icon: FaUsers,
      roles: ['admin']
    },
    {
      path: '/admin/register',
      label: 'Add User',
      icon: FaUserPlus,
      roles: ['admin']
    },
    {
      path: '/admin/reports',
      label: 'Attendance Reports',
      icon: FaFileAlt,
      roles: ['admin']
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: FaChartBar,
      roles: ['admin']
    },
    
    // Chef items
    {
      path: '/chef',
      label: 'Chef Dashboard',
      icon: FaUtensils,
      roles: ['chef', 'admin']
    },
    {
      path: '/chef/planning',
      label: 'Lunch Planning',
      icon: FaClipboardList,
      roles: ['chef', 'admin']
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const canAccessItem = (item) => {
    return item.roles.includes(user?.role);
  };

  const filteredMenuItems = menuItems.filter(canAccessItem);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path} className="sidebar-menu-item">
                  <Link
                    to={item.path}
                    className={`sidebar-link ${
                      isActive(item.path) ? 'sidebar-link-active' : ''
                    }`}
                    onClick={onClose}
                  >
                    <IconComponent className="sidebar-icon" />
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar-sidebar">
              <FaUser />
            </div>
            <div className="user-details-sidebar">
              <span className="user-name-sidebar">{user?.name}</span>
              <span className="user-role-sidebar">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
