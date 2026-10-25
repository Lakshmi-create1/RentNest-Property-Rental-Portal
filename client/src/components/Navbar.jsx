import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Building2, User, LogOut, Menu, X, PlusCircle, Heart, Inbox, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isTenant, isOwner, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOwner) return '/owner/dashboard';
    return '/tenant/dashboard';
  };

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.35rem', color: 'var(--color-primary)' }}>
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building2 size={20} />
          </div>
          <span style={{ color: 'var(--color-dark)', letterSpacing: '-0.02em' }}>
            Rent<span style={{ color: 'var(--color-primary)' }}>Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
            fontWeight: 600,
            fontSize: '0.92rem'
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/properties"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)'
            })}
          >
            Browse Properties
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)'
            })}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)'
            })}
          >
            Contact
          </NavLink>
        </div>

        {/* User Account Controls */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {isOwner && (
                <Link to="/owner/add-property" className="btn btn-outline btn-sm">
                  <PlusCircle size={15} />
                  List Property
                </Link>
              )}

              {isTenant && (
                <Link to="/tenant/favorites" title="My Favorites" style={{ color: 'var(--color-text-muted)', display: 'flex', padding: '6px' }}>
                  <Heart size={20} />
                </Link>
              )}

              <Link
                to={getDashboardLink()}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {isAdmin ? <ShieldCheck size={16} color="var(--color-primary)" /> : <User size={16} />}
                <span>{user.name.split(' ')[0]}</span>
                <span className={`badge ${isAdmin ? 'badge-danger' : isOwner ? 'badge-primary' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                  {user.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
                style={{ padding: '0.5rem', color: 'var(--color-danger)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            color: 'var(--color-dark)'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Home</Link>
          <Link to="/properties" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Browse Properties</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Contact</Link>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-dark)' }}>{user.name}</span>
                <span className="badge badge-primary">{user.role}</span>
              </div>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
              >
                <User size={16} /> Go to Dashboard
              </Link>
              {isOwner && (
                <Link
                  to="/owner/add-property"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <PlusCircle size={16} /> Add New Property
                </Link>
              )}
              {isTenant && (
                <Link
                  to="/tenant/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Heart size={16} /> My Favorites
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ justifyContent: 'flex-start', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
