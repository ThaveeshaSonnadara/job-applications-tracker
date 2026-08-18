'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { Application, STATUS_CONFIG, SOURCE_CONFIG, ApplicationStatus, ALL_STATUSES } from '@/types';
import { formatDate, timeAgo } from '@/lib/utils';
import { useAdmin } from '@/lib/admin';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const { isAdmin } = useAdmin();

  const fetchApps = () => {
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.set('status', filter);
    if (search) params.set('search', search);
    
    fetch(`/api/applications?${params}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, [filter, search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete application for "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const filterCounts = {
    ALL: applications.length,
    ...Object.fromEntries(ALL_STATUSES.map(s => [s, 0])),
  };
  // We need unfiltered counts, so fetch separately on mount
  const [allApps, setAllApps] = useState<Application[]>([]);
  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAllApps(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">{allApps.length} total applications</p>
        </div>
        {isAdmin && (
          <Link href="/applications/new" className="btn btn-primary">
            <Plus size={18} />
            Add Application
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="search-input" style={{ marginBottom: 'var(--space-md)', maxWidth: '400px' }}>
        <Search size={16} />
        <input
          type="text"
          className="form-input"
          placeholder="Search by company or position..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All ({allApps.length})
        </button>
        {ALL_STATUSES.map(status => {
          const count = allApps.filter(a => a.status === status).length;
          if (count === 0 && filter !== status) return null;
          return (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
              style={filter === status ? { color: STATUS_CONFIG[status].color, background: STATUS_CONFIG[status].bgColor } : {}}
            >
              {STATUS_CONFIG[status].icon} {STATUS_CONFIG[status].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3xl)' }}>
          <div className="loading-spinner" />
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>{filter !== 'ALL' ? `No ${STATUS_CONFIG[filter as ApplicationStatus]?.label} applications` : 'No applications found'}</h3>
          <p>{search ? 'Try a different search term.' : 'No applications have been tracked yet.'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Source</th>
                <th>Status</th>
                <th>Work Mode</th>
                <th>Added</th>
                {isAdmin && <th style={{ width: '60px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>
                    <Link href={`/applications/${app.id}`} className="table-link" style={{ fontWeight: 600 }}>
                      {app.companyName}
                    </Link>
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noopener" style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{app.jobTitle}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {SOURCE_CONFIG[app.applicationSource]?.icon} {SOURCE_CONFIG[app.applicationSource]?.label}
                  </td>
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
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {app.workMode?.toLowerCase()}
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {timeAgo(app.createdAt)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => handleDelete(app.id, app.companyName)}
                        title="Delete"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
