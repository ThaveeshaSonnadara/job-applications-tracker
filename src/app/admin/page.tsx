'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, LogIn, LogOut, ArrowLeft, Shield, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, loading, login, logout } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setSubmitting(true);
    setError('');

    const success = await login(password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid password. Access denied.');
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  // Already logged in — show status
  if (isAdmin) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: 'var(--space-3xl)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-green-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
          }}>
            <ShieldCheck size={32} style={{ color: 'var(--accent-green)' }} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
            Admin Access Active
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
            You're logged in as admin. All admin features are visible.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-secondary">
              <ArrowLeft size={16} /> Go to Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: 'var(--space-3xl)' }}>
      <div className="card" style={{ padding: 'var(--space-3xl)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-purple-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-lg)',
        }}>
          <Shield size={32} style={{ color: 'var(--accent-purple)' }} />
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, textAlign: 'center', marginBottom: 'var(--space-xs)' }}>
          Admin Login
        </h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          Enter your admin password to unlock management features.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-md)',
              background: 'var(--accent-red-dim)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-red)',
              fontSize: '0.85rem',
              marginBottom: 'var(--space-lg)',
              textAlign: 'center',
            }}>
              🔒 {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting || !password.trim()}
            style={{
              width: '100%',
              opacity: submitting || !password.trim() ? 0.5 : 1,
              cursor: submitting || !password.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? (
              <>
                <div className="loading-spinner" style={{ width: 18, height: 18 }} />
                Verifying...
              </>
            ) : (
              <>
                <LogIn size={18} /> Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
