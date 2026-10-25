import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  Inbox,
  AlertOctagon,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching platform analytics..." />;
  }

  const stats = data?.stats;
  const recent = data?.recent;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Platform Administrator Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Real-time platform activity metrics, user governance, and listing moderation.
        </p>
      </div>

      {/* Main Metrics 4-Col Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {/* Total Users */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Registered Users
            </span>
            <Users size={20} color="var(--color-primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.3rem' }}>
            {stats?.users?.total || 0}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {stats?.users?.tenants || 0} Tenants • {stats?.users?.owners || 0} Owners
          </span>
        </div>

        {/* Total Properties */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Listings
            </span>
            <Building size={20} color="var(--color-secondary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.3rem' }}>
            {stats?.properties?.total || 0}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {stats?.properties?.approved || 0} Approved • {stats?.properties?.rented || 0} Rented
          </span>
        </div>

        {/* Rental Inquiries */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Rental Inquiries
            </span>
            <Inbox size={20} color="#d97706" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.3rem' }}>
            {stats?.inquiries?.total || 0}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {stats?.inquiries?.pending || 0} Pending • {stats?.inquiries?.accepted || 0} Accepted
          </span>
        </div>

        {/* Reports & Complaints */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Reports & Flags
            </span>
            <AlertOctagon size={20} color="var(--color-danger)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.3rem' }}>
            {stats?.reports?.total || 0}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {stats?.reports?.pending || 0} Pending Moderation
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Properties & Recent Inquiries */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Recent Listings */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
              Recent Property Submissions
            </h3>
            <Link to="/admin/properties" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recent?.properties?.map((prop) => (
              <div
                key={prop._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-dark)', display: 'block' }}>
                    {prop.title}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {prop.city} • Owner: {prop.owner?.name || 'Owner'}
                  </span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  {prop.listingStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
              Latest Registered Users
            </h3>
            <Link to="/admin/users" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Manage Users
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recent?.users?.map((u) => (
              <div
                key={u._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-bg-alt)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-dark)', display: 'block' }}>
                    {u.name}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {u.email}
                  </span>
                </div>
                <span
                  className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'owner' ? 'badge-primary' : 'badge-info'}`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
