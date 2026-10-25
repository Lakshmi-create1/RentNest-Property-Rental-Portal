import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (role && role !== 'All') params.role = role;

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    if (user._id === currentAdmin._id) {
      showToast('You cannot deactivate your own administrative account', 'warning');
      return;
    }

    setUpdatingId(user._id);
    const newStatus = !user.isActive;

    try {
      const res = await api.patch(`/admin/users/${user._id}/status`, {
        isActive: newStatus
      });

      if (res.data.success) {
        showToast(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: newStatus } : u))
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Manage User Accounts
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Inspect registered tenants, property owners, and manage platform access privileges.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              color="var(--color-text-light)"
              style={{ position: 'absolute', left: '12px', top: '12px' }}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="tenant">Tenants Only</option>
              <option value="owner">Owners Only</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ height: '42px', padding: '0 1.25rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* User Table */}
      {loading ? (
        <LoadingSpinner text="Loading registered accounts..." />
      ) : users.length > 0 ? (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isCurrent = u._id === currentAdmin?._id;
                const isUpdating = updatingId === u._id;

                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg-alt)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                          }}
                        >
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--color-dark)', display: 'block' }}>
                            {u.name} {isCurrent && '(You)'}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'badge-danger'
                            : u.role === 'owner'
                            ? 'badge-primary'
                            : 'badge-info'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                      {u.phone}
                    </td>

                    <td>
                      <span
                        className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}
                      >
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      {!isCurrent ? (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isUpdating}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`}
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
                        >
                          {isUpdating
                            ? 'Processing...'
                            : u.isActive
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Users className="empty-state-icon" />
          <h3 className="empty-state-title">No Users Found</h3>
          <p className="empty-state-text">
            No accounts match your current keyword or role filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
