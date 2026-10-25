import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManagePropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [listingStatus, setListingStatus] = useState('All');
  const [propertyType, setPropertyType] = useState('All');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (listingStatus !== 'All') params.listingStatus = listingStatus;
      if (propertyType !== 'All') params.propertyType = propertyType;

      const res = await api.get('/admin/properties', { params });
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
    fetchProperties();
  }, [listingStatus, propertyType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleUpdateApproval = async (id, newStatus) => {
    try {
      const res = await api.patch(`/admin/properties/${id}/approval`, {
        listingStatus: newStatus
      });

      if (res.data.success) {
        showToast(`Listing status updated to ${newStatus}!`, 'success');
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? { ...p, listingStatus: newStatus } : p))
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
      const res = await api.delete(`/admin/properties/${selectedPropertyId}`);
      if (res.data.success) {
        showToast('Property listing permanently removed by administrator', 'info');
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

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Manage Property Listings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Review submitted listings, moderate pricing & descriptions, or remove inappropriate posts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by title, city, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              color="var(--color-text-light)"
              style={{ position: 'absolute', left: '12px', top: '12px' }}
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={listingStatus}
              onChange={(e) => setListingStatus(e.target.value)}
            >
              <option value="All">All Listing Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="All">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Independent House">Independent House</option>
              <option value="Villa">Villa</option>
              <option value="PG/Hostel">PG / Hostel</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ height: '42px', padding: '0 1.25rem' }}>
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading property listings..." />
      ) : properties.length > 0 ? (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner Details</th>
                <th>Monthly Rent</th>
                <th>Status</th>
                <th>Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td style={{ maxWidth: '280px' }}>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-dark)', display: 'block' }}>
                      {property.title}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {property.city} • {property.propertyType} ({property.bedrooms} BHK)
                    </span>
                  </td>

                  <td>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark)', display: 'block' }}>
                      {property.owner?.name || 'Owner'}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {property.owner?.email}
                    </span>
                  </td>

                  <td>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatRent(property.monthlyRent)}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>/mo</span>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link
                        to={`/properties/${property._id}`}
                        className="btn btn-secondary btn-sm"
                        title="View Public Details"
                        style={{ padding: '0.4rem' }}
                      >
                        <ExternalLink size={15} />
                      </Link>

                      {property.listingStatus !== 'approved' && (
                        <button
                          onClick={() => handleUpdateApproval(property._id, 'approved')}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', backgroundColor: 'var(--color-success)' }}
                          title="Approve Listing"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}

                      {property.listingStatus !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateApproval(property._id, 'rejected')}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                          title="Reject Listing"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      )}

                      <button
                        onClick={() => openDeleteModal(property._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                        title="Delete Listing"
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
          <h3 className="empty-state-title">No Properties Found</h3>
          <p className="empty-state-text">
            No properties match your current search and filter settings.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Administrative Deletion"
        message="Are you sure you want to delete this listing from the portal? This action will mark it as deleted."
        confirmText="Confirm Delete"
        confirmBtnStyle="btn-danger"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ManagePropertiesPage;
