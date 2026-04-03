import React, { useState, useEffect } from 'react';
import '../styles/user-profile.css';

const UserProfile = ({ user, onLogout }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [stats, setStats] = useState({
    loginCount: user?.loginCount || 0,
    lastLogin: user?.lastLogin || null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
    setEditMode(false);
  };

  const formatDate = (date) => {
    if (!date) return 'Never logged in';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="user-profile">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <p className="avatar-name">{user?.name || 'User'}</p>
          </div>

          {editMode ? (
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-actions">
                <button onClick={handleSaveProfile} className="btn-save">
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setProfile({
                      name: user?.name || '',
                      email: user?.email || '',
                    });
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.name || '-'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email || '-'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Role</span>
                <span className={`info-value role-badge role-${user?.role}`}>
                  {user?.role || 'user'}
                </span>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="btn-edit-profile"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Statistics Card */}
        <div className="stats-card">
          <h2>Activity Statistics</h2>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">📊</span>
              <span>Total Logins</span>
            </div>
            <div className="stat-value">{stats.loginCount}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">🕐</span>
              <span>Last Login</span>
            </div>
            <div className="stat-value">{formatDate(stats.lastLogin)}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">📅</span>
              <span>Member Since</span>
            </div>
            <div className="stat-value">{formatDate(user?.createdAt)}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">🔐</span>
              <span>Account Status</span>
            </div>
            <div className={`stat-value status-${user?.isActive ? 'active' : 'inactive'}`}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="security-info">
        <h2>Security</h2>
        <div className="security-item">
          <div className="security-content">
            <span className="security-icon">🔒</span>
            <div>
              <p className="security-label">Password</p>
              <p className="security-desc">Keep your password strong and unique</p>
            </div>
          </div>
          <button className="btn-change-password" disabled>
            Change Password
          </button>
        </div>

        <div className="security-item">
          <div className="security-content">
            <span className="security-icon">📱</span>
            <div>
              <p className="security-label">Two-Factor Authentication</p>
              <p className="security-desc">Add an extra layer of security</p>
            </div>
          </div>
          <button className="btn-enable-2fa" disabled>
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
