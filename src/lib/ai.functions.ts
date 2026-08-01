import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  channel: z.enum(["email", "linkedin", "whatsapp"]),
  jobDescription: z.string().min(1),
  company: z.string().default(""),
  role: z.string().default(""),
  hrName: z.string().default(""),
  extra: z.string().default(""),
  tone: z.string().default("warm, confident, concise"),
});

const GUIDE: Record<string, string> = {
  email:
    "Write a job application / follow-up EMAIL. Start with a 'Subject: ...' line, then the body. 120-170 words, short paragraphs, a clear ask for a conversation, and a sign-off placeholder [Your Name].",
  linkedin:
    "Write a LinkedIn connection/InMail message to the recruiter. Max 900 characters, no subject line, friendly and specific, one clear ask.",
  whatsapp:
    "Write a WhatsApp message to the recruiter. Max 90 words, casual but professional, short lines, at most one emoji, one clear ask.",
};

export const generateOutreach = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured for this project.");

    const { generateText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const result = await generateText({
      model: gateway("google/gemini-2.5-flash"),
      system:
        "You are an expert job-search coach. You write outreach messages that sound human, specific and never generic. Return only the message text — no commentary, no markdown fences.",
      prompt: [
        GUIDE[data.channel],
        "",
        `Company: ${data.company || "unknown"}`,
        `Role: ${data.role || "unknown"}`,
        `Recruiter name: ${data.hrName || "unknown — use a neutral greeting"}`,
        `Tone: ${data.tone}`,
        "",
        data.extra.trim()
          ? `Extra instructions from the candidate (follow these closely):\n${data.extra.slice(0, 2000)}`
          : "",
        "",
        "Job description / posting:",
        data.jobDescription.slice(0, 8000),
      ].join("\n"),
    });

    return { text: result.text.trim() };
  });
