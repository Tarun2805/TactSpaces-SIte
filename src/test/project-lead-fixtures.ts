import type { ProjectLeadSubmission } from '../types/project-lead';

export const PROJECT_LEAD_FIXTURE: ProjectLeadSubmission = {
  requestId: '4e717440-f18e-4b9a-99d9-d22c909634a9',
  startedAt: Date.now() - 10_000,
  website: '',
  name: 'Test Client', phone: '+91 98765 43210', email: 'client@example.com',
  location: 'Indiranagar, Bengaluru', typology: 'Villa', typologyOther: '',
  scope: 'Turnkey Execution', timeline: '1–3 months', budget: 25,
};

export const PROJECT_LEAD_TEST_ENDPOINT = 'https://script.google.com/macros/s/test-deployment/exec';
