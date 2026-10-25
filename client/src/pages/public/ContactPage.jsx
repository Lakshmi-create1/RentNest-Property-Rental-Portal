import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill out all contact fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        showToast(res.data.message || 'Message sent successfully!', 'success');
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
            Get in Touch With Us
          </h1>
          <p className="section-subtitle">
            Have questions about listing a property or need help with a rental inquiry? Send us a message!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '2.5rem' }} className="contact-layout">
          {/* Contact Details Card */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#0f172a', color: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#ffffff' }}>
              Contact Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#ffffff' }}>Main Office</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Plot 44, Financial District, Gachibowli, Hyderabad, Telangana - 500032
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#ffffff' }}>Customer Support</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>+91 98765 43210</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#ffffff' }}>Email Inquiries</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>support@rentnest-portal.com</span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '3rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.85rem',
                color: '#cbd5e1'
              }}
            >
              Support operating hours: Monday – Saturday, 9:00 AM – 7:00 PM IST
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
              Send Us a Message
            </h3>

            {submitted && (
              <div
                style={{
                  backgroundColor: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success)',
                  color: 'var(--color-success)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <CheckCircle size={20} />
                <span>Your query has been recorded in MongoDB! We will reply promptly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    required
                    placeholder="e.g. Ananya Rao"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  required
                  placeholder="e.g. Question about listing verification"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  required
                  placeholder="Type your message or questions here..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.8rem 1.75rem' }}
                disabled={submitting}
              >
                <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
