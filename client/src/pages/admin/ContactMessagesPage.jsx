import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/contact-messages');
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (messageId, status) => {
    try {
      const res = await api.patch(`/admin/contact-messages/${messageId}/status`, { status });
      if (res.data.success) {
        showToast(`Message marked as ${status}`, 'success');
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, status } : m))
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading user inquiries..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Contact Form Inquiries
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Messages received from public users and prospective clients through the contact page.
        </p>
      </div>

      {messages.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((item) => (
            <div key={item._id} className="card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <span
                    className={`badge ${
                      item.status === 'resolved'
                        ? 'badge-success'
                        : item.status === 'read'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                    style={{ marginBottom: '0.4rem' }}
                  >
                    {item.status.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                    {item.subject}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    <span>From: <strong>{item.name}</strong> ({item.email})</span>
                    <span>Received: {new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {item.status !== 'read' && (
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'read')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Mark Read
                    </button>
                  )}
                  {item.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(item._id, 'resolved')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-success)' }}
                    >
                      <CheckCircle size={14} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.6, backgroundColor: 'var(--color-bg-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {item.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <MessageSquare className="empty-state-icon" />
          <h3 className="empty-state-title">No Contact Inquiries</h3>
          <p className="empty-state-text">
            Messages sent from the Contact page form will be recorded in MongoDB and displayed here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
