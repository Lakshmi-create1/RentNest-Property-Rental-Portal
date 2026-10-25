import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  MapPin
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';

const MyPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const fetchMyProperties = async () => {
    try {
      const res = await api.get('/properties/my');
      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleToggleAvailability = async (property) => {
    const nextStatus = property.availabilityStatus === 'available' ? 'rented' : 'available';

    try {
      const res = await api.patch(`/properties/${property._id}/availability`, {
        availabilityStatus: nextStatus
      });

      if (res.data.success) {
        showToast(`Listing marked as ${nextStatus}!`, 'success');
        setProperties((prev) =>
          prev.map((p) =>
            p._id === property._id ? { ...p, availabilityStatus: nextStatus } : p
          )
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openDeleteModal = (id) => {
    setSelectedPropertyId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPropertyId) return;
    setActionLoading(true);

    try {
      const res = await api.delete(`/properties/${selectedPropertyId}`);
      if (res.data.success) {
        showToast('Property deleted successfully', 'info');
        setProperties((prev) => prev.filter((p) => p._id !== selectedPropertyId));
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
      setDeleteModalOpen(false);
      setSelectedPropertyId(null);
    }
  };

  const formatRent = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

  if (loading) {
    return <LoadingSpinner text="Loading your listings..." />;
  }

  return (
    <div>
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
            My Properties
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            You have {properties.length} listed properties.
          </p>
        </div>

        <Link to="/owner/add-property" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Listing
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type & Rent</th>
                <th>Listing Status</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '54px',
                          height: '44px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#e2e8f0',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={
                              property.images[0].startsWith('http')
                                ? property.images[0]
                                : `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${property.images[0]}`
                            }
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : null}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <strong
                          style={{
                            display: 'block',
                            fontSize: '0.92rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {property.title}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={12} /> {property.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {property.propertyType} • {property.bedrooms} BHK
                    </span>
                    <strong style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                      {formatRent(property.monthlyRent)}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>/mo</span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        property.listingStatus === 'approved'
                          ? 'badge-success'
                          : property.listingStatus === 'rejected'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {property.listingStatus}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleToggleAvailability(property)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor:
                          property.availabilityStatus === 'available'
                            ? 'var(--color-success-bg)'
                            : 'var(--color-danger-bg)',
                        color:
                          property.availabilityStatus === 'available'
                            ? 'var(--color-success)'
                            : 'var(--color-danger)'
                      }}
                      title="Click to toggle availability"
                    >
                      {property.availabilityStatus === 'available' ? 'Available' : 'Rented'}
                    </button>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link
                        to={`/properties/${property._id}`}
                        className="btn btn-secondary btn-sm"
                        title="View Public Listing"
                        style={{ padding: '0.4rem' }}
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <Link
                        to={`/owner/edit-property/${property._id}`}
                        className="btn btn-secondary btn-sm"
                        title="Edit Details"
                        style={{ padding: '0.4rem' }}
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(property._id)}
                        className="btn btn-secondary btn-sm"
                        title="Delete Property"
                        style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Building className="empty-state-icon" />
          <h3 className="empty-state-title">No Properties Listed</h3>
          <p className="empty-state-text">
            You haven't added any rental listings yet. Start adding properties to reach prospective tenants.
          </p>
          <Link to="/owner/add-property" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Add First Property
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Property Listing"
        message="Are you sure you want to remove this property listing? It will no longer be visible to prospective tenants."
        confirmText="Yes, Delete Listing"
        confirmBtnStyle="btn-danger"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default MyPropertiesPage;
