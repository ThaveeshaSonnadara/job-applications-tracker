'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  HelpCircle,
  Building2,
  Cpu,
  UserCheck,
} from 'lucide-react';
import { Application, InterviewQuestion } from '@/types';

export default function InterviewPrepPage() {
  const params = useParams();
  const [app, setApp] = useState<Application | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('ALL');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchApp = () => {
    fetch(`/api/applications/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setApp(data);
        if (data.interviewQuestions) {
          setQuestions(data.interviewQuestions);
          // Expand first 3 by default
          const initialExpanded: Record<string, boolean> = {};
          data.interviewQuestions.slice(0, 3).forEach((q: InterviewQuestion) => {
            initialExpanded[q.id] = true;
          });
          setExpandedIds(initialExpanded);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchApp();
  }, [params.id]);

  const handleGenerate = async () => {
    if (!app) return;
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: app.id,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setQuestions((prev) => [...data, ...prev]);
        const newExpanded = { ...expandedIds };
        data.slice(0, 3).forEach((q: InterviewQuestion) => {
          newExpanded[q.id] = true;
        });
        setExpandedIds(newExpanded);
      }
    } catch (err) {
      setError('Failed to generate interview prep. Check your OpenRouter API key.');
    }
    setGenerating(false);
  };

  const togglePractice = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isPracticed: !currentStatus } : q))
    );

    try {
      await fetch(`/api/interview/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPracticed: !currentStatus }),
      });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!app) return null;

  const filteredQuestions = questions.filter((q) => {
    if (activeCategory !== 'ALL' && q.category !== activeCategory) return false;
    if (activeDifficulty !== 'ALL' && q.difficulty !== activeDifficulty) return false;
    return true;
  });

  const practicedCount = questions.filter((q) => q.isPracticed).length;
  const progressPercent = questions.length > 0 ? Math.round((practicedCount / questions.length) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <Link href={`/applications/${app.id}`} className="back-link">
        <ArrowLeft size={16} /> Back to {app.companyName}
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">Interview Preparation</h1>
          <p className="page-subtitle">
            Tailored technical & behavioral interview questions for {app.companyName} ({app.jobTitle})
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={generating}
          style={{
            opacity: generating ? 0.5 : 1,
            boxShadow: generating ? 'none' : undefined,
            cursor: generating ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {generating ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Generating Prep...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {questions.length > 0 ? 'Generate More Questions' : 'Generate Interview Prep'}
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 'var(--space-md)',
            background: 'var(--accent-red-dim)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-red)',
            fontSize: '0.85rem',
            marginBottom: 'var(--space-lg)',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Progress & Stats Card */}
      {questions.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <span style={{ fontSize: 'var(--text-sm-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
              Interview Readiness Progress
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--accent-purple)' }}>
              {practicedCount} of {questions.length} Practiced ({progressPercent}%)
            </span>
          </div>
          <div className="pipeline-bar" style={{ height: '10px', marginBottom: 'var(--space-md)' }}>
            <div
              className="pipeline-segment"
              style={{
                width: `${progressPercent}%`,
                background: 'var(--accent-green)',
                transition: 'transform 0.4s ease',
              }}
            />
          </div>

          {/* Quick Category Summary */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', fontSize: 'var(--text-sm-2)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              🛠️ Technical: <strong>{questions.filter((q) => q.category === 'TECHNICAL').length}</strong>
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              🧠 Behavioral: <strong>{questions.filter((q) => q.category === 'BEHAVIORAL').length}</strong>
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              🏢 Company-Specific: <strong>{questions.filter((q) => q.category === 'COMPANY_SPECIFIC').length}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {questions.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <div className="filter-tabs" style={{ marginBottom: 0 }}>
            <button
              className={`filter-tab ${activeCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveCategory('ALL')}
            >
              All Categories ({questions.length})
            </button>
            <button
              className={`filter-tab ${activeCategory === 'TECHNICAL' ? 'active' : ''}`}
              onClick={() => setActiveCategory('TECHNICAL')}
            >
              🛠️ Technical ({questions.filter((q) => q.category === 'TECHNICAL').length})
            </button>
            <button
              className={`filter-tab ${activeCategory === 'BEHAVIORAL' ? 'active' : ''}`}
              onClick={() => setActiveCategory('BEHAVIORAL')}
            >
              🧠 Behavioral ({questions.filter((q) => q.category === 'BEHAVIORAL').length})
            </button>
            <button
              className={`filter-tab ${activeCategory === 'COMPANY_SPECIFIC' ? 'active' : ''}`}
              onClick={() => setActiveCategory('COMPANY_SPECIFIC')}
            >
              🏢 Company-Specific ({questions.filter((q) => q.category === 'COMPANY_SPECIFIC').length})
            </button>
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>DIFFICULTY:</span>
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                className={`filter-tab ${activeDifficulty === diff ? 'active' : ''}`}
                onClick={() => setActiveDifficulty(diff)}
                style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question List */}
      {questions.length === 0 && !generating ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <BookOpen size={48} />
          </div>
          <h3>No interview questions generated yet</h3>
          <p>
            Generate targeted interview questions covering technical concepts for{' '}
            {app.requiredTechnologies || 'this role'}, company-specific questions for {app.companyName}, and common behavioral queries.
          </p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            <Sparkles size={18} /> Generate Interview Prep
          </button>
        </div>
      ) : (
        <div>
          {filteredQuestions.map((q, i) => {
            const isExpanded = expandedIds[q.id];
            return (
              <div
                key={q.id}
                className={`interview-card animate-fade-in-up ${q.isPracticed ? 'practiced' : ''}`}
                style={{ marginBottom: 'var(--space-md)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', flex: 1 }}>
                    <button
                      onClick={() => togglePractice(q.id, q.isPracticed)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: q.isPracticed ? 'var(--accent-green)' : 'var(--text-muted)',
                        padding: 0,
                        marginTop: '2px',
                      }}
                      title={q.isPracticed ? 'Mark as not practiced' : 'Mark as practiced'}
                    >
                      {q.isPracticed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-xs)', flexWrap: 'wrap' }}>
                        <span className={`interview-category category-${q.category}`}>
                          {q.category === 'TECHNICAL' && '🛠️ Technical'}
                          {q.category === 'BEHAVIORAL' && '🧠 Behavioral'}
                          {q.category === 'COMPANY_SPECIFIC' && '🏢 Company-Specific'}
                        </span>
                        <span className={`interview-difficulty difficulty-${q.difficulty}`}>
                          {q.difficulty}
                        </span>
                        {q.isPracticed && (
                          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--accent-green)', fontWeight: 600 }}>
                            ✓ Practiced
                          </span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          lineHeight: 1.5,
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleExpand(q.id)}
                      >
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => copyToClipboard(`${q.question}\n\nSuggested Talking Points:\n${q.suggestedAnswer || ''}`, q.id)}
                      title="Copy Question & Answer"
                    >
                      {copiedId === q.id ? <Check size={16} className="copy-success" /> : <Copy size={16} />}
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => toggleExpand(q.id)}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expandable Suggested Answer */}
                {isExpanded && q.suggestedAnswer && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: 'var(--space-md)',
                      padding: 'var(--space-md)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '2px solid var(--accent-purple)',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Suggested Talking Points (as Thaveesha)
                    </div>
                    <div style={{ fontSize: 'var(--text-sm-2)', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {q.suggestedAnswer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Generating Indicator */}
      {generating && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)', marginTop: 'var(--space-lg)' }}>
          <div className="loading-dots" style={{ marginBottom: 'var(--space-md)', justifyContent: 'center', display: 'flex' }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Analyzing job requirements and preparing tailored interview questions for {app.companyName}...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
            Generating technical, behavioral, and company-specific talking points
          </p>
        </div>
      )}
    </div>
  );
}
