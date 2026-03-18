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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthMode('login');
  };

  if (!user) {
    return authMode === 'login' ? (
      <Login
        onLogin={setUser}
        goToRegister={() => setAuthMode('register')}
      />
    ) : (
      <Register
        onRegister={setUser}
        goToLogin={() => setAuthMode('login')}
      />
    );
  }

  return <Dashboard onLogout={handleLogout} user={user} />;
}

export default App;