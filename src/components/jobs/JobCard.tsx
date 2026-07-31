import { Building2, Mail, Phone, Link2, CalendarClock } from "lucide-react";
import type { Job } from "@/lib/jobs";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/jobs";
import { cn } from "@/lib/utils";

export function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="panel group w-full cursor-pointer p-4 text-left transition-all hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {job.company || "Untitled company"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{job.role || "Role not set"}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase",
            STATUS_TONE[job.status],
          )}
        >
          {STATUS_LABEL[job.status]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        {job.appliedVia && (
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-3" /> {job.appliedVia}
          </span>
        )}
        {job.hrEmail && (
          <span className="inline-flex items-center gap-1">
            <Mail className="size-3" /> {job.hrName || job.hrEmail}
          </span>
        )}
        {job.called && (
          <span className="inline-flex items-center gap-1">
            <Phone className="size-3" /> Called
          </span>
        )}
        {(job.websiteUrl || job.linkedinUrl || job.jobPostUrl) && (
          <span className="inline-flex items-center gap-1">
            <Link2 className="size-3" /> Links
          </span>
        )}
        {job.followUpAt && (
          <span className="inline-flex items-center gap-1 text-primary">
            <CalendarClock className="size-3" /> {new Date(job.followUpAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </button>
  );
}
