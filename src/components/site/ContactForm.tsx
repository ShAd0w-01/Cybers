import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { submitLead } from "@/lib/crm.functions";
import { pillars } from "@/content/site";
import { BookingPicker, formatBooking, type Booking } from "./BookingPicker";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70";

export function ContactForm() {
  const send = useServerFn(submitLead);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_interest: "",
    message: "",
  });

  const [booking, setBooking] = useState<Booking>(null);
  const bookingConfirmed = Boolean(booking?.date && booking.time);

  const mutation = useMutation({
    mutationFn: () =>
      send({
        data: {
          ...form,
          message: bookingConfirmed
            ? `${form.message}\n\nRequested consultation slot: ${formatBooking(booking)}`
            : form.message,
          source: bookingConfirmed ? "website-contact-form-booking" : "website-contact-form",
        },
      }),
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  if (mutation.isSuccess) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
        <h2 className="type-h4 mt-4 text-foreground">Thank you — your enquiry is with us</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {bookingConfirmed
            ? `We have your requested slot — ${formatBooking(booking)} — and will send a calendar invite shortly.`
            : "A CyberSentinels consultant will respond within one business day."}
        </p>
      </div>
    );
  }

  return (
    <form
      id="book"
      className="scroll-mt-28 rounded-xl border border-border bg-background p-7 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <h2 className="type-h3 text-foreground">Tell us what you need</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Free 30-minute scoping call. No obligation, no sales script.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input className={inputClass} value={form.name} onChange={set("name")} required maxLength={120} />
        </Field>
        <Field label="Work email" required>
          <input type="email" className={inputClass} value={form.email} onChange={set("email")} required maxLength={255} />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={form.phone} onChange={set("phone")} maxLength={40} />
        </Field>
        <Field label="Company">
          <input className={inputClass} value={form.company} onChange={set("company")} maxLength={160} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Area of interest">
            <select className={inputClass} value={form.service_interest} onChange={set("service_interest")}>
              <option value="">Select a practice area</option>
              {pillars.map((p) => (
                <option key={p.url} value={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="How can we help?" required>
            <textarea
              className={`${inputClass} min-h-32`}
              value={form.message}
              onChange={set("message")}
              required
              maxLength={4000}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <BookingPicker value={booking} onChange={setBooking} />
      </div>

      {mutation.isError && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {(mutation.error as Error).message}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="brand-gradient mt-6 inline-flex items-center gap-2 rounded-md px-5 py-3 type-button text-white transition-all hover:brightness-110 disabled:opacity-60"
      >
        <Send className="size-4" strokeWidth={1.75} aria-hidden="true" />
        {mutation.isPending
          ? "Sending…"
          : bookingConfirmed
            ? "Confirm booking & send"
            : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {required && <span className="text-coral-ink"> *</span>}
      </span>
      {children}
    </label>
  );
}
