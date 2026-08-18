'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Clock, RefreshCw, AlertCircle, Keyboard, Zap } from 'lucide-react';
import { Application, STATUS_CONFIG, ApplicationStatus } from '@/types';
import { timeAgo } from '@/lib/utils';
import { useAdmin } from '@/lib/admin';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isAdmin } = useAdmin();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
        setIsOnline(true);
      }
    } catch (err) {
      setError('Failed to load applications. Check connection and try again.');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if (e.key === 'Escape') setShowShortcuts(false);
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        fetchApplications();
      }
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        window.location.href = '/applications/new';
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('keydown', handleKeyDown);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [fetchApplications]);

  const handleRetry = () => {
    retryTimeoutRef.current = setTimeout(fetchApplications, 100);
  };

  const stats = {
    total: applications.length,
    active: applications.filter(a => ['APPLIED', 'INTERVIEW_CALLED', 'PHONE_CALL', 'EMAIL_RESPONSE'].includes(a.status)).length,
    offered: applications.filter(a => a.status === 'OFFERED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

  const statCards = [
    { label: 'Total', value: stats.total, color: '#0069A4', icon: '📊', bgColor: '#D8EBFB' },
    { label: 'Active', value: stats.active, color: '#1281C3', icon: '⚡', bgColor: '#EAF1F8' },
    { label: 'Offered', value: stats.offered, color: '#16a34a', icon: '🎉', bgColor: '#DCFCE7' },
    { label: 'Rejected', value: stats.rejected, color: '#dc2626', icon: '❌', bgColor: '#FEE2E2' },
  ];

  const recentApps = applications.slice(0, 8);

  // Pipeline data
  const pipelineStatuses: ApplicationStatus[] = ['APPLIED', 'INTERVIEW_CALLED', 'OFFERED'];
  const pipelineTotal = applications.length || 1;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 'var(--space-lg)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
        <div style={{ display: 'flex', gap: 'var(--space-md)', width: '100%', maxWidth: '800px', padding: '0 var(--space-xl)' }}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-title" style={{ width: '40%' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', width: '100%', maxWidth: '800px', padding: '0 var(--space-xl)' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {!isOnline && (
        <div className="offline-indicator" aria-live="polite" />
      )}
      <div className="animate-fade-in">
        <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your job application journey</p>
        </div>
        {isAdmin && (
          <Link href="/applications/new" className="btn btn-primary">
            <Plus size={18} />
            Add Application
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`stat-card animate-fade-in-up stagger-${i + 1}`}
            style={{ '--stat-color': stat.color } as React.CSSProperties}
          >
            <div className="stat-icon" style={{ background: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Bar */}
      {applications.length > 0 && (
        <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
            Application Pipeline
          </h3>
          <div className="pipeline-bar">
            {pipelineStatuses.map(status => {
              const count = applications.filter(a => a.status === status).length;
              const width = (count / pipelineTotal) * 100;
              if (width === 0) return null;
              return (
                <div
                  key={status}
                  className="pipeline-segment"
                  style={{
                    width: `${width}%`,
                    minWidth: count > 0 ? '20px' : '0',
                  }}
                  title={`${STATUS_CONFIG[status].label}: ${count}`}
                >
                  <div
                    className="pipeline-segment-fill visible"
                    style={{
                      background: STATUS_CONFIG[status].color,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            {pipelineStatuses.map(status => {
              const count = applications.filter(a => a.status === status).length;
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)' }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: STATUS_CONFIG[status].color,
                  }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{STATUS_CONFIG[status].label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="card animate-fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Recent Applications
          </h3>
          {applications.length > 0 && (
            <Link href="/applications" className="btn btn-ghost btn-sm">
              View All
            </Link>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={48} />
            </div>
            <h3>No applications yet</h3>
            <p>No applications have been tracked yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map(app => (
                  <tr key={app.id}>
                    <td>
                      <Link href={`/applications/${app.id}`} className="table-link truncate" style={{ maxWidth: '250px', display: 'block' }}>
                        {app.companyName}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{app.jobTitle}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          color: STATUS_CONFIG[app.status]?.color,
                          background: STATUS_CONFIG[app.status]?.bgColor,
                        }}
                      >
                        {STATUS_CONFIG[app.status]?.icon} {STATUS_CONFIG[app.status]?.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm-2)', whiteSpace: 'nowrap' }}>
                      {timeAgo(app.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="card animate-fade-in-up error-message" style={{ marginTop: 'var(--space-lg)' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={handleRetry} type="button" aria-label="Retry loading applications">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="card animate-scale-in"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            maxWidth: '400px',
            width: '90vw',
            boxShadow: 'var(--shadow-lg)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 id="shortcuts-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>
              <Keyboard size={20} style={{ marginRight: 'var(--space-sm)' }} />
              Keyboard Shortcuts
            </h3>
            <button
              onClick={() => setShowShortcuts(false)}
              className="btn btn-ghost btn-icon"
              aria-label="Close shortcuts"
            >
              <Zap size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-sm) var(--space-lg)', fontSize: 'var(--text-sm)' }}>
            <kbd className="kbd">⌘K</kbd> <span>Open shortcuts</span>
            <kbd className="kbd">⌘R</kbd> <span>Refresh data</span>
            <kbd className="kbd">⌘N</kbd> <span>New application</span>
            <kbd className="kbd">Esc</kbd> <span>Close modal</span>
          </div>
          <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            On Windows, use Ctrl instead of ⌘
          </p>
        </div>
      )}

      {/* Click outside to close shortcuts */}
      {showShortcuts && (
        <div
          onClick={() => setShowShortcuts(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'transparent',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  </>
);
}
