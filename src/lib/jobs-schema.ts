import { z } from "zod";

import { STATUSES } from "./jobs";

const str = z.string().default("");

export const jobSchema = z.object({
  id: z.string().uuid(),
  company: str,
  role: str,
  location: str,
  salary: str,
  status: z.enum(STATUSES),
  appliedVia: str,
  appliedAt: str,
  websiteUrl: str,
  linkedinUrl: str,
  jobPostUrl: str,
  extraLinks: str,
  hrName: str,
  hrEmail: str,
  hrLinkedin: str,
  isHrContact: z.boolean().default(false),
  responded: z.boolean().default(false),
  called: z.boolean().default(false),
  interviewAt: str,
  followUpAt: str,
  jobDescription: str,
  notes: str,
  aiExtra: str,
  genEmail: str,
  genLinkedin: str,
  genWhatsapp: str,
  createdAt: z.string(),
});
