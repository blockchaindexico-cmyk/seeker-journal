export const STATUSES = [
  "saved",
  "applied",
  "responded",
  "interview",
  "offer",
  "rejected",
] as const;

export type JobStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<JobStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  responded: "Responded",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const STATUS_TONE: Record<JobStatus, string> = {
  saved: "border-border text-muted-foreground",
  applied: "border-primary/40 text-primary",
  responded: "border-chart-2/50 text-chart-2",
  interview: "border-chart-4/50 text-chart-4",
  offer: "border-chart-2/60 text-chart-2",
  rejected: "border-destructive/50 text-destructive",
};

export const PLATFORMS = [
  "Company site",
  "LinkedIn",
  "Indeed",
  "Naukri",
  "Wellfound",
  "Referral",
  "Email",
  "Other",
] as const;

export type Job = {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  status: JobStatus;
  appliedVia: string;
  appliedAt: string;
  websiteUrl: string;
  linkedinUrl: string;
  jobPostUrl: string;
  extraLinks: string;
  hrName: string;
  hrEmail: string;
  hrLinkedin: string;
  isHrContact: boolean;
  responded: boolean;
  called: boolean;
  interviewAt: string;
  followUpAt: string;
  jobDescription: string;
  notes: string;
  aiExtra: string;
  genEmail: string;
  genLinkedin: string;
  genWhatsapp: string;
  createdAt: string;
};

export function emptyJob(): Job {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "saved",
    appliedVia: "",
    appliedAt: "",
    websiteUrl: "",
    linkedinUrl: "",
    jobPostUrl: "",
    extraLinks: "",
    hrName: "",
    hrEmail: "",
    hrLinkedin: "",
    isHrContact: false,
    responded: false,
    called: false,
    interviewAt: "",
    followUpAt: "",
    jobDescription: "",
    notes: "",
    aiExtra: "",
    genEmail: "",
    genLinkedin: "",
    genWhatsapp: "",
    createdAt: new Date().toISOString(),
  };
}
