export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEW_CALLED'
  | 'PHONE_CALL'
  | 'EMAIL_RESPONSE'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type ApplicationSource =
  | 'LINKEDIN'
  | 'TOPJOBS'
  | 'DIRECT_EMAIL'
  | 'COMPANY_WEBSITE'
  | 'ROOSTER_JOBS'
  | 'OTHER';

export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';

export type QuestionCategory = 'TECHNICAL' | 'BEHAVIORAL' | 'COMPANY_SPECIFIC';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  jobDescription: string | null;
  companyBackground: string | null;
  applicationSource: ApplicationSource;
  status: ApplicationStatus;
  applicationDate: string | null;
  responseDate: string | null;
  salary: string | null;
  location: string | null;
  workMode: WorkMode;
  notes: string | null;
  requiredTechnologies: string;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  documentsAttached: string;
  createdAt: string;
  updatedAt: string;
  generatedAnswers?: GeneratedAnswer[];
  interviewQuestions?: InterviewQuestion[];
}

export interface GeneratedAnswer {
  id: string;
  applicationId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  applicationId: string;
  question: string;
  suggestedAnswer: string | null;
  category: QuestionCategory;
  difficulty: Difficulty;
  isPracticed: boolean;
  createdAt: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  SAVED: { label: 'Saved', color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.15)', icon: '📋' },
  APPLIED: { label: 'Applied', color: '#60a5fa', bgColor: 'rgba(96, 165, 250, 0.15)', icon: '📨' },
  INTERVIEW_CALLED: { label: 'Interview Called', color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', icon: '🎯' },
  PHONE_CALL: { label: 'Phone Call', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.15)', icon: '📞' },
  EMAIL_RESPONSE: { label: 'Email Response', color: '#2dd4bf', bgColor: 'rgba(45, 212, 191, 0.15)', icon: '📧' },
  OFFERED: { label: 'Offered', color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.15)', icon: '🎉' },
  REJECTED: { label: 'Rejected', color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.15)', icon: '❌' },
  WITHDRAWN: { label: 'Withdrawn', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.15)', icon: '🔙' },
};

export const SOURCE_CONFIG: Record<ApplicationSource, { label: string; icon: string }> = {
  LINKEDIN: { label: 'LinkedIn', icon: '💼' },
  TOPJOBS: { label: 'TopJobs.lk', icon: '🔍' },
  DIRECT_EMAIL: { label: 'Direct Email', icon: '✉️' },
  COMPANY_WEBSITE: { label: 'Company Website', icon: '🌐' },
  ROOSTER_JOBS: { label: 'Rooster.Jobs', icon: '🐓' },
  OTHER: { label: 'Other', icon: '📌' },
};

export const ALL_STATUSES: ApplicationStatus[] = [
  'SAVED', 'APPLIED', 'INTERVIEW_CALLED', 'PHONE_CALL',
  'EMAIL_RESPONSE', 'OFFERED', 'REJECTED', 'WITHDRAWN'
];

export const ALL_SOURCES: ApplicationSource[] = [
  'LINKEDIN', 'TOPJOBS', 'DIRECT_EMAIL', 'COMPANY_WEBSITE', 'ROOSTER_JOBS', 'OTHER'
];

export const ALL_WORK_MODES: WorkMode[] = ['ONSITE', 'REMOTE', 'HYBRID'];
