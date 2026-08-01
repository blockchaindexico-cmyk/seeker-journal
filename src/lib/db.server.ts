import { neon } from "@neondatabase/serverless";

let schemaReady: Promise<void> | undefined;

export function getSql() {
  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured. Add your Neon connection string to continue.",
    );
  }
  return neon(url);
}

export async function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id uuid PRIMARY KEY,
          company text NOT NULL DEFAULT '',
          role text NOT NULL DEFAULT '',
          location text NOT NULL DEFAULT '',
          salary text NOT NULL DEFAULT '',
          status text NOT NULL DEFAULT 'saved',
          applied_via text NOT NULL DEFAULT '',
          applied_at text NOT NULL DEFAULT '',
          website_url text NOT NULL DEFAULT '',
          linkedin_url text NOT NULL DEFAULT '',
          job_post_url text NOT NULL DEFAULT '',
          extra_links text NOT NULL DEFAULT '',
          hr_name text NOT NULL DEFAULT '',
          hr_email text NOT NULL DEFAULT '',
          hr_linkedin text NOT NULL DEFAULT '',
          is_hr_contact boolean NOT NULL DEFAULT false,
          responded boolean NOT NULL DEFAULT false,
          called boolean NOT NULL DEFAULT false,
          interview_at text NOT NULL DEFAULT '',
          follow_up_at text NOT NULL DEFAULT '',
          job_description text NOT NULL DEFAULT '',
          notes text NOT NULL DEFAULT '',
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;
      await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_extra text NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS gen_email text NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS gen_linkedin text NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS gen_whatsapp text NOT NULL DEFAULT ''`;
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

type Row = Record<string, unknown>;

export function rowToJob(r: Row) {
  return {
    id: String(r["id"]),
    company: (r["company"] as string) ?? "",
    role: (r["role"] as string) ?? "",
    location: (r["location"] as string) ?? "",
    salary: (r["salary"] as string) ?? "",
    status: (r["status"] as string) ?? "saved",
    appliedVia: (r["applied_via"] as string) ?? "",
    appliedAt: (r["applied_at"] as string) ?? "",
    websiteUrl: (r["website_url"] as string) ?? "",
    linkedinUrl: (r["linkedin_url"] as string) ?? "",
    jobPostUrl: (r["job_post_url"] as string) ?? "",
    extraLinks: (r["extra_links"] as string) ?? "",
    hrName: (r["hr_name"] as string) ?? "",
    hrEmail: (r["hr_email"] as string) ?? "",
    hrLinkedin: (r["hr_linkedin"] as string) ?? "",
    isHrContact: Boolean(r["is_hr_contact"]),
    responded: Boolean(r["responded"]),
    called: Boolean(r["called"]),
    interviewAt: (r["interview_at"] as string) ?? "",
    followUpAt: (r["follow_up_at"] as string) ?? "",
    jobDescription: (r["job_description"] as string) ?? "",
    notes: (r["notes"] as string) ?? "",
    aiExtra: (r["ai_extra"] as string) ?? "",
    genEmail: (r["gen_email"] as string) ?? "",
    genLinkedin: (r["gen_linkedin"] as string) ?? "",
    genWhatsapp: (r["gen_whatsapp"] as string) ?? "",
    createdAt: new Date(r["created_at"] as string).toISOString(),
  };
}
