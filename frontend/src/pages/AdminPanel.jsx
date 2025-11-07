import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Dashboard.css';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user/all');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
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
          <div>Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card" style={{ maxWidth: '900px' }}>
        <div className="dashboard-header">
          <h1>Admin Panel</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="action-btn"
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={fetchUsers} 
            className="action-btn"
            style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
          >
            🔄 Refresh
          </button>
        </div>

        <div className="user-info-section">
          <h2>All Users ({users.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-panel-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span 
                        className="role-badge" 
                        style={{ 
                          background: user.role === 'admin' ? '#f5576c' : 
                                     user.role === 'moderator' ? '#f093fb' : '#667eea',
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{user.isVerified ? '✅ Verified' : '⏳ Pending'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

