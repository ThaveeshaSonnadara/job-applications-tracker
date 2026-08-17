'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Briefcase, Loader2, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { ALL_SOURCES, ALL_WORK_MODES, SOURCE_CONFIG, ApplicationSource, WorkMode } from '@/types';

const DOCUMENTS = [
  { id: 'cv', name: 'CV - Thaveesha Sonnadara [SE].pdf', always: true },
  { id: 'internship', name: 'Internship Confirmation Letter.pdf', always: false },
  { id: 'transcript', name: 'Degree Transcript Screenshot.png', always: false },
  { id: 'birth', name: 'Birth Certificate Original.pdf', always: false },
  { id: 'gce_al', name: 'GCE(Advanced Level) Results Schedule.pdf', always: false },
  { id: 'gce_ol', name: 'GCE(Ordinary Level) Results Schedule.pdf', always: false },
];

export default function NewApplicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    jobDescription: '',
    companyBackground: '',
    applicationSource: 'LINKEDIN',
    workMode: 'ONSITE' as WorkMode,
    salary: '',
    location: '',
    requiredTechnologies: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
    documentsAttached: 'cv',
  });

  const [selectedDocs, setSelectedDocs] = useState<string[]>(['cv']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleExtract = async () => {
    if (!form.jobUrl) {
      setExtractError('Please enter a job application URL first');
      return;
    }

    setExtracting(true);
    setExtractError(null);
    setExtractSuccess(false);

    try {
      const res = await fetch('/api/ai/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.jobUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract job details');
      }

      // Update form with extracted data
      setForm(prev => ({
        ...prev,
        companyName: data.companyName || prev.companyName,
        jobTitle: data.jobTitle || prev.jobTitle,
        jobDescription: data.jobDescription || prev.jobDescription,
        companyBackground: data.companyBackground || prev.companyBackground,
        requiredTechnologies: data.requiredTechnologies || prev.requiredTechnologies,
        salary: data.salary || prev.salary,
        location: data.location || prev.location,
        workMode: data.workMode || prev.workMode,
        applicationSource: data.applicationSource || prev.applicationSource,
        contactPerson: data.contactPerson || prev.contactPerson,
        contactEmail: data.contactEmail || prev.contactEmail,
        contactPhone: data.contactPhone || prev.contactPhone,
      }));

      setExtractSuccess(true);
      setTimeout(() => setExtractSuccess(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to extract job details';
      setExtractError(message);
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.jobTitle) return;

    setSaving(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          documentsAttached: selectedDocs.join(','),
        }),
      });
      const data = await res.json();
      router.push(`/applications/${data.id}`);
    } catch (error) {
      alert('Failed to save application');
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Link href="/applications" className="back-link">
        <ArrowLeft size={16} />
        Back to Applications
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Application</h1>
          <p className="page-subtitle">Track a new job opportunity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-sm-2)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={16} /> Company & Role
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                placeholder="e.g. WSO2, Sysco LABS, IFS"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                name="jobTitle"
                className="form-input"
                placeholder="e.g. Associate Software Engineer"
                value={form.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Application URL</label>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <input
                type="url"
                name="jobUrl"
                className="form-input"
                placeholder="https://..."
                value={form.jobUrl}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleExtract}
                disabled={extracting || !form.jobUrl}
                className="btn btn-primary"
                style={{
                  padding: '10px 16px',
                  whiteSpace: 'nowrap',
                  height: 'fit-content',
                  alignSelf: 'flex-end',
                  opacity: extracting || !form.jobUrl ? 0.5 : 1,
                  boxShadow: extracting || !form.jobUrl ? 'none' : undefined,
                  cursor: extracting || !form.jobUrl ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
                }}
                aria-label="Extract job details from URL"
              >
                {extracting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ marginRight: 'var(--space-xs)' }} />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Zap size={16} style={{ marginRight: 'var(--space-xs)' }} />
                    Extract
                  </>
                )}
              </button>
            </div>
            {(extractError || extractSuccess) && (
              <div
                style={{
                  marginTop: 'var(--space-xs)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-caption)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: extractSuccess ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                  color: extractSuccess ? 'var(--accent-green)' : 'var(--accent-red)',
                  border: `1px solid ${extractSuccess ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                }}
              >
                {extractSuccess ? (
                  <>
                    <CheckCircle size={14} />
                    Job details extracted successfully! Review and edit as needed.
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} />
                    {extractError}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Application Source</label>
              <select name="applicationSource" className="form-select" value={form.applicationSource} onChange={handleChange}>
                {ALL_SOURCES.map(s => (
                  <option key={s} value={s}>{SOURCE_CONFIG[s].icon} {SOURCE_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Work Mode</label>
              <select name="workMode" className="form-select" value={form.workMode} onChange={handleChange}>
                {ALL_WORK_MODES.map(m => (
                  <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Colombo, Sri Lanka"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-sm-2)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            📝 Job Details
          </h3>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea
              name="jobDescription"
              className="form-textarea"
              placeholder="Paste the full job description here... This helps the AI generate better answers for your application."
              value={form.jobDescription}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Background</label>
            <textarea
              name="companyBackground"
              className="form-textarea"
              placeholder="What does the company do? Their mission, products, culture... This helps personalize your application answers."
              value={form.companyBackground}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Required Technologies</label>
              <input
                type="text"
                name="requiredTechnologies"
                className="form-input"
                placeholder="e.g. React, Node.js, PostgreSQL"
                value={form.requiredTechnologies}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Salary (Expected/Listed)</label>
              <input
                type="text"
                name="salary"
                className="form-input"
                placeholder="e.g. LKR 100,000 - 150,000"
                value={form.salary}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-sm-2)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            👤 Contact Details
          </h3>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                className="form-input"
                placeholder="HR name"
                value={form.contactPerson}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                className="form-input"
                placeholder="hr@company.com"
                value={form.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                className="form-input"
                placeholder="+94 XX XXX XXXX"
                value={form.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-textarea"
              placeholder="Any additional notes..."
              value={form.notes}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-sm-2)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
            📎 Documents to Attach
          </h3>

          <div className="form-checkbox-group">
            {DOCUMENTS.map(doc => (
              <label key={doc.id} className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => toggleDoc(doc.id)}
                />
                <span>{doc.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
          <Link href="/applications" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving || !form.companyName || !form.jobTitle}
            style={{
              opacity: saving || !form.companyName || !form.jobTitle ? 0.5 : 1,
              boxShadow: saving || !form.companyName || !form.jobTitle ? 'none' : undefined,
              cursor: saving || !form.companyName || !form.jobTitle ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Application'}
          </button>
        </div>
      </form>
    </div>
  );
}
