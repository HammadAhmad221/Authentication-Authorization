import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const ModeratorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    accountAge: 0,
    isVerified: false,
    lastLogin: null,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModeratorStats();
  }, []);

  const fetchModeratorStats = async () => {
    try {
      // Fetch user stats
      const userResponse = await axios.get('/auth/me');
      const userData = userResponse.data.user;
      
      // Try to fetch users count (moderators might have limited access)
      let totalUsers = 0;
      try {
        const usersResponse = await axios.get('/user/all');
        totalUsers = usersResponse.data.users?.length || 0;
      } catch (error) {
        // If not authorized, moderators can't see user count
        // This is expected behavior - only admins can access /user/all
        totalUsers = 0;
      }
      
      const accountAge = Math.floor(
        (new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)
      );
      
      setStats({
        accountAge,
        isVerified: userData.isVerified || false,
        lastLogin: userData.lastLogin || null,
        totalUsers
      });
    } catch (error) {
      console.error('Error fetching moderator stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
      <div className="dashboard-card" style={{ maxWidth: '900px' }}>
        <div className="dashboard-header">
          <div>
            <h1>Moderator Dashboard 🛡️</h1>
            <p style={{ color: '#666', marginTop: '5px' }}>Welcome, {user?.username}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Moderator Badge */}
        <div className="role-banner" style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <div>
            <h3 style={{ margin: 0 }}>Moderator Access</h3>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
              You have moderation privileges on this platform
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              👥
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <p className="stat-label">Platform Members</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              📅
            </div>
            <div className="stat-content">
              <h3>Account Age</h3>
              <p className="stat-value">{stats.accountAge}</p>
              <p className="stat-label">Days Active</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              ✅
            </div>
            <div className="stat-content">
              <h3>Status</h3>
              <p className="stat-value">
                {stats.isVerified ? 'Verified' : 'Pending'}
              </p>
              <p className="stat-label">Account Status</p>
            </div>
          </div>
        </div>

        {/* Moderator Tools */}
        <div className="quick-actions">
          <h2>Moderator Tools</h2>
          <div className="actions-grid">
            <button 
              onClick={() => {
                toast.info('User management feature coming soon');
              }} 
              className="action-card"
            >
              <span className="action-icon">👥</span>
              <span className="action-text">Manage Users</span>
            </button>
            <button 
              onClick={() => {
                toast.info('Content moderation feature coming soon');
              }} 
              className="action-card"
            >
              <span className="action-icon">📝</span>
              <span className="action-text">Moderate Content</span>
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="action-card"
            >
              <span className="action-icon">⚙️</span>
              <span className="action-text">Settings</span>
            </button>
            <button 
              onClick={() => {
                toast.info('Reports feature coming soon');
              }} 
              className="action-card"
            >
              <span className="action-icon">📊</span>
              <span className="action-text">View Reports</span>
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="user-info-section">
          <h2>Your Account</h2>
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
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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

        {/* Moderator Info */}
        <div className="info-box" style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          borderLeft: '4px solid #f093fb'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>💡 Moderator Responsibilities</h3>
          <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#666' }}>
            <li>Monitor and moderate user content</li>
            <li>Review and respond to user reports</li>
            <li>Assist in maintaining platform quality</li>
            <li>Help support users when needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;

