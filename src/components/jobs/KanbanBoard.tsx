import { useState } from "react";
import { JobCard } from "./JobCard";
import { STATUSES, STATUS_LABEL, type Job, type JobStatus } from "@/lib/jobs";
import { cn } from "@/lib/utils";

export function KanbanBoard({
  jobs,
  onOpen,
  onMove,
}: {
  jobs: Job[];
  onOpen: (job: Job) => void;
  onMove: (job: Job, status: JobStatus) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<JobStatus | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {STATUSES.map((status) => {
        const column = jobs.filter((j) => j.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(status);
            }}
            onDragLeave={() => setOver((s) => (s === status ? null : s))}
            onDrop={() => {
              const job = jobs.find((j) => j.id === dragId);
              if (job && job.status !== status) onMove(job, status);
              setDragId(null);
              setOver(null);
            }}
            className={cn(
              "flex min-h-[160px] flex-col gap-3 rounded-xl border border-border/70 bg-card/30 p-3 transition-colors",
              over === status && "border-primary/50 bg-primary/5",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
                {STATUS_LABEL[status]}
              </span>
              <span className="text-[11px] text-muted-foreground">{column.length}</span>
            </div>
            {column.map((job) => (
              <div key={job.id} draggable onDragStart={() => setDragId(job.id)}>
                <JobCard job={job} onClick={() => onOpen(job)} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
