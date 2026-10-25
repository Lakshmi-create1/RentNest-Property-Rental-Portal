import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Users,
  Search,
  ArrowRight,
  Building,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import api from '../../api/axios';
import SearchBar from '../../components/SearchBar';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          api.get('/properties/featured'),
          api.get('/properties?limit=6&sort=newest')
        ]);

        if (featuredRes.data.success) {
          setFeaturedProperties(featuredRes.data.properties);
        }
        if (recentRes.data.success) {
          setRecentProperties(recentRes.data.properties);
        }
      } catch (err) {
        console.error('Failed to load homepage properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '5rem 0 7rem 0',
          position: 'relative'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Sparkles size={16} color="#38bdf8" />
            <span>Modern Rental Experience Across Major Indian Cities</span>
          </div>

          <h1
            style={{
              fontSize: '3.25rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em'
            }}
          >
            Find Your Perfect <br />
            <span style={{ color: '#38bdf8' }}>Rental Home</span> With Confidence
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#e2e8f0',
              lineHeight: 1.6,
              marginBottom: '3rem',
              maxWidth: '680px',
              margin: '0 auto 3rem auto'
            }}
          >
            Explore verified apartments, independent houses, villas, and co-living PG accommodations. Direct owner contacts, zero hidden charges, and transparent lease agreements.
          </p>

          {/* Integrated Search Bar */}
          <div style={{ textAlign: 'left', position: 'relative', zIndex: 10 }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              gap: '1rem'
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Handpicked
              </span>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Top-rated rental properties verified for exceptional amenities and prime locations.
              </p>
            </div>
            <Link to="/properties" className="btn btn-outline btn-sm">
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured rental listings..." />
          ) : featuredProperties.length > 0 ? (
            <div className="grid-3">
              {featuredProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Building className="empty-state-icon" />
              <h3 className="empty-state-title">No Featured Properties Yet</h3>
              <p className="empty-state-text">Check back soon or explore our browse catalogue.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits / Why Us Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <h2 className="section-title">Why Choose RentNest?</h2>
            <p className="section-subtitle">
              We eliminate the traditional rental headaches by connecting tenants directly with property owners.
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--color-dark)' }}>
                Verified Owners & Listings
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                Every property listing undergoes administrator moderation and phone verification to prevent fake ads and fraudulent photos.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--color-secondary-light)',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--color-dark)' }}>
                Direct Communication
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                Submit rental inquiries directly through the platform. Request property tours and chat with the owner without high brokerage cuts.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--color-dark)' }}>
                Role-Based Portals
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                Tailored dashboards for tenants to track inquiries and favorites, owners to manage listings, and admins to govern content safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added Properties */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              gap: '1rem'
            }}
          >
            <div>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>
                Fresh on the Market
              </span>
              <h2 className="section-title">Recently Added Rentals</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Explore brand new rental listings added across Hyderabad, Vizag, Vijayawada, and Bengaluru.
              </p>
            </div>
            <Link to="/properties" className="btn btn-secondary btn-sm">
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : recentProperties.length > 0 ? (
            <div className="grid-3">
              {recentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Owner Call to Action */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0f766e 100%)',
          color: '#ffffff',
          padding: '4.5rem 0'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            Are You a Property Owner?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#e0f2fe', lineHeight: 1.6, marginBottom: '2rem' }}>
            Reach thousands of verified tenants looking for accommodation. List your apartments, houses, or PG units within minutes with our streamlined dashboard.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: '#0284c7', border: 'none' }}>
              List Your Property For Free
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
