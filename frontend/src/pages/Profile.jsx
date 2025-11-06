import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>User Profile</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="user-info">
          <h2>Profile Details</h2>
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
          <div className="info-item">
            <strong>Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}
          </div>
        </div>

        <div className="dashboard-actions">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="action-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

