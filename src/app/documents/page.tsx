'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  fileSize: string;
  fileType: 'pdf' | 'png';
  category: 'Core' | 'Academic' | 'Identity' | 'School Exam';
  description: string;
  usageGuidance: string;
  isMandatoryAlways: boolean;
  isOnlyOnDemand: boolean;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'cv',
    title: 'Software Engineer CV (Latest)',
    filename: 'CV - Thaveesha Sonnadara [SE].pdf',
    fileSize: '109 KB',
    fileType: 'pdf',
    category: 'Core',
    description:
      'Full Software Engineering CV containing Westminster BEng (Upper Second Honours), 1-year MarketPushApps internship experience, all 5 key projects, and tech stack.',
    usageGuidance: 'Attach this to EVERY application, email inquiry, and job portal submission.',
    isMandatoryAlways: true,
    isOnlyOnDemand: false,
  },
  {
    id: 'internship',
    title: 'Internship Confirmation Letter',
    filename: 'Thaveesha Sonnadara Internship confirmation letter.pdf',
    fileSize: '120 KB',
    fileType: 'pdf',
    category: 'Core',
    description:
      'Official 1-Year Industrial Placement confirmation letter from MarketPushApps (Sep 2024 – Sep 2025).',
    usageGuidance: 'Attach when companies request proof of past work experience or service letters.',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  },
  {
    id: 'degree-transcript',
    title: 'University Degree Record & Transcript',
    filename: 'Degree Transcript Screenshot.png',
    fileSize: '125 KB',
    fileType: 'png',
    category: 'Academic',
    description:
      'University of Westminster official student record showing completed BEng (Hons) in Software Engineering with Upper Second Class Honours.',
    usageGuidance: 'Attach when asked for university transcripts, degree certificates, or GPA verification.',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate (Original)',
    filename: 'Birth Certificate Original.pdf',
    fileSize: '560 KB',
    fileType: 'pdf',
    category: 'Identity',
    description:
      'Official Sri Lankan government birth certificate for identification and nationality verification.',
    usageGuidance: 'Provide during HR onboarding, employment contract signing, or when explicitly requested.',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  },
  {
    id: 'gce-al',
    title: 'G.C.E. Advanced Level Results Schedule',
    filename: 'GCE(Advanced Level) Resutls Schedule.pdf',
    fileSize: '879 KB',
    fileType: 'pdf',
    category: 'School Exam',
    description:
      'Physical Science (Combined Mathematics) results schedule from Thurstan College, Colombo.',
    usageGuidance: '⚠️ Only attach if the application form or HR recruiter specifically asks for GCE A/L results.',
    isMandatoryAlways: false,
    isOnlyOnDemand: true,
  },
  {
    id: 'gce-ol',
    title: 'G.C.E. Ordinary Level Results Schedule',
    filename: 'GCE(Ordinary Level) Resutls Schedule.pdf',
    fileSize: '686 KB',
    fileType: 'pdf',
    category: 'School Exam',
    description: 'Official G.C.E. O/L examination results schedule.',
    usageGuidance: '⚠️ Only attach if the application form explicitly asks for GCE O/L results.',
    isMandatoryAlways: false,
    isOnlyOnDemand: true,
  },
];

export default function DocumentManagerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const filteredDocs = DOCUMENTS.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Document Manager</h1>
          <p className="page-subtitle">
            All your official job application documents ready for quick download, preview, and attachment
          </p>
        </div>
      </div>

      {/* Sri Lankan Job Application Document Guidance Callout */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--space-xl)',
          background: 'var(--secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
          <div style={{ color: 'var(--accent-purple)', marginTop: '2px' }}>
            <Info size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Sri Lankan Job Application Document Guidelines
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              • <strong>Always attach:</strong> Your Updated Software Engineering CV.<br />
              • <strong>For Technical Screenings:</strong> Have your Degree Record & Internship Letter ready.<br />
              • <strong>School Exam Results (A/L & O/L):</strong> Keep on standby — only submit when the portal or HR explicitly demands school exam results.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('ALL')}
        >
          All Documents ({DOCUMENTS.length})
        </button>
        {['Core', 'Academic', 'Identity', 'School Exam'].map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat} ({DOCUMENTS.filter((d) => d.category === cat).length})
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="doc-grid">
        {filteredDocs.map((doc, i) => (
          <div
            key={doc.id}
            className={`doc-card animate-fade-in-up stagger-${i + 1}`}
            style={{ flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 'var(--space-md)' }}>
                <div className="doc-icon">
                  {doc.category === 'Core' && <Briefcase size={22} color="var(--accent-purple)" />}
                  {doc.category === 'Academic' && <GraduationCap size={22} color="var(--accent-blue)" />}
                  {doc.category === 'Identity' && <ShieldCheck size={22} color="var(--accent-green)" />}
                  {doc.category === 'School Exam' && <Award size={22} color="var(--accent-orange)" />}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {doc.isMandatoryAlways && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-purple-dim)',
                        color: 'var(--accent-purple)',
                      }}
                    >
                      Primary
                    </span>
                  )}
                  {doc.isOnlyOnDemand && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-orange-dim)',
                        color: 'var(--accent-orange)',
                      }}
                    >
                      On Demand Only
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-glass)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {doc.fileSize}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
                {doc.title}
              </h3>

              <div
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-md)',
                  wordBreak: 'break-all',
                }}
              >
                {doc.filename}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                {doc.description}
              </p>

              <div
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: doc.isOnlyOnDemand ? 'rgba(251, 146, 60, 0.08)' : 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${doc.isOnlyOnDemand ? 'rgba(251, 146, 60, 0.2)' : 'var(--border-primary)'}`,
                  fontSize: '0.8rem',
                  color: doc.isOnlyOnDemand ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                {doc.usageGuidance}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%' }}>
              <a
                href={`/documents/${encodeURIComponent(doc.filename)}`}
                target="_blank"
                rel="noopener"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <Eye size={14} /> Preview
              </a>
              <a
                href={`/documents/${encodeURIComponent(doc.filename)}`}
                download={doc.filename}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
