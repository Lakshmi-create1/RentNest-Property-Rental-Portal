import React from 'react';
import { Building2, CheckCircle2, Shield, Database, Code, Cpu } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Full Stack Development Capstone
          </span>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
            About Property Listing & Rental Portal
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0 auto' }}>
            A state-of-the-art web application connecting property owners directly with prospective tenants across major urban centres in India.
          </p>
        </div>

        {/* Project Objectives */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Project Vision & Problem Statement
          </h2>
          <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Finding transparent, affordable, and safe rental housing in metropolitan cities has traditionally been hindered by heavy brokerage commissions, unverified listings, and outdated contact mechanisms. The <strong>Property Listing & Rental Portal (RentNest)</strong> was built as a full-stack solution to automate and modernize the property discovery lifecycle.
          </p>
          <div className="grid-2">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--color-dark)' }}>Verified Accommodation</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Only admin-reviewed properties with real specifications and uploaded photos are made publicly available.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--color-dark)' }}>Zero Brokerage Friction</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Tenants can send direct rental inquiries and schedule property visits directly with legitimate landlords.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Full-Stack Technology Architecture
          </h2>

          <div className="grid-3">
            <div className="card" style={{ padding: '1.75rem' }}>
              <Code size={28} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                Frontend (React & Vite)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Built with modern React 18, Vite tooling, React Router DOM v6 declarative routing, Context API state management, and custom CSS3 responsive layouts.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <Cpu size={28} color="var(--color-secondary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                Backend (Node & Express)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Modular RESTful API architecture powered by Express.js, JWT HttpOnly cookie authentication, Bcrypt password hashing, and Multer file upload handling.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <Database size={28} color="#d97706" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                Database (MongoDB)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                High-performance NoSQL data layer with Mongoose schemas, compound indexes for fast geospatial and price range queries, and ObjectId population.
              </p>
            </div>
          </div>
        </div>

        {/* Role Matrix */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '1.25rem' }}>
            System Role Capabilities
          </h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Primary Responsibilities</th>
                  <th>Access Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Tenant</strong></td>
                  <td>Search rentals, filter by budget/city, save favorites, submit inquiries & visit requests.</td>
                  <td>Public browsing + Tenant dashboard</td>
                </tr>
                <tr>
                  <td><strong>Property Owner</strong></td>
                  <td>Publish listings, upload multi-image media, track views, accept/reject tenant inquiries.</td>
                  <td>Owner dashboard + Property management</td>
                </tr>
                <tr>
                  <td><strong>Administrator</strong></td>
                  <td>Audit listings, review user reports, toggle account status, oversee inquiries and feedback.</td>
                  <td>Exclusive Admin dashboard & moderation APIs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
