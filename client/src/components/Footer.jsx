import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '4rem 0 2rem 0',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b'
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Rent<span style={{ color: 'var(--color-primary)' }}>Nest</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              A full-stack property listing and rental portal connecting property owners and verified tenants across India with transparent listings and direct communication.
            </p>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              FSD Semester Capstone Project
            </span>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/properties" style={{ color: '#94a3b8' }}>Browse Properties</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About Portal</Link></li>
              <li><Link to="/contact" style={{ color: '#94a3b8' }}>Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Portal Features */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Popular Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/properties?propertyType=Apartment" style={{ color: '#94a3b8' }}>Apartments & Flats</Link></li>
              <li><Link to="/properties?propertyType=Independent+House" style={{ color: '#94a3b8' }}>Independent Houses</Link></li>
              <li><Link to="/properties?propertyType=Villa" style={{ color: '#94a3b8' }}>Luxury Villas</Link></li>
              <li><Link to="/properties?propertyType=PG%2FHostel" style={{ color: '#94a3b8' }}>PG & Co-living</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Contact Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--color-primary)" />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="var(--color-primary)" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--color-primary)" />
                <span>support@rentnest-portal.com</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem'
          }}
        >
          <p>© {new Date().getFullYear()} RentNest Portal. Built for Full Stack Development Project.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with React, Express, MongoDB & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
