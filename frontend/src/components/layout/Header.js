import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#dc3545';
      case 'chef':
        return '#28a745';
      case 'employee':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <Link to="/dashboard" className="logo">
          <h1>Attendance & Lunch Management</h1>
        </Link>
      </div>

      <div className="header-right">
        <div className="user-menu">
          <button className="user-button" onClick={toggleDropdown}>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span 
                className="user-role" 
                style={{ color: getRoleColor(user?.role) }}
              >
                {user?.role}
              </span>
            </div>
            <div className="user-avatar">
              <FaUser />
            </div>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="user-details">
                  <strong>{user?.name}</strong>
                  <span className="user-email">{user?.email}</span>
                  <span className="user-id">ID: {user?.employeeId}</span>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <Link 
                to="/profile" 
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <FaUser className="dropdown-icon" />
                Profile
              </Link>
              
              <Link 
                to="/settings" 
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <FaCog className="dropdown-icon" />
                Settings
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout-item" 
                onClick={handleLogout}
              >
                <FaSignOutAlt className="dropdown-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {dropdownOpen && (
        <div 
          className="dropdown-backdrop" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
