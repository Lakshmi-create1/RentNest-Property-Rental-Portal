import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Building,
  User
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const fetchReceivedInquiries = async () => {
    try {
      const res = await api.get('/inquiries/received');
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedInquiries();
  }, []);

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    setUpdatingId(inquiryId);
    try {
      const res = await api.patch(`/inquiries/${inquiryId}/status`, {
        status: newStatus
      });

      if (res.data.success) {
        showToast(`Inquiry ${newStatus} successfully!`, 'success');
        setInquiries((prev) =>
          prev.map((inq) =>
            inq._id === inquiryId ? { ...inq, status: newStatus } : inq
          )
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading received tenant inquiries..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Manage Rental Inquiries
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Review tenant requests, scheduled viewing dates, and accept or decline applications.
        </p>
      </div>

      {inquiries.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {inquiries.map((inquiry) => {
            const prop = inquiry.property;
            const tenant = inquiry.tenant;
            const isUpdating = updatingId === inquiry._id;

            return (
              <div key={inquiry._id} className="card" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <div>
                    <span
                      className={`badge ${
                        inquiry.status === 'accepted'
                          ? 'badge-success'
                          : inquiry.status === 'rejected'
                          ? 'badge-danger'
                          : inquiry.status === 'cancelled'
                          ? 'badge-info'
                          : 'badge-warning'
                      }`}
                      style={{ marginBottom: '0.4rem' }}
                    >
                      {inquiry.status.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                      Inquiry for:{' '}
                      {prop ? (
                        <Link to={`/properties/${prop._id}`} style={{ color: 'var(--color-primary)' }}>
                          {prop.title}
                        </Link>
                      ) : (
                        'Property Listing'
                      )}
                    </h3>
                  </div>

                  {/* Accept / Reject actions */}
                  {inquiry.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button
                        onClick={() => handleUpdateStatus(inquiry._id, 'accepted')}
                        className="btn btn-primary btn-sm"
                        disabled={isUpdating}
                        style={{ backgroundColor: 'var(--color-success)' }}
                      >
                        <CheckCircle size={16} /> Accept Inquiry
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(inquiry._id, 'rejected')}
                        className="btn btn-danger btn-sm"
                        disabled={isUpdating}
                      >
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Application marked as <strong>{inquiry.status}</strong>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }} className="inquiry-grid">
                  {/* Message & Visit Date */}
                  <div>
                    <h4 style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      Tenant's Message
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.6, backgroundColor: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      "{inquiry.message}"
                    </p>

                    {inquiry.preferredVisitDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        <Calendar size={16} />
                        <span>Preferred Visit Date: {new Date(inquiry.preferredVisitDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Tenant Details */}
                  <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Applicant Details
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-primary)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}
                      >
                        {tenant?.name?.charAt(0).toUpperCase() || 'T'}
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--color-dark)', fontSize: '0.95rem' }}>
                        {tenant?.name || 'Prospective Tenant'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={14} color="var(--color-primary)" /> {tenant?.phone || 'Not provided'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} color="var(--color-primary)" /> {tenant?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Inbox className="empty-state-icon" />
          <h3 className="empty-state-title">No Rental Inquiries Received</h3>
          <p className="empty-state-text">
            When prospective tenants send questions or request property tours, they will appear here.
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .inquiry-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageInquiriesPage;
