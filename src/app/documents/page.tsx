'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  Eye,
  Info,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
  Upload,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  FileUp,
  ShieldAlert,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/lib/admin';

interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  fileSize: string;
  fileType: string;
  category: string;
  description: string;
  usageGuidance: string;
  isMandatoryAlways: boolean;
  isOnlyOnDemand: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORY_CONFIG = [
  {
    id: 'Core',
    label: 'Core',
    icon: Briefcase,
    color: 'var(--accent-purple)',
    bg: 'var(--accent-purple-dim)',
    description: 'CV, Placement & Experience letters',
  },
  {
    id: 'Academic',
    label: 'Academic',
    icon: GraduationCap,
    color: 'var(--accent-blue)',
    bg: 'var(--accent-blue-dim)',
    description: 'Degree transcripts, certificates & GPA records',
  },
  {
    id: 'Identity',
    label: 'Identity',
    icon: ShieldCheck,
    color: 'var(--accent-green)',
    bg: 'var(--accent-green-dim)',
    description: 'Birth certificates, IDs & official documents',
  },
  {
    id: 'School Exam',
    label: 'School Exam',
    icon: Award,
    color: 'var(--accent-orange)',
    bg: 'var(--accent-orange-dim)',
    description: 'G.C.E. Advanced Level & Ordinary Level results',
  },
];

const CATEGORIES = CATEGORY_CONFIG.map((c) => c.id);

// Custom Styled Category Dropdown
function CategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = CATEGORY_CONFIG.find((c) => c.id === value) || CATEGORY_CONFIG[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="category-badge-icon"
            style={{ background: selected.bg, color: selected.color }}
          >
            <SelectedIcon size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              {selected.label}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
              {selected.description}
            </div>
          </div>
        </div>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-tertiary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-fast)',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        />
      </button>

      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {CATEGORY_CONFIG.map((item) => {
            const ItemIcon = item.icon;
            const isSelected = item.id === value;
            return (
              <button
                key={item.id}
                type="button"
                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    className="category-badge-icon"
                    style={{ background: item.bg, color: item.color }}
                  >
                    <ItemIcon size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <Check size={16} style={{ color: 'var(--primary)', marginLeft: '8px', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DocumentManagerPage() {
  const { isAdmin } = useAdmin();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<DocumentItem | null>(null);

  // Form states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Core',
    description: '',
    usageGuidance: '',
    isMandatoryAlways: false,
    isOnlyOnDemand: false,
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setToastMessage({ type: 'error', text: 'Failed to load documents from database' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(query);
      const matchDesc = doc.description.toLowerCase().includes(query);
      const matchFilename = doc.filename.toLowerCase().includes(query);
      const matchGuidance = doc.usageGuidance.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchFilename && !matchGuidance) return false;
    }
    return true;
  });

  // Open upload modal
  const openUploadModal = () => {
    setUploadFile(null);
    setFormData({
      title: '',
      category: 'Core',
      description: '',
      usageGuidance: '',
      isMandatoryAlways: false,
      isOnlyOnDemand: false,
    });
    setFormError('');
    setIsUploadOpen(true);
  };

  // Open edit modal
  const openEditModal = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      category: doc.category,
      description: doc.description,
      usageGuidance: doc.usageGuidance,
      isMandatoryAlways: doc.isMandatoryAlways,
      isOnlyOnDemand: doc.isOnlyOnDemand,
    });
    setFormError('');
  };

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadFile(file);
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setFormData((prev) => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setFormData((prev) => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  // Submit Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setFormError('Please select a file to upload');
      return;
    }
    if (!formData.title.trim()) {
      setFormError('Please enter a document title');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Please enter a description');
      return;
    }
    if (!formData.usageGuidance.trim()) {
      setFormError('Please enter application usage guidance');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const body = new FormData();
      body.append('file', uploadFile);
      body.append('title', formData.title.trim());
      body.append('category', formData.category);
      body.append('description', formData.description.trim());
      body.append('usageGuidance', formData.usageGuidance.trim());
      body.append('isMandatoryAlways', String(formData.isMandatoryAlways));
      body.append('isOnlyOnDemand', String(formData.isOnlyOnDemand));

      const res = await fetch('/api/documents', {
        method: 'POST',
        body,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to upload document');
      }

      setToastMessage({ type: 'success', text: `Document "${result.title}" uploaded successfully!` });
      setIsUploadOpen(false);
      fetchDocuments();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    if (!formData.title.trim()) {
      setFormError('Please enter a document title');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Please enter a description');
      return;
    }
    if (!formData.usageGuidance.trim()) {
      setFormError('Please enter application usage guidance');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const res = await fetch(`/api/documents/${editingDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          description: formData.description.trim(),
          usageGuidance: formData.usageGuidance.trim(),
          isMandatoryAlways: formData.isMandatoryAlways,
          isOnlyOnDemand: formData.isOnlyOnDemand,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update document');
      }

      setToastMessage({ type: 'success', text: `Document "${result.title}" updated successfully!` });
      setEditingDoc(null);
      fetchDocuments();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deletingDoc) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/documents/${deletingDoc.id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete document');
      }

      setToastMessage({ type: 'success', text: `Document "${deletingDoc.title}" removed.` });
      setDeletingDoc(null);
      fetchDocuments();
    } catch (err: unknown) {
      setToastMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete document',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 2000,
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            background: toastMessage.type === 'success' ? '#15803d' : '#b91c1c',
            color: '#FFFFFF',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h1 className="page-title">Document Manager</h1>
          <p className="page-subtitle">
            All official job application documents ready for quick download, preview, and attachment
          </p>
        </div>

        {/* Admin Upload Button */}
        {isAdmin && (
          <button onClick={openUploadModal} className="btn btn-primary">
            <Plus size={16} /> Upload Document
          </button>
        )}
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

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {/* Filter Tabs */}
          <div className="filter-tabs" style={{ marginBottom: 0 }}>
            <button
              className={`filter-tab ${selectedCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              All Documents ({documents.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = documents.filter((d) => d.category === cat).length;
              return (
                <button
                  key={cat}
                  className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="search-input" style={{ width: '260px' }}>
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '38px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="loading-spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : filteredDocs.length === 0 ? (
        /* Empty State */
        <div className="card empty-state" style={{ padding: 'var(--space-3xl)' }}>
          <FileText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-md)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
            No documents found
          </h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
            {searchQuery ? 'Try changing your search keywords or filter.' : 'Upload documents to get started.'}
          </p>
          {isAdmin && (
            <button onClick={openUploadModal} className="btn btn-primary btn-sm">
              <Plus size={14} /> Upload First Document
            </button>
          )}
        </div>
      ) : (
        /* Documents Grid */
        <div className="doc-grid">
          {filteredDocs.map((doc, i) => (
            <div
              key={doc.id}
              className={`doc-card animate-fade-in-up stagger-${(i % 6) + 1}`}
              style={{ flexDirection: 'column', justifyContent: 'space-between', cursor: 'default' }}
            >
              <div style={{ width: '100%' }}>
                {/* Top Row: Icon + Badges + Admin Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 'var(--space-md)' }}>
                  <div className="doc-icon">
                    {doc.category === 'Core' && <Briefcase size={22} color="var(--accent-purple)" />}
                    {doc.category === 'Academic' && <GraduationCap size={22} color="var(--accent-blue)" />}
                    {doc.category === 'Identity' && <ShieldCheck size={22} color="var(--accent-green)" />}
                    {doc.category === 'School Exam' && <Award size={22} color="var(--accent-orange)" />}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                        On Demand
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

                    {/* Admin Action Buttons */}
                    {isAdmin && (
                      <div className="doc-admin-actions" style={{ marginLeft: '4px' }}>
                        <button
                          onClick={() => openEditModal(doc)}
                          className="btn-icon-sm"
                          title="Edit Document Info"
                          aria-label="Edit Document"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeletingDoc(doc)}
                          className="btn-icon-sm delete"
                          title="Delete Document"
                          aria-label="Delete Document"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
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

              {/* Action Buttons */}
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
      )}

      {/* ========================================================= */}
      {/* UPLOAD MODAL (ADMIN ONLY)                                 */}
      {/* ========================================================= */}
      {isUploadOpen && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setIsUploadOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FileUp size={20} color="var(--primary)" />
                Upload New Document
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsUploadOpen(false)}
                disabled={isSubmitting}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="modal-body">
                {/* File Dropzone */}
                <div className="form-group">
                  <label className="form-label">File *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    className={`file-dropzone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="file-dropzone-icon">
                      <Upload size={22} />
                    </div>
                    {uploadFile ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {uploadFile.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {(uploadFile.size / 1024).toFixed(1)} KB — Click or drop another file to replace
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          Click to browse or drag & drop file
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                          Supported: PDF, PNG, JPG, DOCX (Max 10MB)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Document Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software Engineer CV (Latest)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Styled Category Dropdown */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <CategoryDropdown
                    value={formData.category}
                    onChange={(cat) => setFormData({ ...formData, category: cat })}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Brief description of what this document contains and includes..."
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* Usage Guidance */}
                <div className="form-group">
                  <label className="form-label">Usage Guidance *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Attach this to EVERY application, email inquiry, and job portal submission."
                    rows={2}
                    value={formData.usageGuidance}
                    onChange={(e) => setFormData({ ...formData, usageGuidance: e.target.value })}
                    required
                  />
                </div>

                {/* Flags / Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <div
                    className="toggle-switch-wrapper"
                    onClick={() => setFormData({ ...formData, isMandatoryAlways: !formData.isMandatoryAlways })}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Primary Document
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Flag as mandatory for every application (e.g. Primary CV)
                      </div>
                    </div>
                    <div className={`toggle-switch ${formData.isMandatoryAlways ? 'checked' : ''}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>

                  <div
                    className="toggle-switch-wrapper"
                    onClick={() => setFormData({ ...formData, isOnlyOnDemand: !formData.isOnlyOnDemand })}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        On-Demand Only
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Only submit when explicitly requested by HR or portal (e.g. Exam results)
                      </div>
                    </div>
                    <div className={`toggle-switch ${formData.isOnlyOnDemand ? 'checked' : ''}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div
                    style={{
                      marginTop: 'var(--space-md)',
                      padding: '10px 14px',
                      background: 'var(--accent-red-dim)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--accent-red)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner" style={{ width: 14, height: 14 }} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT MODAL (ADMIN ONLY)                                   */}
      {/* ========================================================= */}
      {editingDoc && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setEditingDoc(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Edit2 size={18} color="var(--primary)" />
                Edit Document Information
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingDoc(null)}
                disabled={isSubmitting}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {/* Filename (Read-only) */}
                <div className="form-group">
                  <label className="form-label">Filename</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingDoc.filename}
                    disabled
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Document Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Styled Category Dropdown */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <CategoryDropdown
                    value={formData.category}
                    onChange={(cat) => setFormData({ ...formData, category: cat })}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* Usage Guidance */}
                <div className="form-group">
                  <label className="form-label">Usage Guidance *</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={formData.usageGuidance}
                    onChange={(e) => setFormData({ ...formData, usageGuidance: e.target.value })}
                    required
                  />
                </div>

                {/* Flags / Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <div
                    className="toggle-switch-wrapper"
                    onClick={() => setFormData({ ...formData, isMandatoryAlways: !formData.isMandatoryAlways })}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Primary Document
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Flag as mandatory for every application (e.g. Primary CV)
                      </div>
                    </div>
                    <div className={`toggle-switch ${formData.isMandatoryAlways ? 'checked' : ''}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>

                  <div
                    className="toggle-switch-wrapper"
                    onClick={() => setFormData({ ...formData, isOnlyOnDemand: !formData.isOnlyOnDemand })}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        On-Demand Only
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Only submit when explicitly requested by HR or portal (e.g. Exam results)
                      </div>
                    </div>
                    <div className={`toggle-switch ${formData.isOnlyOnDemand ? 'checked' : ''}`}>
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div
                    style={{
                      marginTop: 'var(--space-md)',
                      padding: '10px 14px',
                      background: 'var(--accent-red-dim)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--accent-red)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingDoc(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner" style={{ width: 14, height: 14 }} />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL (ADMIN ONLY)                    */}
      {/* ========================================================= */}
      {deletingDoc && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setDeletingDoc(null)}>
          <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--accent-red)' }}>
                <ShieldAlert size={20} />
                Delete Document
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeletingDoc(null)}
                disabled={isSubmitting}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>&quot;{deletingDoc.title}&quot;</strong>?
              </p>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  fontSize: '0.8rem',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}
              >
                File: {deletingDoc.filename} ({deletingDoc.fileSize})
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
                ⚠️ This will remove the file from storage and delete the record permanently.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDeletingDoc(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner" style={{ width: 14, height: 14 }} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
