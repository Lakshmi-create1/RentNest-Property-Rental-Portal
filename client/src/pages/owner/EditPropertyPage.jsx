import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Upload, X, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

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

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          const p = res.data.property;
          setFormData({
            title: p.title,
            description: p.description,
            propertyType: p.propertyType,
            monthlyRent: p.monthlyRent,
            address: p.address,
            city: p.city,
            state: p.state,
            pinCode: p.pinCode,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            furnishingStatus: p.furnishingStatus,
            parkingAvailable: p.parkingAvailable
          });
          setSelectedAmenities(p.amenities || []);
          setExistingImages(p.images || []);
        }
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/owner/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate, showToast]);

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

  const handleRemoveExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setRemovedImages((prev) => [...prev, img]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newFiles.length + files.length > 6) {
      showToast('Maximum 6 total images allowed per property', 'warning');
      return;
    }

    setNewFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.monthlyRent || !formData.address) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val);
      });

      payload.append('amenities', JSON.stringify(selectedAmenities));

      // Existing images to keep
      existingImages.forEach((img) => {
        payload.append('existingImages', img);
      });

      // Removed images to delete
      removedImages.forEach((img) => {
        payload.append('removedImages', img);
      });

      // New files
      newFiles.forEach((file) => {
        payload.append('images', file);
      });

      const res = await api.put(`/properties/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showToast('Property updated successfully!', 'success');
        navigate('/owner/properties');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading property details..." />;
  }

  if (!formData) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/owner/properties')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to My Properties
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Edit Property Listing
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Update rental pricing, description, amenities, or replace photographs.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
            Basic Information
          </h3>

          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              required
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

        {/* Location Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
            Location & Address
          </h3>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              name="address"
              className="form-control"
              required
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
                value={formData.pinCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Amenities Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
            Amenities
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
                    fontSize: '0.9rem'
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

        {/* Photographs & Uploads */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Property Photographs
          </h3>

          {/* Existing Photos */}
          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                Current Images ({existingImages.length})
              </label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {existingImages.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '120px',
                      height: '90px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <img
                      src={
                        img.startsWith('http')
                          ? img
                          : `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${img}`
                      }
                      alt="Property"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.85)',
                        color: '#ffffff',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add More Photos */}
          <label
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              backgroundColor: 'var(--color-bg-alt)',
              textAlign: 'center'
            }}
          >
            <Upload size={28} color="var(--color-primary)" />
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Upload additional photographs
            </span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>

          {/* New Previews */}
          {newPreviews.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {newPreviews.map((url, idx) => (
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
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewFile(idx)}
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
                      justifyContent: 'center'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Updates'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyPage;
