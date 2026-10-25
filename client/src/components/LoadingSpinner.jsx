import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 32, text = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '0.75rem',
        color: 'var(--color-primary)'
      }}
    >
      <Loader2 size={size} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      {text && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          {text}
        </p>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
