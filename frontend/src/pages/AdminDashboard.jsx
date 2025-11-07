import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalModerators: 0,
    totalRegularUsers: 0,
    verifiedUsers: 0,
    accountAge: 0,
    lastLogin: null
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch all users
      const usersResponse = await axios.get('/user/all');
      const allUsers = usersResponse.data.users || [];
      setUsers(allUsers);

      // Fetch current user stats
      const userResponse = await axios.get('/auth/me');
      const userData = userResponse.data.user;

      // Calculate statistics
      const totalUsers = allUsers.length;
      const totalAdmins = allUsers.filter(u => u.role === 'admin').length;
      const totalModerators = allUsers.filter(u => u.role === 'moderator').length;
      const totalRegularUsers = allUsers.filter(u => u.role === 'user').length;
      const verifiedUsers = allUsers.filter(u => u.isVerified).length;

      const accountAge = Math.floor(
        (new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)
      );

      setStats({
        totalUsers,
        totalAdmins,
        totalModerators,
        totalRegularUsers,
        verifiedUsers,
        accountAge,
        lastLogin: userData.lastLogin || null
      });
    } catch (error) {
      toast.error('Failed to fetch admin statistics');
      console.error('Error fetching admin stats:', error);
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
      case 'admin':
        return '#f5576c';
      case 'moderator':
        return '#f093fb';
      case 'user':
        return '#667eea';
      default:
        return '#667eea';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div>Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card" style={{ maxWidth: '1200px' }}>
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard 👑</h1>
            <p style={{ color: '#666', marginTop: '5px' }}>Welcome, {user?.username}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Admin Badge */}
        <div className="role-banner" style={{ 
          background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '24px' }}>👑</span>
          <div>
            <h3 style={{ margin: 0 }}>Administrator Access</h3>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
              Full system access and management capabilities
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              👥
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <p className="stat-label">All Platform Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' }}>
              👑
            </div>
            <div className="stat-content">
              <h3>Admins</h3>
              <p className="stat-value">{stats.totalAdmins}</p>
              <p className="stat-label">Administrators</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              🛡️
            </div>
            <div className="stat-content">
              <h3>Moderators</h3>
              <p className="stat-value">{stats.totalModerators}</p>
              <p className="stat-label">Platform Moderators</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              ✅
            </div>
            <div className="stat-content">
              <h3>Verified</h3>
              <p className="stat-value">{stats.verifiedUsers}</p>
              <p className="stat-label">Verified Accounts</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="quick-actions">
          <h2>Admin Actions</h2>
          <div className="actions-grid">
            <button 
              onClick={() => navigate('/admin')} 
              className="action-card"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <span className="action-icon">👥</span>
              <span className="action-text">Manage Users</span>
            </button>
            <button 
              onClick={() => {
                toast.info('System settings feature coming soon');
              }} 
              className="action-card"
              style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            >
              <span className="action-icon">⚙️</span>
              <span className="action-text">System Settings</span>
            </button>
            <button 
              onClick={() => {
                toast.info('Analytics dashboard coming soon');
              }} 
              className="action-card"
              style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
            >
              <span className="action-icon">📊</span>
              <span className="action-text">Analytics</span>
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="action-card"
              style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
            >
              <span className="action-icon">🔒</span>
              <span className="action-text">Security</span>
            </button>
          </div>
        </div>

        {/* User List Preview */}
        <div className="user-info-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Recent Users ({users.length})</h2>
            <button 
              onClick={() => navigate('/admin')} 
              className="action-btn"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              View All Users
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px' }}>{u.username}</td>
                    <td style={{ padding: '12px' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span 
                        className="role-badge" 
                        style={{ 
                          background: getRoleColor(u.role),
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {u.isVerified ? '✅ Verified' : '⏳ Pending'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length > 5 && (
              <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
                Showing 5 of {users.length} users. <button 
                  onClick={() => navigate('/admin')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#667eea', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  View all
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Admin Account Info */}
        <div className="info-box" style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          borderLeft: '4px solid #f5576c'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>📊 Platform Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div>
              <strong>Regular Users:</strong> {stats.totalRegularUsers}
            </div>
            <div>
              <strong>Moderators:</strong> {stats.totalModerators}
            </div>
            <div>
              <strong>Admins:</strong> {stats.totalAdmins}
            </div>
            <div>
              <strong>Verified Users:</strong> {stats.verifiedUsers}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

