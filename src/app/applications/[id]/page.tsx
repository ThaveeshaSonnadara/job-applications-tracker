'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, Sparkles, BookOpen, Trash2,
  MapPin, Building2, Calendar, Phone, Mail, User, Clock,
} from 'lucide-react';
import { Application, STATUS_CONFIG, SOURCE_CONFIG, ALL_STATUSES, ApplicationStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchApp = () => {
    fetch(`/api/applications/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { router.push('/applications'); return; }
        setApp(data);
        setLoading(false);
      })
      .catch(() => { setLoading(false); router.push('/applications'); });
  };

  useEffect(() => { fetchApp(); }, [params.id]);

  const updateStatus = async (status: ApplicationStatus) => {
    if (!app) return;
    setUpdating(true);
    await fetch(`/api/applications/${app.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchApp();
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!app || !confirm(`Delete application for "${app.companyName}"?`)) return;
    await fetch(`/api/applications/${app.id}`, { method: 'DELETE' });
    router.push('/applications');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!app) return null;

  const statusConfig = STATUS_CONFIG[app.status];

  return (
    <div className="animate-fade-in">
      <Link href="/applications" className="back-link">
        <ArrowLeft size={16} /> Back to Applications
      </Link>

      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
            <h1 className="page-title">{app.companyName}</h1>
            <span
              className="status-badge"
              style={{ color: statusConfig?.color, background: statusConfig?.bgColor, fontSize: '0.85rem' }}
            >
              {statusConfig?.icon} {statusConfig?.label}
            </span>
          </div>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <span>{app.jobTitle}</span>
            {app.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {app.location}</span>}
            {app.jobUrl && (
              <a href={app.jobUrl} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ExternalLink size={13} /> View Listing
              </a>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Link href={`/applications/${app.id}/answers`} className="btn btn-primary">
            <Sparkles size={16} /> AI Answers
          </Link>
          <Link href={`/applications/${app.id}/interview`} className="btn btn-secondary">
            <BookOpen size={16} /> Interview Prep
          </Link>
          <button onClick={handleDelete} className="btn btn-danger btn-icon" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Status Actions */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-md)' }}>
          Update Status
        </h3>
        <div className="status-actions">
          {ALL_STATUSES.map(status => {
            const config = STATUS_CONFIG[status];
            const isActive = app.status === status;
            return (
              <button
                key={status}
                className="status-btn"
                onClick={() => updateStatus(status)}
                disabled={updating || isActive}
                style={{
                  color: config.color,
                  background: isActive ? config.bgColor : 'transparent',
                  borderColor: isActive ? config.color : 'var(--border-primary)',
                  opacity: isActive ? 1 : 0.7,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {config.icon} {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Grid */}
      <div className="detail-grid">
        <div>
          {/* Job Description */}
          {app.jobDescription && (
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-section-title">Job Description</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {app.jobDescription}
              </div>
            </div>
          )}

          {/* Company Background */}
          {app.companyBackground && (
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-section-title">Company Background</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {app.companyBackground}
              </div>
            </div>
          )}

          {/* Notes */}
          {app.notes && (
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-section-title">Notes</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {app.notes}
              </div>
            </div>
          )}

          {/* Generated Answers Preview */}
          {app.generatedAnswers && app.generatedAnswers.length > 0 && (
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <div className="detail-section-title" style={{ margin: 0 }}>
                  AI Generated Answers ({app.generatedAnswers.length})
                </div>
                <Link href={`/applications/${app.id}/answers`} className="btn btn-ghost btn-sm">
                  View All →
                </Link>
              </div>
              {app.generatedAnswers.slice(0, 2).map(a => (
                <div key={a.id} className="answer-card" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div className="answer-question">{a.question}</div>
                  <div className="answer-text" style={{ maxHeight: '100px', overflow: 'hidden' }}>{a.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div>
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="detail-section-title">Application Info</div>

            <div className="detail-field">
              <div className="detail-field-label">Source</div>
              <div className="detail-field-value">
                {SOURCE_CONFIG[app.applicationSource]?.icon} {SOURCE_CONFIG[app.applicationSource]?.label}
              </div>
            </div>

            <div className="detail-field">
              <div className="detail-field-label">Work Mode</div>
              <div className="detail-field-value" style={{ textTransform: 'capitalize' }}>
                {app.workMode?.toLowerCase()}
              </div>
            </div>

            {app.salary && (
              <div className="detail-field">
                <div className="detail-field-label">Salary</div>
                <div className="detail-field-value">{app.salary}</div>
              </div>
            )}

            {app.requiredTechnologies && (
              <div className="detail-field">
                <div className="detail-field-label">Required Technologies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {app.requiredTechnologies.split(',').map((tech, i) => (
                    <span key={i} style={{
                      padding: '2px 10px',
                      background: 'var(--accent-blue-dim)',
                      color: 'var(--accent-blue)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}>
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-field">
              <div className="detail-field-label">Added</div>
              <div className="detail-field-value" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <Calendar size={13} /> {formatDate(app.createdAt)}
              </div>
            </div>

            {app.applicationDate && (
              <div className="detail-field">
                <div className="detail-field-label">Applied On</div>
                <div className="detail-field-value" style={{ fontSize: '0.85rem' }}>
                  {formatDate(app.applicationDate)}
                </div>
              </div>
            )}

            {app.responseDate && (
              <div className="detail-field">
                <div className="detail-field-label">Response On</div>
                <div className="detail-field-value" style={{ fontSize: '0.85rem' }}>
                  {formatDate(app.responseDate)}
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          {(app.contactPerson || app.contactEmail || app.contactPhone) && (
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="detail-section-title">Contact</div>
              {app.contactPerson && (
                <div className="detail-field">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <User size={14} style={{ color: 'var(--text-muted)' }} /> {app.contactPerson}
                  </div>
                </div>
              )}
              {app.contactEmail && (
                <div className="detail-field">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                    <a href={`mailto:${app.contactEmail}`}>{app.contactEmail}</a>
                  </div>
                </div>
              )}
              {app.contactPhone && (
                <div className="detail-field">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    <a href={`tel:${app.contactPhone}`}>{app.contactPhone}</a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {app.documentsAttached && (
            <div className="card">
              <div className="detail-section-title">Documents Attached</div>
              {app.documentsAttached.split(',').map((doc, i) => (
                <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '4px 0' }}>
                  📄 {doc.trim()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
