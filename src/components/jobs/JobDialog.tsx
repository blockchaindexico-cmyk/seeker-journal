import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AiComposer } from "./AiComposer";
import { STATUSES, STATUS_LABEL, PLATFORMS, type Job } from "@/lib/jobs";
import { cn } from "@/lib/utils";

type Props = {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (job: Job) => void;
  onDelete: (id: string) => void;
};

export function JobDialog({ job, open, onOpenChange, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState<Job | null>(job);

  useEffect(() => setDraft(job), [job]);

  if (!draft) return null;
  const set = <K extends keyof Job>(key: K, value: Job[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const field = (label: string, key: keyof Job, placeholder = "") => (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={(draft[key] as string) ?? ""}
        placeholder={placeholder}
        onChange={(e) => set(key, e.target.value as Job[typeof key])}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="display-title text-2xl">
            {draft.company || "New application"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="links">Links & contact</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {field("Company", "company", "Netflix")}
              {field("Role", "role", "Product Designer")}
              {field("Location", "location", "Remote / Bengaluru")}
              {field("Salary", "salary", "₹18–24 LPA")}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Applied via</Label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("appliedVia", draft.appliedVia === p ? "" : p)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      draft.appliedVia === p
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea
                rows={5}
                value={draft.notes}
                placeholder="Anything worth remembering — referral name, recruiter chat, prep notes…"
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {field("Company website", "websiteUrl", "https://")}
              {field("Company LinkedIn", "linkedinUrl", "https://linkedin.com/company/…")}
              {field("Job post link", "jobPostUrl", "https://")}
              {field("Other links", "extraLinks", "Portal, assessment, docs…")}
              {field("Recruiter / HR name", "hrName")}
              {field("Recruiter email", "hrEmail")}
              {field("Recruiter LinkedIn", "hrLinkedin", "https://linkedin.com/in/…")}
            </div>
            <ToggleRow
              label="This contact is HR / recruiter"
              checked={draft.isHrContact}
              onChange={(v) => set("isHrContact", v)}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("status", s)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      draft.status === s
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <DateField label="Applied on" value={draft.appliedAt} onChange={(v) => set("appliedAt", v)} />
              <DateField label="Interview" value={draft.interviewAt} onChange={(v) => set("interviewAt", v)} />
              <DateField label="Follow-up" value={draft.followUpAt} onChange={(v) => set("followUpAt", v)} />
            </div>
            <ToggleRow label="They responded" checked={draft.responded} onChange={(v) => set("responded", v)} />
            <ToggleRow label="Call happened" checked={draft.called} onChange={(v) => set("called", v)} />
          </TabsContent>

          <TabsContent value="ai">
            <AiComposer
              job={draft}
              jd={draft.jobDescription}
              onJdChange={(v) => set("jobDescription", v)}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2 flex-row justify-between gap-2 sm:justify-between">
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              onDelete(draft.id);
              onOpenChange(false);
              toast("Application removed");
            }}
          >
            <Trash2 className="mr-1.5 size-4" /> Delete
          </Button>
          <Button
            onClick={() => {
              if (!draft.company.trim()) {
                toast.error("Add a company name first");
                return;
              }
              onSave(draft);
              onOpenChange(false);
              toast.success("Saved");
            }}
          >
            Save application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <span className="text-sm text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
