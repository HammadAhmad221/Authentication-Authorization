import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    accountAge: 0,
    isVerified: false,
    lastLogin: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/auth/me');
      const userData = response.data.user;
      
      const accountAge = Math.floor(
        (new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)
      );
      
      setStats({
        accountAge,
        isVerified: userData.isVerified || false,
        lastLogin: userData.lastLogin || null
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'user':
        return '#667eea';
      case 'moderator':
        return '#f093fb';
      case 'admin':
        return '#f5576c';
      default:
        return '#667eea';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.username}! 👋</h1>
            <p style={{ color: '#666', marginTop: '5px' }}>User Dashboard</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Status Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              👤
            </div>
            <div className="stat-content">
              <h3>Account Status</h3>
              <p className="stat-value">
                {stats.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              📅
            </div>
            <div className="stat-content">
              <h3>Account Age</h3>
              <p className="stat-value">{stats.accountAge} days</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              🛡️
            </div>
            <div className="stat-content">
              <h3>Role</h3>
              <p className="stat-value" style={{ textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="user-info-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Username:</strong> 
              <span>{user?.username}</span>
            </div>
            <div className="info-item">
              <strong>Email:</strong> 
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <strong>Role:</strong> 
              <span 
                className="role-badge" 
                style={{ 
                  background: getRoleColor(user?.role),
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}
              >
                {user?.role}
              </span>
            </div>
            {stats.lastLogin && (
              <div className="info-item">
                <strong>Last Login:</strong> 
                <span>{new Date(stats.lastLogin).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button 
              onClick={() => navigate('/profile')} 
              className="action-card"
            >
              <span className="action-icon">⚙️</span>
              <span className="action-text">Edit Profile</span>
            </button>
            {!stats.isVerified && (
              <button 
                onClick={() => {
                  toast.info('Check your email for verification link');
                }} 
                className="action-card"
              >
                <span className="action-icon">📧</span>
                <span className="action-text">Verify Email</span>
              </button>
            )}
            <button 
              onClick={() => navigate('/profile')} 
              className="action-card"
            >
              <span className="action-icon">🔒</span>
              <span className="action-text">Security Settings</span>
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        {stats.accountAge === 0 && (
          <div className="welcome-message">
            <h3>🎉 Welcome to the platform!</h3>
            <p>This is your first day. Start by updating your profile and exploring the features.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

