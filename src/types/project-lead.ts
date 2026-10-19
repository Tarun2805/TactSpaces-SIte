export interface ProjectLeadDetails {
  name: string;
  phone: string;
  email: string;
  location: string;
  typology: string;
  typologyOther: string;
  scope: string;
  timeline: string;
  budget: number;
}

export interface ProjectLeadSubmission extends ProjectLeadDetails {
  requestId: string;
  startedAt: number;
  website: string;
}

export type ProjectLeadErrors = Partial<Record<keyof ProjectLeadDetails, string>>;
