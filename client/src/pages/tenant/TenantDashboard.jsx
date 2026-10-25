import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle,
  Heart,
  Search,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const [inqRes, favRes] = await Promise.all([
          api.get('/inquiries/my'),
          api.get('/favorites')
        ]);

        if (inqRes.data.success) {
          setInquiries(inqRes.data.inquiries);
        }
        if (favRes.data.success) {
          setFavoritesCount(favRes.data.count || favRes.data.favorites.length);
        }
      } catch (err) {
        console.error('Failed to load tenant dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;
  const acceptedInquiries = inquiries.filter((i) => i.status === 'accepted').length;

  if (loading) {
    return <LoadingSpinner text="Loading tenant dashboard..." />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Here is a summary of your rental inquiries and saved homes.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Inbox size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Total Inquiries
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {inquiries.length}
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Pending Inquiries
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {pendingInquiries}
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Accepted Inquiries
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {acceptedInquiries}
            </h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Heart size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Saved Favorites
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {favoritesCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            Looking for more options?
          </h3>
          <p style={{ color: '#e0f2fe', fontSize: '0.92rem' }}>
            Filter hundreds of verified listings by budget, BHK configuration, or city.
          </p>
        </div>
        <Link
          to="/properties"
          className="btn btn-secondary"
          style={{ backgroundColor: '#ffffff', color: '#0284c7', border: 'none' }}
        >
          <Search size={16} /> Browse Properties
        </Link>
      </div>

      {/* Recent Inquiries Table/List */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            Recent Rental Inquiries
          </h3>
          <Link
            to="/tenant/inquiries"
            style={{ color: 'var(--color-primary)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {inquiries.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Owner</th>
                  <th>Visit Date</th>
                  <th>Status</th>
                  <th>Date Sent</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.slice(0, 5).map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.property?.title || 'Property'}</strong>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {item.property?.city}
                      </span>
                    </td>
                    <td>{item.owner?.name || 'Owner'}</td>
                    <td>
                      {item.preferredVisitDate ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                          <Calendar size={14} color="var(--color-primary)" />
                          {new Date(item.preferredVisitDate).toLocaleDateString()}
                        </span>
                      ) : (
                        'Not specified'
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === 'accepted'
                            ? 'badge-success'
                            : item.status === 'rejected'
                            ? 'badge-danger'
                            : item.status === 'cancelled'
                            ? 'badge-info'
                            : 'badge-warning'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2.5rem' }}>
            <Inbox className="empty-state-icon" style={{ width: '40px', height: '40px' }} />
            <h4 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>No Inquiries Sent Yet</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              When you submit a viewing request or rental question, it will appear here.
            </p>
            <Link to="/properties" className="btn btn-primary btn-sm">
              Explore Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
