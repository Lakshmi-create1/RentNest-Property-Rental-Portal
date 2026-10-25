import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Calendar, Phone, Mail, XCircle, Search, Clock, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';

const MyInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries/my');
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
    fetchInquiries();
  }, []);

  const openCancelModal = (inquiryId) => {
    setSelectedInquiryId(inquiryId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedInquiryId) return;
    setActionLoading(true);

    try {
      const res = await api.patch(`/inquiries/${selectedInquiryId}/cancel`);
      if (res.data.success) {
        showToast('Inquiry cancelled successfully', 'info');
        setInquiries((prev) =>
          prev.map((inq) =>
            inq._id === selectedInquiryId ? { ...inq, status: 'cancelled' } : inq
          )
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
      setCancelModalOpen(false);
      setSelectedInquiryId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your rental inquiries..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          My Rental Inquiries
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Track the status of viewing requests and messages sent to property owners.
        </p>
      </div>

      {inquiries.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {inquiries.map((inquiry) => {
            const prop = inquiry.property;
            const owner = inquiry.owner;

            const formatRent = (val) =>
              new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(val || 0);

            return (
              <div key={inquiry._id} className="card" style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1rem',
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
                      {prop ? (
                        <Link to={`/properties/${prop._id}`} style={{ color: 'var(--color-dark)' }}>
                          {prop.title}
                        </Link>
                      ) : (
                        'Property (Listing unavailable)'
                      )}
                    </h3>
                    {prop && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {prop.city} • Rent: {formatRent(prop.monthlyRent)}/month
                      </p>
                    )}
                  </div>

                  {inquiry.status === 'pending' && (
                    <button
                      onClick={() => openCancelModal(inquiry._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    >
                      <XCircle size={15} /> Cancel Request
                    </button>
                  )}
                </div>

                {/* Message and Visit Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }} className="inquiry-grid">
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      Your Inquiry Message
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', lineHeight: 1.6, backgroundColor: 'var(--color-bg-alt)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                      "{inquiry.message}"
                    </p>
                    {inquiry.preferredVisitDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        <Calendar size={15} />
                        <span>Requested Visit: {new Date(inquiry.preferredVisitDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Owner Contact */}
                  <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Landlord Contact
                    </h4>
                    <p style={{ fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
                      {owner?.name || 'Property Landlord'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={13} color="var(--color-primary)" /> {owner?.phone || 'Private until accepted'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={13} color="var(--color-primary)" /> {owner?.email}
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
          <h3 className="empty-state-title">No Inquiries Found</h3>
          <p className="empty-state-text">
            You haven't submitted any inquiries yet. Browse verified listings and schedule visits.
          </p>
          <Link to="/properties" className="btn btn-primary btn-sm">
            <Search size={16} /> Browse Properties
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Rental Inquiry"
        message="Are you sure you want to cancel this inquiry? The landlord will be notified that your request is no longer active."
        confirmText="Yes, Cancel Inquiry"
        confirmBtnStyle="btn-danger"
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />

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

export default MyInquiriesPage;
