import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  Clock,
  PlusCircle,
  Inbox,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const [propsRes, inqsRes] = await Promise.all([
          api.get('/properties/my'),
          api.get('/inquiries/received')
        ]);

        if (propsRes.data.success) {
          setProperties(propsRes.data.properties);
        }
        if (inqsRes.data.success) {
          setInquiries(inqsRes.data.inquiries);
        }
      } catch (err) {
        console.error('Failed to load owner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  const availableCount = properties.filter((p) => p.availabilityStatus === 'available').length;
  const rentedCount = properties.filter((p) => p.availabilityStatus === 'rented').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;
  const acceptedInquiriesCount = inquiries.filter((i) => i.status === 'accepted').length;

  if (loading) {
    return <LoadingSpinner text="Loading owner workspace..." />;
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
            Owner Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Welcome, {user?.name}! Manage your rental portfolio and tenant requests.
          </p>
        </div>

        <Link to="/owner/add-property" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Listing
        </Link>
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
            <Building size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Total Listings
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {properties.length}
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
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Available
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {availableCount}
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
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Rented
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {rentedCount}
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
            <Inbox size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Pending Inquiries
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)' }}>
              {pendingInquiriesCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Properties Section */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            My Active Properties
          </h3>
          <Link
            to="/owner/properties"
            style={{ color: 'var(--color-primary)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title & Location</th>
                  <th>Type & BHK</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 5).map((property) => {
                  const formatRent = (val) =>
                    new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(val);

                  return (
                    <tr key={property._id}>
                      <td>
                        <strong>{property.title}</strong>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <MapPin size={12} /> {property.city}
                        </span>
                      </td>
                      <td>
                        {property.propertyType} • {property.bedrooms} BHK
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-primary)' }}>{formatRent(property.monthlyRent)}</strong>/mo
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            property.availabilityStatus === 'available' ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {property.availabilityStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/owner/edit-property/${property._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                            Edit
                          </Link>
                          <Link to={`/properties/${property._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Building className="empty-state-icon" />
            <h4 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>No Listings Yet</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Publish your first rental property to start receiving verified tenant inquiries.
            </p>
            <Link to="/owner/add-property" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Add First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
