import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          maxWidth: '420px',
          width: 'calc(100% - 2.5rem)'
        }}
      >
        {toasts.map((toast) => {
          let bg = '#ffffff';
          let border = 'var(--color-border)';
          let icon = <Info size={18} color="var(--color-info)" />;

          if (toast.type === 'success') {
            border = 'var(--color-success)';
            icon = <CheckCircle size={18} color="var(--color-success)" />;
          } else if (toast.type === 'error') {
            border = 'var(--color-danger)';
            icon = <AlertCircle size={18} color="var(--color-danger)" />;
          } else if (toast.type === 'warning') {
            border = 'var(--color-warning)';
            icon = <AlertTriangle size={18} color="var(--color-warning)" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                backgroundColor: bg,
                borderLeft: `4px solid ${border}`,
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: 'toastIn 0.25s ease-out',
                border: '1px solid var(--color-border)',
                borderLeftWidth: '4px'
              }}
            >
              <div style={{ flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 500 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: 'var(--color-text-light)',
                  padding: '2px',
                  borderRadius: '4px',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
