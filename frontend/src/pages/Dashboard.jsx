import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome to Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="user-info">
          <h2>User Information</h2>
          <div className="info-item">
            <strong>Username:</strong> {user?.username}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="info-item">
            <strong>Role:</strong> <span className="role-badge">{user?.role}</span>
          </div>
          <div className="info-item">
            <strong>User ID:</strong> {user?.id}
          </div>
        </div>

        <div className="dashboard-actions">
          <button 
            onClick={() => navigate('/profile')} 
            className="action-btn"
          >
            View Profile
          </button>
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')} 
              className="action-btn admin-btn"
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

