import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Inbox,
  PlusCircle,
  Building,
  Users,
  AlertOctagon,
  MessageSquare,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardSidebar = () => {
  const { user, logout, isTenant, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: isActive ? '#ffffff' : 'var(--color-text-main)',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    transition: 'all var(--transition-fast)',
    marginBottom: '0.35rem'
  });

  return (
    <aside className="dashboard-sidebar">
      {/* User Info Header */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            flexShrink: 0
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--color-dark)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {user?.name}
          </p>
          <span
            className={`badge ${isAdmin ? 'badge-danger' : isOwner ? 'badge-primary' : 'badge-info'}`}
            style={{ fontSize: '0.65rem', marginTop: '2px' }}
          >
            {user?.role}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Tenant Links */}
        {isTenant && (
          <>
            <NavLink to="/tenant/dashboard" style={navItemStyle} end>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/tenant/favorites" style={navItemStyle}>
              <Heart size={18} />
              <span>My Favorites</span>
            </NavLink>
            <NavLink to="/tenant/inquiries" style={navItemStyle}>
              <Inbox size={18} />
              <span>Rental Inquiries</span>
            </NavLink>
          </>
        )}

        {/* Owner Links */}
        {isOwner && (
          <>
            <NavLink to="/owner/dashboard" style={navItemStyle} end>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/owner/add-property" style={navItemStyle}>
              <PlusCircle size={18} />
              <span>Add Property</span>
            </NavLink>
            <NavLink to="/owner/properties" style={navItemStyle}>
              <Building size={18} />
              <span>My Properties</span>
            </NavLink>
            <NavLink to="/owner/inquiries" style={navItemStyle}>
              <Inbox size={18} />
              <span>Manage Inquiries</span>
            </NavLink>
          </>
        )}

        {/* Admin Links */}
        {isAdmin && (
          <>
            <NavLink to="/admin/dashboard" style={navItemStyle} end>
              <LayoutDashboard size={18} />
              <span>Admin Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" style={navItemStyle}>
              <Users size={18} />
              <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/properties" style={navItemStyle}>
              <Building size={18} />
              <span>Manage Properties</span>
            </NavLink>
            <NavLink to="/admin/reports" style={navItemStyle}>
              <AlertOctagon size={18} />
              <span>Reported Content</span>
            </NavLink>
            <NavLink to="/admin/messages" style={navItemStyle}>
              <MessageSquare size={18} />
              <span>Contact Inquiries</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Logout Action */}
      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontWeight: 600,
            fontSize: '0.9rem',
            backgroundColor: 'var(--color-danger-bg)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
