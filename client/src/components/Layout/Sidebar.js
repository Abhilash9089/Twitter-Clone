import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🔍' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/messages', label: 'Messages', icon: '✉️' },
    { path: `/profile/${user?.id}`, label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="sidebar">
      <div className="logo">Twitter</div>
      
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link to="/" className="btn btn-primary tweet-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
        Tweet
      </Link>

      <div className="user-info" onClick={logout}>
        <img
          src={user?.profileImageUrl || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="user-avatar"
        />
        <div className="user-details">
          <h4>{user?.fullName}</h4>
          <p>@{user?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;