import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Armchair,
  Car,
  CheckCircle,
  Calendar,
  Send,
  Heart,
  Flag,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  X
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PropertyGallery from '../../components/PropertyGallery';
import LoadingSpinner from '../../components/LoadingSpinner';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isTenant } = useAuth();
  const { showToast } = useToast();

  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inquiry form modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    message: '',
    preferredVisitDate: ''
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({
    reason: 'Misleading photos or pricing',
    description: ''
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.property);
          setIsFavorite(res.data.isFavorite || false);
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, showToast]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please log in as a Tenant to save properties to favorites', 'warning');
      navigate('/login');
      return;
    }

    if (!isTenant) {
      showToast('Only tenant accounts can save properties to favorites', 'warning');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${property._id}`);
        setIsFavorite(false);
        showToast('Removed from favorites', 'info');
      } else {
        await api.post(`/favorites/${property._id}`);
        setIsFavorite(true);
        showToast('Saved to your favorites!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in as a Tenant to submit a rental inquiry', 'warning');
      navigate('/login');
      return;
    }

    if (!isTenant) {
      showToast('Only tenant accounts can submit rental inquiries', 'warning');
      return;
    }

    if (!inquiryData.message.trim()) {
      showToast('Please enter an inquiry message', 'warning');
      return;
    }

    setInquirySubmitting(true);
    try {
      const res = await api.post('/inquiries', {
        propertyId: property._id,
        message: inquiryData.message,
        preferredVisitDate: inquiryData.preferredVisitDate || null
      });

      if (res.data.success) {
        showToast('Rental inquiry submitted successfully to the owner!', 'success');
        setInquiryModalOpen(false);
        setInquiryData({ message: '', preferredVisitDate: '' });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to report this listing', 'warning');
      navigate('/login');
      return;
    }

    setReportSubmitting(true);
    try {
      const res = await api.post('/reports', {
        propertyId: property._id,
        reason: reportData.reason,
        description: reportData.description
      });

      if (res.data.success) {
        showToast('Report submitted. Our moderation team will investigate.', 'info');
        setReportModalOpen(false);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setReportSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Fetching property specifications..." />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="section container" style={{ textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          This listing may have been unlisted or removed.
        </p>
        <Link to="/properties" className="btn btn-primary">
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className="container">
        {/* Breadcrumb Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/properties"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Browse
          </Link>
        </div>

        {/* Top Header: Title & Rent */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{property.propertyType}</span>
              <span
                className={`badge ${
                  property.availabilityStatus === 'available' ? 'badge-success' : 'badge-danger'
                }`}
              >
                {property.availabilityStatus === 'available' ? 'Available Now' : 'Currently Rented'}
              </span>
              <span className="badge badge-info">{property.furnishingStatus}</span>
            </div>

            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--color-dark)',
                marginBottom: '0.4rem',
                lineHeight: 1.25
              }}
            >
              {property.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)' }}>
              <MapPin size={16} color="var(--color-primary)" />
              <span>
                {property.address}, {property.city}, {property.state} - {property.pinCode}
              </span>
            </div>
          </div>

          {/* Pricing & Favorite Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {formatCurrency(property.monthlyRent)}
              </span>
              <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', display: 'block' }}>
                per month
              </span>
            </div>

            <button
              onClick={handleFavoriteToggle}
              className="btn btn-secondary"
              style={{
                width: '48px',
                height: '48px',
                padding: 0,
                borderRadius: '50%',
                color: isFavorite ? '#ef4444' : 'var(--color-text-muted)'
              }}
              aria-label="Favorite property"
            >
              <Heart size={22} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Gallery + Content vs Side Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }} className="details-layout">
          {/* Main Column */}
          <div>
            {/* Image Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Quick Specs Overview Grid */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                margin: '1.75rem 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1.25rem',
                textAlign: 'center'
              }}
            >
              <div>
                <Bed size={22} color="var(--color-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Bedrooms</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-dark)' }}>{property.bedrooms} BHK</strong>
              </div>

              <div>
                <Bath size={22} color="var(--color-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Bathrooms</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-dark)' }}>{property.bathrooms} Baths</strong>
              </div>

              <div>
                <Armchair size={22} color="var(--color-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Furnishing</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-dark)' }}>{property.furnishingStatus}</strong>
              </div>

              <div>
                <Car size={22} color="var(--color-primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>Parking</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-dark)' }}>
                  {property.parkingAvailable ? 'Available' : 'None'}
                </strong>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-dark)' }}>
                About This Property
              </h3>
              <p style={{ color: 'var(--color-text-main)', fontSize: '0.98rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-dark)' }}>
                  Amenities & Facilities
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.92rem',
                        color: 'var(--color-dark)',
                        fontWeight: 500
                      }}
                    >
                      <CheckCircle size={16} color="var(--color-success)" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Owner Card & Rental Inquiry CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Inquiry Call to Action Box */}
            <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
                Interested in this home?
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Send a direct viewing request or rental inquiry to the owner.
              </p>

              {property.availabilityStatus === 'available' ? (
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <Send size={16} /> Send Rental Inquiry
                </button>
              ) : (
                <div
                  style={{
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  This property is currently rented
                </div>
              )}
            </div>

            {/* Owner Details Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}
                >
                  {property.owner?.name?.charAt(0).toUpperCase() || 'O'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                    {property.owner?.name || 'Verified Owner'}
                  </h4>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                    <ShieldCheck size={12} /> Verified Property Owner
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                  <Phone size={15} color="var(--color-primary)" />
                  <span>{property.owner?.phone || 'Login to view contact'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                  <Mail size={15} color="var(--color-primary)" />
                  <span>{property.owner?.email || 'Login to view contact'}</span>
                </div>
              </div>
            </div>

            {/* Report Listing Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setReportModalOpen(true)}
                style={{
                  color: 'var(--color-text-light)',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <Flag size={14} /> Report inappropriate listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="modal-overlay" onClick={() => setInquiryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                Rental Inquiry & Viewing Request
              </h3>
              <button onClick={() => setInquiryModalOpen(false)} style={{ color: 'var(--color-text-light)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', backgroundColor: 'var(--color-bg-alt)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-dark)' }}>{property.title}</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Rent: {formatCurrency(property.monthlyRent)}/mo • Owner: {property.owner?.name}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Visit Date (Optional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={inquiryData.preferredVisitDate}
                  onChange={(e) => setInquiryData({ ...inquiryData, preferredVisitDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Message *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Introduce yourself, your profession, preferred move-in date, and questions about the property..."
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setInquiryModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={inquirySubmitting}
                >
                  {inquirySubmitting ? 'Submitting...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                Report Listing
              </h3>
              <button onClick={() => setReportModalOpen(false)} style={{ color: 'var(--color-text-light)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Reason for reporting *</label>
                <select
                  className="form-control"
                  value={reportData.reason}
                  onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                >
                  <option value="Misleading photos or pricing">Misleading photos or pricing</option>
                  <option value="Property already rented / unavailable">Property already rented / unavailable</option>
                  <option value="Fraudulent or suspicious owner">Fraudulent or suspicious owner</option>
                  <option value="Inappropriate or offensive content">Inappropriate or offensive content</option>
                  <option value="Duplicate listing">Duplicate listing</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Details</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe the issue you encountered..."
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setReportModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger btn-sm"
                  disabled={reportSubmitting}
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailsPage;
