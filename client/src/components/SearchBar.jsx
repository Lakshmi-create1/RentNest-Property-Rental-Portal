import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';

const SearchBar = ({ initialValues = {}, onSearch }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialValues.city || '');
  const [propertyType, setPropertyType] = useState(initialValues.propertyType || 'All');
  const [maxRent, setMaxRent] = useState(initialValues.maxRent || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.append('city', city.trim());
    if (propertyType && propertyType !== 'All') params.append('propertyType', propertyType);
    if (maxRent) params.append('maxRent', maxRent);

    if (onSearch) {
      onSearch({ city, propertyType, maxRent });
    } else {
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: '1.25rem',
        border: '1px solid var(--color-border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 120px',
        gap: '1rem',
        alignItems: 'end'
      }}
      className="search-bar-form"
    >
      {/* City or Location */}
      <div>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={15} color="var(--color-primary)" /> Location / City
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Hyderabad, Bengaluru, Vizag"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Property Type */}
      <div>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Home size={15} color="var(--color-primary)" /> Property Type
        </label>
        <select
          className="form-control"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Independent House">Independent House</option>
          <option value="Villa">Villa</option>
          <option value="PG/Hostel">PG / Hostel</option>
        </select>
      </div>

      {/* Max Budget (INR) */}
      <div>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <IndianRupee size={15} color="var(--color-primary)" /> Max Budget (₹/mo)
        </label>
        <select
          className="form-control"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
        >
          <option value="">Any Budget</option>
          <option value="10000">Up to ₹10,000</option>
          <option value="20000">Up to ₹20,000</option>
          <option value="35000">Up to ₹35,000</option>
          <option value="50000">Up to ₹50,000</option>
          <option value="100000">Up to ₹1,00,000</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary"
        style={{ height: '44px', width: '100%' }}
      >
        <Search size={18} /> Search
      </button>

      <style>{`
        @media (max-width: 768px) {
          .search-bar-form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  );
};

export default SearchBar;
