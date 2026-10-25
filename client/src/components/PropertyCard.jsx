import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Armchair, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

const PropertyCard = ({ property, isFavorite = false, onFavoriteToggle }) => {
  const { isTenant } = useAuth();
  const { showToast } = useToast();

  const fallbackImage =
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  const getImageUrl = () => {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      if (img.startsWith('http')) return img;
      return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${img}`;
    }
    return fallbackImage;
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isTenant) {
      showToast('Please log in as a Tenant to save properties to favorites', 'warning');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${property._id}`);
        showToast('Removed from favorites', 'info');
      } else {
        await api.post(`/favorites/${property._id}`);
        showToast('Saved to favorites!', 'success');
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(property._id, !isFavorite);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Property Thumbnail with Badges */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={getImageUrl()}
          alt={property.title}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '6px'
          }}
        >
          <span className="badge badge-primary">{property.propertyType}</span>
          {property.availabilityStatus === 'rented' ? (
            <span className="badge badge-danger">Rented</span>
          ) : (
            <span className="badge badge-success">Available</span>
          )}
        </div>

        {/* Favorite Icon Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Toggle Favorite"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            color: isFavorite ? '#ef4444' : '#64748b',
            cursor: 'pointer',
            transition: 'transform var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Property Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Rent & Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {formatCurrency(property.monthlyRent)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            / month
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--color-dark)',
            marginBottom: '0.4rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {property.title}
        </h3>

        {/* Address / City */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}
        >
          <MapPin size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.city}, {property.state}
          </span>
        </div>

        {/* Key Features (Bedrooms, Bathrooms, Furnishing) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--color-border)',
            marginTop: 'auto',
            fontSize: '0.82rem',
            color: 'var(--color-text-main)',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Bedrooms">
            <Bed size={15} color="var(--color-text-muted)" />
            <span>{property.bedrooms} BHK</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Bathrooms">
            <Bath size={15} color="var(--color-text-muted)" />
            <span>{property.bathrooms} Bath</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} title="Furnishing">
            <Armchair size={15} color="var(--color-text-muted)" />
            <span>{property.furnishingStatus}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ marginTop: '1rem' }}>
          <Link
            to={`/properties/${property._id}`}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
