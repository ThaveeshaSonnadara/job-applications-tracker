import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AdminProvider } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'JobTracker — Thaveesha\'s Job Application Tracker',
  description: 'AI-powered job application tracker with intelligent form filling, interview preparation, and document management for Software Engineering positions in Sri Lanka.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}

