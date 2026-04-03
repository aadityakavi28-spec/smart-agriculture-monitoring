import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState('auth');
  const [authMode, setAuthMode] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('farming');
    }
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage('farming');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('auth');
    setAuthMode('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // If user is not logged in, show auth pages
  if (!user) {
    return authMode === 'login' ? (
      <Login
        onLogin={handleLogin}
        goToRegister={() => setAuthMode('register')}
      />
    ) : (
      <Register
        onRegister={handleRegister}
        goToLogin={() => setAuthMode('login')}
      />
    );
  }

  // Admin can access admin dashboard
  if (user.role === 'admin' && currentPage === 'admin') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // User can access profile page
  if (currentPage === 'profile') {
    return (
      <UserProfile
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Farming dashboard for all logged-in users
  return (
    <Dashboard
      onLogout={handleLogout}
      user={user}
      onNavigate={handleNavigate}
    />
  );
}

export default App;