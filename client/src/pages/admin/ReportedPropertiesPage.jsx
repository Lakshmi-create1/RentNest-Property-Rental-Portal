import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ReportedPropertiesPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const res = await api.patch(`/admin/reports/${reportId}`, { status: newStatus });
      if (res.data.success) {
        showToast(`Report status updated to ${newStatus}`, 'success');
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading abuse reports..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.4rem' }}>
          Reported Properties & Moderation
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Investigate tenant complaints, flag suspicious accounts, and resolve reported listings.
        </p>
      </div>

      {reports.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reports.map((report) => (
            <div key={report._id} className="card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <span
                    className={`badge ${
                      report.status === 'resolved'
                        ? 'badge-success'
                        : report.status === 'reviewed'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                    style={{ marginBottom: '0.4rem' }}
                  >
                    {report.status.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                    Reason: {report.reason}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Reported on: {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Moderation Status Controls */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {report.status !== 'reviewed' && (
                    <button
                      onClick={() => handleUpdateStatus(report._id, 'reviewed')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {report.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(report._id, 'resolved')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-success)' }}
                    >
                      <CheckCircle size={14} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-2">
                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Reporter Feedback
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', backgroundColor: 'var(--color-bg-alt)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    {report.description || 'No additional remarks provided by reporter.'}
                  </p>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.4rem' }}>
                    Submitted by: <strong>{report.reporter?.name}</strong> ({report.reporter?.email})
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Target Property
                  </h4>
                  {report.property ? (
                    <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ fontSize: '0.92rem', display: 'block' }}>
                        {report.property.title}
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        City: {report.property.city} • Owner: {report.property.owner?.name}
                      </span>
                      <Link
                        to={`/properties/${report.property._id}`}
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '0.6rem', padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                      >
                        <ExternalLink size={12} /> Inspect Listing
                      </Link>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-text-light)', fontSize: '0.88rem' }}>
                      Property no longer exists
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertOctagon className="empty-state-icon" />
          <h3 className="empty-state-title">No Pending Reports</h3>
          <p className="empty-state-text">
            All submitted property and user reports have been reviewed and resolved.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportedPropertiesPage;
