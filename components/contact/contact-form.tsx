"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

/**
 * NOTE: this form has no backend. `handleSubmit` only flips local state, so
 * nothing is transmitted and no mailbox receives it. The confirmation below
 * says so plainly and points at the real address rather than claiming a
 * delivery that didn't happen. Wire `handleSubmit` to a real endpoint and the
 * copy can go back to a simple "Message sent".
 */
const CONTACT_EMAIL = "hello@tour-boda.ug";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  const handleReset = useCallback(() => {
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
  }, []);

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-hairline bg-card p-8"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15">
            <Check className="h-4 w-4 text-success" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-[0.02em]">
              Almost — one more step
            </h2>
            <p className="mt-2 max-w-[52ch] font-sans text-sm leading-relaxed text-muted-foreground">
              This form isn&rsquo;t connected to a mailbox yet, so your message
              hasn&rsquo;t reached us. Email the same details to{" "}
              <span className="font-mono text-foreground">{CONTACT_EMAIL}</span>{" "}
              and we&rsquo;ll reply within a day.
            </p>
            {form.name || form.message ? (
              <p className="mt-3 max-w-[52ch] font-sans text-xs text-muted-foreground">
                To save retyping, your message is still below — copy it across.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleReset}>
            Back to the form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="contact-name" className="telemetry text-muted-foreground">
          Name
        </Label>
        <Input
          id="contact-name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email" className="telemetry text-muted-foreground">
          Email
        </Label>
        <Input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message" className="telemetry text-muted-foreground">
          Message
        </Label>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Where you want to go, when, and how many people."
          aria-describedby="contact-message-hint"
          required
          className="min-h-[160px]"
        />
        <p
          id="contact-message-hint"
          className="font-sans text-xs text-muted-foreground"
        >
          Route, dates and group size help us answer in one reply.
        </p>
      </div>

      <Button type="submit" size="lg">
        Send message
      </Button>
    </form>
  );
}
