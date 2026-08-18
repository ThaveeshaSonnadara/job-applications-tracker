'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { Application, GeneratedAnswer } from '@/types';
import { useAdmin } from '@/lib/admin';

export default function AIAnswersPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAdmin();
  const [app, setApp] = useState<Application | null>(null);
  const [answers, setAnswers] = useState<GeneratedAnswer[]>([]);
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push(`/applications/${params.id}`);
    }
  }, [authLoading, isAdmin, params.id, router]);

  useEffect(() => {
    if (authLoading || !isAdmin) return;

    fetch(`/api/applications/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setApp(data);
        if (data.generatedAnswers) setAnswers(data.generatedAnswers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, authLoading, isAdmin]);

  const handleGenerate = async () => {
    if (!questions.trim() || !app) return;
    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/ai/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: app.id,
          questions: questions.trim(),
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnswers(prev => [...data, ...prev]);
        setQuestions('');
      }
    } catch (err) {
      setError('Failed to generate answers. Check your OpenRouter API key.');
    }
    setGenerating(false);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
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

  const copyAllAnswers = () => {
    const allText = answers.map(a => `Q: ${a.question}\n\nA: ${a.answer}`).join('\n\n---\n\n');
    copyToClipboard(allText, 'all');
  };

  if (authLoading || !isAdmin || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="animate-fade-in">
      <Link href={`/applications/${app.id}`} className="back-link">
        <ArrowLeft size={16} /> Back to {app.companyName}
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">AI Answer Generator</h1>
          <p className="page-subtitle">
            Generate personalized answers for {app.companyName} — {app.jobTitle}
          </p>
        </div>
      </div>

      {/* Question Input */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
          Paste Application Questions
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
          Paste the questions from the application form below. The AI will generate natural, personalized answers using your profile, the job description, and company context.
        </p>

        <textarea
          className="form-textarea"
          placeholder={`Paste your application questions here, for example:\n\n1. Why are you interested in this role?\n2. What relevant experience do you have?\n3. What are your salary expectations?\n4. When can you start?`}
          value={questions}
          onChange={e => setQuestions(e.target.value)}
          rows={8}
          style={{ marginBottom: 'var(--space-md)' }}
        />

        {error && (
          <div style={{
            padding: 'var(--space-md)',
            background: 'var(--accent-red-dim)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-red)',
            fontSize: '0.85rem',
            marginBottom: 'var(--space-md)',
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={generating || !questions.trim()}
            style={{
              opacity: generating || !questions.trim() ? 0.5 : 1,
              boxShadow: generating || !questions.trim() ? 'none' : undefined,
              cursor: generating || !questions.trim() ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {generating ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Answers
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Answers */}
      {answers.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Generated Answers ({answers.length})
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={copyAllAnswers}>
              {copiedId === 'all' ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === 'all' ? 'Copied All!' : 'Copy All'}
            </button>
          </div>

          {answers.map((answer, i) => (
            <div key={answer.id} className={`answer-card animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
              <div className="answer-question">
                Q{i + 1}: {answer.question}
              </div>
              <div className="answer-text">{answer.answer}</div>
              <div className="answer-actions">
                <button
                  className={`btn btn-sm ${copiedId === answer.id ? 'btn-primary copy-success' : 'btn-secondary'}`}
                  onClick={() => copyToClipboard(answer.answer, answer.id)}
                >
                  {copiedId === answer.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === answer.id ? 'Copied!' : 'Copy Answer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generating Animation */}
      {generating && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <div className="loading-dots" style={{ marginBottom: 'var(--space-md)', justifyContent: 'center', display: 'flex' }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Crafting personalized answers for {app.companyName}...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
            This may take 15-30 seconds
          </p>
        </div>
      )}
    </div>
  );
}
