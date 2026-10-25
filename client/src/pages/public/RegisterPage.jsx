import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Building, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tenant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match. Please recheck.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role
    });
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/tenant/dashboard');
      }
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
              Create an Account
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Join RentNest to find rental homes or list your properties
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Account Role Selector */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">I want to register as:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${
                      formData.role === 'tenant' ? 'var(--color-primary)' : 'var(--color-border)'
                    }`,
                    backgroundColor:
                      formData.role === 'tenant' ? 'var(--color-primary-subtle)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="tenant"
                    checked={formData.role === 'tenant'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-dark)' }}>Tenant</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Looking for a rental</span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${
                      formData.role === 'owner' ? 'var(--color-primary)' : 'var(--color-border)'
                    }`,
                    backgroundColor:
                      formData.role === 'owner' ? 'var(--color-primary-subtle)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={formData.role === 'owner'}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--color-dark)' }}>Owner</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Listing properties</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={formData.name}
                  onChange={handleChange}
                />
                <User size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Phone size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password (min 6 characters) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--color-text-light)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Lock size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem' }}
              disabled={loading}
            >
              <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
