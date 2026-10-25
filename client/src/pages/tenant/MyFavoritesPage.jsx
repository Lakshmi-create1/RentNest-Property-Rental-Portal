import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyFavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.favorites);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propId) => {
    // Remove the un-favorited property from the current list
    setFavorites((prev) => prev.filter((item) => item.property?._id !== propId));
  };

  if (loading) {
    return <LoadingSpinner text="Loading saved properties..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          My Saved Properties
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          You have {favorites.length} properties saved to your wishlist.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid-3">
          {favorites.map((item) => (
            <PropertyCard
              key={item._id}
              property={item.property}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart className="empty-state-icon" style={{ color: '#f43f5e' }} />
          <h3 className="empty-state-title">No Saved Properties</h3>
          <p className="empty-state-text">
            Click the heart icon on any property card to save it for quick review and comparison.
          </p>
          <Link to="/properties" className="btn btn-primary btn-sm">
            <Search size={16} /> Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyFavoritesPage;
