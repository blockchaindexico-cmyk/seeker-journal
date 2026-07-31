import { useState } from "react";
import { Copy, Loader2, Mail, MessageCircle, Linkedin, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateOutreach } from "@/lib/ai.functions";
import type { Job } from "@/lib/jobs";
import { cn } from "@/lib/utils";

type Channel = "email" | "linkedin" | "whatsapp";

const CHANNELS: { id: Channel; label: string; icon: typeof Mail }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export function AiComposer({
  job,
  jd,
  onJdChange,
}: {
  job: Job;
  jd: string;
  onJdChange: (v: string) => void;
}) {
  const [channel, setChannel] = useState<Channel>("email");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!jd.trim()) {
      toast.error("Paste the job description first");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await generateOutreach({
        data: {
          channel,
          jobDescription: jd,
          company: job.company,
          role: job.role,
          hrName: job.hrName,
          tone: "warm, confident, concise",
        },
      });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't generate the message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Job description</Label>
        <Textarea
          rows={6}
          value={jd}
          placeholder="Paste the job post here — the AI writes the outreach from it."
          onChange={(e) => onJdChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CHANNELS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setChannel(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              channel === id
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40",
            )}
          >
            <Icon className="size-3.5" /> {label}
          </button>
        ))}
        <Button size="sm" className="ml-auto" onClick={run} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 size-4" />
          )}
          Generate
        </Button>
      </div>

      {output && (
        <div className="panel space-y-3 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">{output}</pre>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied");
              }}
            >
              <Copy className="mr-1.5 size-3.5" /> Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={run} disabled={loading}>
              Regenerate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
