import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, X, Building, Check, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const AMENITY_OPTIONS = [
  'Power Backup',
  'Lift / Elevator',
  '24/7 Security',
  'Covered Car Parking',
  'Gymnasium',
  'Swimming Pool',
  'Clubhouse',
  'Children Play Area',
  'WiFi Provision',
  'Air Conditioning',
  'Modular Kitchen',
  'Balcony / Terrace',
  'Food Included',
  'Daily Housekeeping'
];

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    monthlyRent: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '',
    bedrooms: '2',
    bathrooms: '2',
    furnishingStatus: 'Semi-Furnished',
    parkingAvailable: true
  });

  const [selectedAmenities, setSelectedAmenities] = useState(['24/7 Security', 'Lift / Elevator']);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities((prev) => [...prev, amenity]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
      showToast('You can upload a maximum of 6 property images', 'warning');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.monthlyRent || !formData.address || !formData.pinCode) {
      showToast('Please fill out all mandatory property details', 'warning');
      return;
    }

    if (Number(formData.monthlyRent) <= 0) {
      showToast('Monthly rent must be a positive number', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val);
      });

      // Append amenities array
      payload.append('amenities', JSON.stringify(selectedAmenities));

      // Append files
      selectedFiles.forEach((file) => {
        payload.append('images', file);
      });

      const res = await api.post('/properties', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        showToast('Property listing created and published successfully!', 'success');
        navigate('/owner/properties');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Publish New Property Listing
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Provide accurate rental specifications and photos to attract quality tenant inquiries.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Details Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
            1. Basic Information
          </h3>

          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              required
              placeholder="e.g. Spacious 2 BHK Gated Community Apartment in Madhapur"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              required
              placeholder="Describe the interior finish, floor level, nearby IT hubs, transport connectivity, society rules..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select
                name="propertyType"
                className="form-control"
                value={formData.propertyType}
                onChange={handleInputChange}
              >
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="PG/Hostel">PG / Hostel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent (₹ INR) *</label>
              <input
                type="number"
                name="monthlyRent"
                className="form-control"
                required
                min="1"
                placeholder="e.g. 25000"
                value={formData.monthlyRent}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Furnishing Status *</label>
              <select
                name="furnishingStatus"
                className="form-control"
                value={formData.furnishingStatus}
                onChange={handleInputChange}
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Bedrooms (BHK) *</label>
              <input
                type="number"
                name="bedrooms"
                className="form-control"
                required
                min="1"
                max="10"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                className="form-control"
                required
                min="1"
                max="10"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  name="parkingAvailable"
                  checked={formData.parkingAvailable}
                  onChange={handleInputChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                />
                <span>Dedicated Parking Available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Location Details Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
            2. Location & Address
          </h3>

          <div className="form-group">
            <label className="form-label">Full Street Address *</label>
            <input
              type="text"
              name="address"
              className="form-control"
              required
              placeholder="Door No, Street Name, Apartment Name / Locality"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleInputChange}
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
                <option value="Vijayawada">Vijayawada</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                required
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PIN Code *</label>
              <input
                type="text"
                name="pinCode"
                className="form-control"
                required
                placeholder="e.g. 500081"
                value={formData.pinCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Amenities Selection Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
            3. Amenities & Society Features
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {AMENITY_OPTIONS.map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <label
                  key={amenity}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: isChecked ? 'var(--color-primary-subtle)' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAmenityToggle(amenity)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{amenity}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Property Images Upload Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
            4. Property Photographs
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Upload up to 6 high-resolution photographs (JPEG, PNG, or WebP up to 5MB each).
          </p>

          <label
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              backgroundColor: 'var(--color-bg-alt)',
              textAlign: 'center'
            }}
          >
            <Upload size={32} color="var(--color-primary)" />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Click to browse files</span>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.82rem' }}>
                JPEG, PNG, WebP supported
              </span>
            </div>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: '100px',
                    height: '80px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <img src={url} alt={`Upload preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/owner/properties')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            <PlusCircle size={20} /> {submitting ? 'Publishing Listing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyPage;
