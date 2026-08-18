'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  BarChart3,
  Sparkles,
  Menu,
  X,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAdmin } from '@/lib/admin';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/applications', label: 'Applications', icon: Briefcase, adminOnly: false },
  { href: '/applications/new', label: 'Add New', icon: PlusCircle, adminOnly: true },
  { href: '/documents', label: 'Documents', icon: FileText, adminOnly: false },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, adminOnly: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [appCount, setAppCount] = useState(0);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAppCount(data.length);
      })
      .catch(() => {});
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <h1>JobTracker</h1>
            <span>by Thaveesha</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.href === '/applications' && appCount > 0 && (
                <span className="sidebar-badge">{appCount}</span>
              )}
            </Link>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-md)', marginTop: 'auto' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Ready to start immediately
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            🇱🇰 Colombo, Sri Lanka
          </div>
          <Link
            href="/admin"
            className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
            style={{ marginTop: 'var(--space-sm)', fontSize: '0.8rem', opacity: 0.6 }}
          >
            {isAdmin ? <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} /> : <Shield size={16} />}
            <span>{isAdmin ? 'Admin ✓' : 'Admin'}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

