import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/** Available consultation slots (IST business hours). */
const SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

export type Booking = { date: string; time: string } | null;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function formatBooking(b: Booking) {
  if (!b) return "";
  const d = new Date(`${b.date}T00:00:00`);
  return `${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at ${b.time} IST`;
}

/**
 * Inline availability calendar so a visitor can pick a consultation slot
 * without leaving the enquiry form. Weekends and past dates are unavailable,
 * and bookings can be made up to eight weeks ahead.
 */
export function BookingPicker({
  value,
  onChange,
}: {
  value: Booking;
  onChange: (b: Booking) => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const maxDate = useMemo(() => {
    const m = new Date(today);
    m.setDate(m.getDate() + 56);
    return m;
  }, [today]);

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7; // Monday-first grid
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let i = 1; i <= count; i += 1) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    }
    return cells;
  }, [cursor]);

  const isAvailable = (d: Date) => {
    const dow = d.getDay();
    return dow !== 0 && dow !== 6 && d >= today && d <= maxDate;
  };

  const shiftMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  const canGoBack = cursor > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoForward = cursor < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-coral-ink" strokeWidth={1.75} aria-hidden="true" />
        <h3 className="font-display text-sm font-semibold text-foreground">
          Choose a time for your call
        </h3>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        30 minutes, Monday–Friday, times shown in IST (GMT+5:30).
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canGoBack}
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground disabled:opacity-40"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <p aria-live="polite" className="font-display text-sm font-semibold text-foreground">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!canGoForward}
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground disabled:opacity-40"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {DOW.map((d) => (
              <span
                key={d}
                className="py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {d}
              </span>
            ))}
            {days.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const key = iso(d);
              const ok = isAvailable(d);
              const selected = value?.date === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!ok}
                  aria-pressed={selected}
                  onClick={() => onChange({ date: key, time: value?.time ?? "" })}
                  className={cn(
                    "aspect-square rounded-md text-sm transition-colors",
                    ok
                      ? "text-foreground hover:bg-accent"
                      : "cursor-not-allowed text-muted-foreground/40",
                    selected && "brand-gradient font-semibold text-white hover:brightness-110",
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            Available times
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-2">
            {SLOTS.map((t) => {
              const selected = value?.time === t;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={!value?.date}
                  aria-pressed={selected}
                  onClick={() => value?.date && onChange({ date: value.date, time: t })}
                  className={cn(
                    "rounded-md border px-2 py-2 text-sm transition-colors",
                    selected
                      ? "border-transparent brand-gradient font-semibold text-white"
                      : "border-border bg-background text-foreground hover:border-coral-ink hover:bg-accent",
                    !value?.date && "cursor-not-allowed opacity-50",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {!value?.date && (
            <p className="mt-3 text-xs text-muted-foreground">Pick a date first.</p>
          )}
        </div>
      </div>

      {value?.date && value.time ? (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-coral-ink/40 bg-background px-3 py-2.5 text-sm text-foreground">
          <Check className="size-4 text-coral-ink" strokeWidth={2} aria-hidden="true" />
          Requested: {formatBooking(value)}
        </p>
      ) : null}
    </div>
  );
}
