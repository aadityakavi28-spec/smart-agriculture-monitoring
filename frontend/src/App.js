import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authMode, setAuthMode] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthMode('login');
  };

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

  return <Dashboard onLogout={handleLogout} user={user} />;
}

export default App;