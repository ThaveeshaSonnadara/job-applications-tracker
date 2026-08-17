'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Award,
  PhoneCall,
  MailCheck,
  CheckCircle,
  Clock,
  Target,
  ArrowRight,
  Briefcase,
  Layers,
  Globe,
} from 'lucide-react';
import { Application, STATUS_CONFIG, SOURCE_CONFIG, ALL_STATUSES, ALL_SOURCES } from '@/types';

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  const total = applications.length;

  const statusCounts = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, applications.filter((a) => a.status === s).length])
  );

  const sourceCounts = Object.fromEntries(
    ALL_SOURCES.map((s) => [s, applications.filter((a) => a.applicationSource === s).length])
  );

  const workModeCounts = {
    ONSITE: applications.filter((a) => a.workMode === 'ONSITE').length,
    REMOTE: applications.filter((a) => a.workMode === 'REMOTE').length,
    HYBRID: applications.filter((a) => a.workMode === 'HYBRID').length,
  };

  // Tech frequency analysis
  const techMap: Record<string, number> = {};
  applications.forEach((app) => {
    if (app.requiredTechnologies) {
      app.requiredTechnologies.split(',').forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) {
          techMap[trimmed] = (techMap[trimmed] || 0) + 1;
        }
      });
    }
  });

  const topTechs = Object.entries(techMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const totalResponses =
    statusCounts.INTERVIEW_CALLED +
    statusCounts.PHONE_CALL +
    statusCounts.EMAIL_RESPONSE +
    statusCounts.OFFERED +
    statusCounts.REJECTED;

  const totalPositiveOutcomes =
    statusCounts.INTERVIEW_CALLED +
    statusCounts.PHONE_CALL +
    statusCounts.EMAIL_RESPONSE +
    statusCounts.OFFERED;

  const responseRate = total > 0 ? Math.round((totalResponses / total) * 100) : 0;
  const positiveRate = total > 0 ? Math.round((totalPositiveOutcomes / total) * 100) : 0;

  // Funnel steps
  const funnelSteps = [
    { label: 'Total Saved/Tracked', count: total, color: 'var(--accent-purple)' },
    {
      label: 'Applied',
      count: applications.filter((a) => a.status !== 'SAVED' && a.status !== 'WITHDRAWN').length,
      color: 'var(--accent-blue)',
    },
    {
      label: 'Responses Received (Phone/Email/Interview)',
      count: totalResponses,
      color: 'var(--accent-teal)',
    },
    {
      label: 'Interviews Called',
      count: statusCounts.INTERVIEW_CALLED + statusCounts.OFFERED,
      color: 'var(--accent-orange)',
    },
    {
      label: 'Job Offers',
      count: statusCounts.OFFERED,
      color: 'var(--accent-green)',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Insights</h1>
          <p className="page-subtitle">Track your application pipeline velocity and conversion metrics</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--accent-purple)' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: 'var(--accent-purple-dim)' }}>
            <Target size={22} color="var(--accent-purple)" />
          </div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Applications</div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-teal)' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: 'var(--accent-teal-dim)' }}>
            <TrendingUp size={22} color="var(--accent-teal)" />
          </div>
          <div className="stat-value">{responseRate}%</div>
          <div className="stat-label">Response Rate</div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-orange)' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: 'var(--accent-orange-dim)' }}>
            <PhoneCall size={22} color="var(--accent-orange)" />
          </div>
          <div className="stat-value">{statusCounts.INTERVIEW_CALLED + statusCounts.PHONE_CALL}</div>
          <div className="stat-label">Interviews / Calls</div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-green)' } as React.CSSProperties}>
          <div className="stat-icon" style={{ background: 'var(--accent-green-dim)' }}>
            <Award size={22} color="var(--accent-green)" />
          </div>
          <div className="stat-value">{statusCounts.OFFERED}</div>
          <div className="stat-label">Job Offers</div>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <Layers size={48} />
          </div>
          <h3>No application data yet</h3>
          <p>Add and track applications to generate detailed analytics, conversion funnels, and platform comparisons.</p>
          <Link href="/applications/new" className="btn btn-primary">
            Add Application
          </Link>
        </div>
      ) : (
        <>
          {/* Conversion Funnel */}
          <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
              🎯 Application Conversion Funnel
            </h3>
            <div className="chart-bar-container">
              {funnelSteps.map((step, idx) => {
                const pct = total > 0 ? Math.max(Math.round((step.count / total) * 100), 2) : 0;
                return (
                  <div key={idx} className="chart-bar-row">
                    <div className="chart-bar-label" style={{ width: '220px', textAlign: 'left' }}>
                      {step.label}
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill visible"
                        style={{
                          background: step.color,
                        }}
                      >
                        {step.count > 0 && `${step.count} (${pct}%)`}
                      </div>
                    </div>
                    <div className="chart-bar-value">{step.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="detail-grid">
            {/* Status Breakdown */}
            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                📊 Status Distribution
              </h3>
              <div className="chart-bar-container">
                {ALL_STATUSES.map((status) => {
                  const count = statusCounts[status] || 0;
                  const config = STATUS_CONFIG[status];
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={status} className="chart-bar-row">
                      <div className="chart-bar-label" style={{ width: '130px', textAlign: 'left' }}>
                        {config.icon} {config.label}
                      </div>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: `${count > 0 ? Math.max(pct, 6) : 0}%`,
                            background: config.color,
                          }}
                        >
                          {count > 0 && `${count}`}
                        </div>
                      </div>
                      <div className="chart-bar-value">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application Sources */}
            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                🌐 Sources & Channels
              </h3>
              <div className="chart-bar-container">
                {ALL_SOURCES.map((source) => {
                  const count = sourceCounts[source] || 0;
                  const config = SOURCE_CONFIG[source];
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={source} className="chart-bar-row">
                      <div className="chart-bar-label" style={{ width: '140px', textAlign: 'left' }}>
                        {config.icon} {config.label}
                      </div>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: `${count > 0 ? Math.max(pct, 6) : 0}%`,
                            background: 'var(--gradient-purple)',
                          }}
                        >
                          {count > 0 && `${count}`}
                        </div>
                      </div>
                      <div className="chart-bar-value">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Work Modes & Most Requested Technologies */}
          <div className="detail-grid">
            {/* Work Modes */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                🏢 Work Mode Preference
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <div
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--accent-purple)' }}>
                    {workModeCounts.ONSITE}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    🏢 Onsite
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--accent-blue)' }}>
                    {workModeCounts.HYBRID}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    🔄 Hybrid
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: 'var(--space-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--accent-teal)' }}>
                    {workModeCounts.REMOTE}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    🏠 Remote
                  </div>
                </div>
              </div>
            </div>

            {/* Most Requested Technologies */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                🔥 Most In-Demand Skills in Applied Roles
              </h3>
              {topTechs.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Enter required technologies in your applications to see skill demand trends.
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {topTechs.map(([tech, count]) => (
                    <div
                      key={tech}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-purple-dim)',
                        border: '1px solid var(--border-accent)',
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tech}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--accent-purple)',
                          color: 'white',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
