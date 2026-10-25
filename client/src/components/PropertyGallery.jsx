import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const PropertyGallery = ({ images = [], title = 'Property Image' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackImage =
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80';

  const processedImages =
    images.length > 0
      ? images.map((img) =>
          img.startsWith('http')
            ? img
            : `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${img}`
        )
      : [fallbackImage];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? processedImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === processedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Main Image Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <img
          src={processedImages[currentIndex]}
          alt={`${title} - view ${currentIndex + 1}`}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Navigation Arrows (if > 1 image) */}
        {processedImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--color-dark)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
              aria-label="Previous Image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '16px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--color-dark)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
              aria-label="Next Image"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <ImageIcon size={14} />
          <span>
            {currentIndex + 1} / {processedImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {processedImages.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {processedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                flexShrink: 0,
                width: '80px',
                height: '60px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border:
                  currentIndex === idx
                    ? '2px solid var(--color-primary)'
                    : '2px solid transparent',
                opacity: currentIndex === idx ? 1 : 0.65,
                transition: 'all var(--transition-fast)',
                cursor: 'pointer'
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
