import { ApplicationStatus } from '@/types';

export function formatDate(date: string | Date | null): string {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function getStatusOrder(status: ApplicationStatus): number {
  const order: Record<ApplicationStatus, number> = {
    SAVED: 0,
    APPLIED: 1,
    INTERVIEW_CALLED: 2,
    PHONE_CALL: 3,
    EMAIL_RESPONSE: 4,
    OFFERED: 5,
    REJECTED: 6,
    WITHDRAWN: 7,
  };
  return order[status] ?? 0;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
