import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../services/api';
import '../styles/admin.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const usersRes = await adminAPI.getAllUsers();
      const statsRes = await adminAPI.getUserStats();

      setUsers(usersRes.data.data.users || []);
      setStats(statsRes.data.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      fetchData();
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminAPI.changeUserRole(userId, newRole);
      fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Failed to change user role');
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filterStatus !== 'all' && u.isActive !== (filterStatus === 'active')) {
      return false;
    }
    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user?.role || user.role !== 'admin') {
    return (
      <div className="admin-error">
        <div className="error-content">
          <span className="error-icon">🚫</span>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <button onClick={onLogout} className="btn-logout">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage users and monitor system activity</p>
        </div>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <p className="stat-label">Active Users</p>
                  <p className="stat-value">{stats.activeUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <p className="stat-label">Inactive Users</p>
                  <p className="stat-value">{stats.inactiveUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-content">
                  <p className="stat-label">Logins Today</p>
                  <p className="stat-value">{stats.loginsToday}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <p className="stat-label">Active Last Week</p>
                  <p className="stat-value">{stats.activeLastWeek}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <p className="stat-label">Avg Logins</p>
                  <p className="stat-value">{stats.avgLogins}</p>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          <div className="users-section">
            <div className="section-header">
              <h2>Users Management</h2>
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Logins</th>
                    <th>Last Activity</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className={!u.isActive ? 'inactive-row' : ''}>
                      <td className="user-name">
                        <div className="user-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${u.isActive ? 'active' : 'inactive'}`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDate(u.lastLogin)}</td>
                      <td className="text-center">{u.loginCount || 0}</td>
                      <td>{formatDate(u.lastActivity)}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-action btn-toggle"
                          onClick={() => handleToggleUserStatus(u._id)}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {u.isActive ? '🚫' : '🟢'}
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => {
                            setSelectedUser(u);
                            setShowModal(true);
                          }}
                          title="Edit Role"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="empty-state">
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Role Change Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change User Role</h3>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>
                <strong>{selectedUser.name}</strong> ({selectedUser.email})
              </p>
              <p>Current role: <span className="current-role">{selectedUser.role}</span></p>

              <div className="role-options">
                <button
                  className={`role-option ${selectedUser.role === 'user' ? 'selected' : ''}`}
                  onClick={() => handleChangeRole(selectedUser._id, 'user')}
                >
                  <span>👤</span>
                  <span>User</span>
                </button>
                <button
                  className={`role-option ${selectedUser.role === 'admin' ? 'selected' : ''}`}
                  onClick={() => handleChangeRole(selectedUser._id, 'admin')}
                >
                  <span>👨‍💼</span>
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
