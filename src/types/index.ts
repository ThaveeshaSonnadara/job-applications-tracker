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
  SAVED: { label: 'Saved', color: '#475569', bgColor: '#F1F5F9', icon: '📋' },
  APPLIED: { label: 'Applied', color: '#0069A4', bgColor: '#EAF1F8', icon: '📨' },
  INTERVIEW_CALLED: { label: 'Interview Called', color: '#1281C3', bgColor: '#D8EBFB', icon: '🎯' },
  PHONE_CALL: { label: 'Phone Call', color: '#D97706', bgColor: '#FEF3C7', icon: '📞' },
  EMAIL_RESPONSE: { label: 'Email Response', color: '#0D9488', bgColor: '#CCFBF1', icon: '📧' },
  OFFERED: { label: 'Offered', color: '#16A34A', bgColor: '#DCFCE7', icon: '🎉' },
  REJECTED: { label: 'Rejected', color: '#DC2626', bgColor: '#FEE2E2', icon: '❌' },
  WITHDRAWN: { label: 'Withdrawn', color: '#64748B', bgColor: '#F1F5F9', icon: '🔙' },
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
