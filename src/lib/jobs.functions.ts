import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { jobSchema } from "./jobs-schema";

export const listJobs = createServerFn({ method: "GET" }).handler(async () => {
  const { ensureSchema, getSql, rowToJob } = await import("./db.server");
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM jobs ORDER BY created_at DESC`;
  return rows.map(rowToJob);
});

export const saveJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => jobSchema.parse(input))
  .handler(async ({ data: j }) => {
    const { ensureSchema, getSql, rowToJob } = await import("./db.server");
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      INSERT INTO jobs (
        id, company, role, location, salary, status, applied_via, applied_at,
        website_url, linkedin_url, job_post_url, extra_links,
        hr_name, hr_email, hr_linkedin, is_hr_contact,
        responded, called, interview_at, follow_up_at, job_description, notes, created_at
      ) VALUES (
        ${j.id}, ${j.company}, ${j.role}, ${j.location}, ${j.salary}, ${j.status},
        ${j.appliedVia}, ${j.appliedAt}, ${j.websiteUrl}, ${j.linkedinUrl},
        ${j.jobPostUrl}, ${j.extraLinks}, ${j.hrName}, ${j.hrEmail}, ${j.hrLinkedin},
        ${j.isHrContact}, ${j.responded}, ${j.called}, ${j.interviewAt},
        ${j.followUpAt}, ${j.jobDescription}, ${j.notes}, ${j.createdAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        company = EXCLUDED.company,
        role = EXCLUDED.role,
        location = EXCLUDED.location,
        salary = EXCLUDED.salary,
        status = EXCLUDED.status,
        applied_via = EXCLUDED.applied_via,
        applied_at = EXCLUDED.applied_at,
        website_url = EXCLUDED.website_url,
        linkedin_url = EXCLUDED.linkedin_url,
        job_post_url = EXCLUDED.job_post_url,
        extra_links = EXCLUDED.extra_links,
        hr_name = EXCLUDED.hr_name,
        hr_email = EXCLUDED.hr_email,
        hr_linkedin = EXCLUDED.hr_linkedin,
        is_hr_contact = EXCLUDED.is_hr_contact,
        responded = EXCLUDED.responded,
        called = EXCLUDED.called,
        interview_at = EXCLUDED.interview_at,
        follow_up_at = EXCLUDED.follow_up_at,
        job_description = EXCLUDED.job_description,
        notes = EXCLUDED.notes
      RETURNING *
    `;
    return rowToJob(rows[0] as Record<string, unknown>);
  });

export const deleteJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { ensureSchema, getSql } = await import("./db.server");
    await ensureSchema();
    const sql = getSql();
    await sql`DELETE FROM jobs WHERE id = ${data.id}`;
    return { ok: true };
  });
