import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Plus, Search, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDialog } from "@/components/jobs/JobDialog";
import { KanbanBoard } from "@/components/jobs/KanbanBoard";
import { StatsBar } from "@/components/jobs/StatsBar";
import { useJobs } from "@/lib/use-jobs";
import { emptyJob, STATUSES, STATUS_LABEL, type Job, type JobStatus } from "@/lib/jobs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trackr — Job Application Tracker" },
      {
        name: "description",
        content:
          "Track every job application in one cinematic workspace: links, platforms, recruiter contacts, follow-ups, interviews and AI-assisted notes.",
      },
      { property: "og:title", content: "Trackr — Job Application Tracker" },
      {
        property: "og:description",
        content:
          "Track every job application in one cinematic workspace: links, platforms, recruiter contacts, follow-ups, interviews and AI-assisted notes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { jobs, ready, upsert, remove } = useJobs();
  const [view, setView] = useState<"board" | "list">("board");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [active, setActive] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (filter === "all" || j.status === filter) &&
        (!q ||
          [j.company, j.role, j.location, j.notes, j.hrName, j.appliedVia]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
  }, [jobs, query, filter]);

  const upcoming = jobs
    .filter((j) => j.followUpAt && new Date(j.followUpAt).getTime() >= Date.now() - 86400000)
    .sort((a, b) => a.followUpAt.localeCompare(b.followUpAt))
    .slice(0, 4);

  const openJob = (job: Job) => {
    setActive(job);
    setOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="cinema-glow border-b border-border">
        <header className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 py-12">
          <div>
            <p className="display-title text-2xl tracking-[0.28em] text-primary sm:text-3xl">
              Trackr
            </p>
            <h1 className="display-title mt-3 text-5xl text-foreground sm:text-7xl">
              Your job hunt, finally in order.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Every company, every link, every recruiter and every follow-up — stored in one place
              you'll actually enjoy opening.
            </p>
          </div>
          <Button size="lg" onClick={() => openJob(emptyJob())}>
            <Plus className="mr-1.5 size-4" /> New application
          </Button>
        </header>
      </div>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <StatsBar jobs={jobs} />

        {upcoming.length > 0 && (
          <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="inline-flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
              <CalendarClock className="size-3.5" /> Follow-ups
            </span>
            {upcoming.map((j) => (
              <button
                key={j.id}
                onClick={() => openJob(j)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
              >
                {j.company} · {new Date(j.followUpAt).toLocaleDateString()}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, roles, recruiters…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  filter === s
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                {s === "all" ? "All" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() => setView("board")}
              className={cn("px-3 py-2", view === "board" ? "bg-secondary" : "text-muted-foreground")}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("px-3 py-2", view === "list" ? "bg-secondary" : "text-muted-foreground")}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        {ready && jobs.length === 0 ? (
          <div className="panel flex flex-col items-center gap-4 px-6 py-20 text-center">
            <h2 className="display-title text-3xl">Nothing tracked yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your first company — paste the job post and let AI fill in the details for you.
            </p>
            <Button onClick={() => openJob(emptyJob())}>
              <Plus className="mr-1.5 size-4" /> Add your first application
            </Button>
          </div>
        ) : view === "board" ? (
          <KanbanBoard
            jobs={filtered}
            onOpen={openJob}
            onMove={(job, status) => upsert({ ...job, status })}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => openJob(job)} />
            ))}
          </div>
        )}
      </section>

      <JobDialog
        job={active}
        open={open}
        onOpenChange={setOpen}
        onSave={upsert}
        onDelete={remove}
      />
    </main>
  );
}
