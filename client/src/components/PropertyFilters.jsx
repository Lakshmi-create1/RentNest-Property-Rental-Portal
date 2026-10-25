import React from 'react';
import { Filter, RotateCcw, IndianRupee } from 'lucide-react';

const PropertyFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--color-dark)' }}>
          <Filter size={18} color="var(--color-primary)" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
          title="Reset all filters"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div className="form-group">
        <label className="form-label">Keyword / Locality</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Madhapur, Sea View, Balcony"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      {/* City */}
      <div className="form-group">
        <label className="form-label">City</label>
        <select
          className="form-control"
          value={filters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
        >
          <option value="">All Cities</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Visakhapatnam">Visakhapatnam</option>
          <option value="Vijayawada">Vijayawada</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="form-group">
        <label className="form-label">Property Type</label>
        <select
          className="form-control"
          value={filters.propertyType || 'All'}
          onChange={(e) => handleChange('propertyType', e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Independent House">Independent House</option>
          <option value="Villa">Villa</option>
          <option value="PG/Hostel">PG / Hostel</option>
        </select>
      </div>

      {/* BHK Configuration */}
      <div className="form-group">
        <label className="form-label">Bedrooms (BHK)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
          {['All', '1', '2', '3'].map((bhk) => (
            <button
              key={bhk}
              type="button"
              onClick={() => handleChange('bedrooms', bhk)}
              style={{
                padding: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor:
                  (filters.bedrooms || 'All') === bhk
                    ? 'var(--color-primary)'
                    : 'var(--color-bg-alt)',
                color: (filters.bedrooms || 'All') === bhk ? '#ffffff' : 'var(--color-text-main)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {bhk === 'All' ? 'All' : `${bhk} BHK`}
            </button>
          ))}
        </div>
      </div>

      {/* Rent Range */}
      <div className="form-group">
        <label className="form-label">Monthly Rent Range (₹)</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            className="form-control"
            placeholder="Min Rent"
            value={filters.minRent || ''}
            onChange={(e) => handleChange('minRent', e.target.value)}
          />
          <span style={{ color: 'var(--color-text-light)' }}>-</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max Rent"
            value={filters.maxRent || ''}
            onChange={(e) => handleChange('maxRent', e.target.value)}
          />
        </div>
      </div>

      {/* Furnishing Status */}
      <div className="form-group">
        <label className="form-label">Furnishing Status</label>
        <select
          className="form-control"
          value={filters.furnishingStatus || 'All'}
          onChange={(e) => handleChange('furnishingStatus', e.target.value)}
        >
          <option value="All">All Furnishing</option>
          <option value="Furnished">Furnished</option>
          <option value="Semi-Furnished">Semi-Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Parking Available Checkbox */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <input
            type="checkbox"
            checked={filters.parkingAvailable === 'true' || filters.parkingAvailable === true}
            onChange={(e) =>
              handleChange('parkingAvailable', e.target.checked ? 'true' : '')
            }
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
          />
          <span>Dedicated Parking Available</span>
        </label>
      </div>

      {/* Sort By */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Sort By</label>
        <select
          className="form-control"
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="newest">Newest Listings</option>
          <option value="rent_asc">Rent: Low to High</option>
          <option value="rent_desc">Rent: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default PropertyFilters;
