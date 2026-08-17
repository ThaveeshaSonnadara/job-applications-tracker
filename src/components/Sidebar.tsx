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
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/applications', label: 'Applications', icon: Briefcase },
  { href: '/applications/new', label: 'Add New', icon: PlusCircle },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [appCount, setAppCount] = useState(0);

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
          {navItems.map((item) => (
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
        </div>
      </nav>
    </>
  );
}
