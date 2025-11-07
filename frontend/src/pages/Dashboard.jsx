import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from './UserDashboard';
import ModeratorDashboard from './ModeratorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'moderator') {
    return <ModeratorDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default Dashboard;

