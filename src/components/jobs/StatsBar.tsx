import type { Job } from "@/lib/jobs";

export function StatsBar({ jobs }: { jobs: Job[] }) {
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status !== "saved").length;
  const responded = jobs.filter((j) => j.responded || ["responded", "interview", "offer"].includes(j.status)).length;
  const interviews = jobs.filter((j) => j.status === "interview" || j.interviewAt).length;
  const rate = applied ? Math.round((responded / applied) * 100) : 0;

  const items = [
    { label: "Tracked", value: total },
    { label: "Applied", value: applied },
    { label: "Responses", value: responded },
    { label: "Interviews", value: interviews },
    { label: "Response rate", value: `${rate}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((s) => (
        <div key={s.label} className="panel px-4 py-4">
          <p className="display-title text-3xl text-foreground">{s.value}</p>
          <p className="mt-1 text-[11px] tracking-widest text-muted-foreground uppercase">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
