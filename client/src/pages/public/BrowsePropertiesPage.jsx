import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import PropertyFilters from '../../components/PropertyFilters';
import LoadingSpinner from '../../components/LoadingSpinner';

const BrowsePropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isTenant } = useAuth();

  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filters from URL search params
  const filters = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || 'All',
    bedrooms: searchParams.get('bedrooms') || 'All',
    furnishingStatus: searchParams.get('furnishingStatus') || 'All',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    parkingAvailable: searchParams.get('parkingAvailable') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  };

  // Fetch properties whenever searchParams change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryObj = {};
        for (const [key, value] of searchParams.entries()) {
          if (value && value !== 'All') {
            queryObj[key] = value;
          }
        }
        queryObj.limit = 9;

        const res = await api.get('/properties', { params: queryObj });
        if (res.data.success) {
          setProperties(res.data.properties);
          setPagination({
            page: res.data.page,
            totalPages: res.data.totalPages,
            total: res.data.total
          });
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // If user is tenant, fetch their favorites set
  useEffect(() => {
    if (isTenant) {
      api.get('/favorites')
        .then((res) => {
          if (res.data.success) {
            const favIds = new Set(res.data.favorites.map((f) => f.property?._id));
            setFavorites(favIds);
          }
        })
        .catch(() => {});
    }
  }, [isTenant]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== 'All') {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteToggle = (propId, isNowFavorite) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (isNowFavorite) updated.add(propId);
      else updated.delete(propId);
      return updated;
    });
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-main)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Title & Mobile Filter Toggle */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            gap: '1rem'
          }}
        >
          <div>
            <h1 className="section-title" style={{ fontSize: '2.2rem' }}>
              Browse Rental Properties
            </h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Showing {pagination.total} rental properties matching your search criteria
            </p>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-secondary mobile-filter-btn"
            style={{ display: 'none' }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Two-Column Grid: Filters Sidebar + Property Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }} className="browse-layout">
          {/* Filter Sidebar */}
          <div className={`filter-sidebar-wrapper ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <PropertyFilters
              filters={filters}
              onChange={updateFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Properties Area */}
          <div>
            {loading ? (
              <LoadingSpinner text="Searching available properties..." />
            ) : properties.length > 0 ? (
              <>
                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      isFavorite={favorites.has(property._id)}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      marginTop: '3.5rem'
                    }}
                  >
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>

                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <Building className="empty-state-icon" />
                <h3 className="empty-state-title">No Properties Match Your Search</h3>
                <p className="empty-state-text">
                  Try adjusting your budget range, changing the selected city, or resetting all filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .browse-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .filter-sidebar-wrapper {
            display: none;
          }
          .filter-sidebar-wrapper.mobile-open {
            display: block !important;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowsePropertiesPage;
