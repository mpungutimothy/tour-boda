"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleCheck as CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    },
    []
  );

  const handleReset = useCallback(() => {
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
  }, []);

  if (submitted) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-8">
        <div className="mb-4 flex items-center gap-3">
          <CheckCircle2 className="h-7 w-7 shrink-0 text-success" />
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">Message sent</h2>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Thank you, {form.name || "friend"}. We will get back to you at{" "}
              {form.email || "your email"} within a day.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleReset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Tell us where you want to go, when, and how many people."
          required
          className="min-h-[160px]"
        />
      </div>

      <Button type="submit" size="lg">
        Send Message
      </Button>
    </form>
  );
}
