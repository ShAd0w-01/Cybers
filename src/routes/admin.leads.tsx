import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Mail, Phone, Search, Trash2 } from "lucide-react";

import { AdminHeader } from "@/components/admin/AdminShell";
import {
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  adminAddNote,
  adminDeleteLead,
  adminListLeads,
  adminListNotes,
  adminUpdateLead,
  type Lead,
} from "@/lib/crm.functions";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsPage,
});

const control =
  "rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground";

function LeadsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListLeads);
  const updateFn = useServerFn(adminUpdateLead);
  const deleteFn = useServerFn(adminDeleteLead);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const leads = useQuery({ queryKey: ["admin-leads"], queryFn: () => listFn() });

  const update = useMutation({
    mutationFn: (input: Parameters<typeof adminUpdateLead>[0]["data"]) => updateFn({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      setSelected(null);
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
    },
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (leads.data ?? []).filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (!q) return true;
      return [l.name, l.email, l.company, l.message].join(" ").toLowerCase().includes(q);
    });
  }, [leads.data, query, status]);

  return (
    <>
      <AdminHeader
        title="CRM — Leads"
        description="Every enquiry from the website contact form and AI advisor handoffs."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company…"
            aria-label="Search leads"
            className="w-72 rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{rows.length} shown</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Interest</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Follow-up</th>
              <th className="px-5 py-3">Received</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((lead) => (
              <tr key={lead.id} className="align-middle hover:bg-surface">
                <td className="px-5 py-3">
                  <button className="text-left" onClick={() => setSelected(lead)}>
                    <span className="font-medium text-foreground">{lead.name}</span>
                    {lead.company && (
                      <span className="text-muted-foreground"> · {lead.company}</span>
                    )}
                    <span className="block text-xs text-muted-foreground">{lead.email}</span>
                  </button>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {lead.service_interest || "—"}
                </td>
                <td className="px-5 py-3">
                  <select
                    className={control}
                    value={lead.status}
                    aria-label={`Status for ${lead.name}`}
                    onChange={(e) => update.mutate({ id: lead.id, status: e.target.value })}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3">
                  <select
                    className={control}
                    value={lead.priority}
                    aria-label={`Priority for ${lead.name}`}
                    onChange={(e) => update.mutate({ id: lead.id, priority: e.target.value })}
                  >
                    {LEAD_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3">
                  <input
                    type="date"
                    className={control}
                    aria-label={`Follow-up date for ${lead.name}`}
                    value={lead.next_follow_up ?? ""}
                    onChange={(e) => update.mutate({ id: lead.id, next_follow_up: e.target.value })}
                  />
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    aria-label={`Delete lead ${lead.name}`}
                    onClick={() => remove.mutate(lead.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {leads.isSuccess && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No leads match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const qc = useQueryClient();
  const notesFn = useServerFn(adminListNotes);
  const addFn = useServerFn(adminAddNote);
  const [note, setNote] = useState("");

  const notes = useQuery({
    queryKey: ["lead-notes", lead.id],
    queryFn: () => notesFn({ data: { leadId: lead.id } }),
  });
  const add = useMutation({
    mutationFn: () => addFn({ data: { leadId: lead.id, body: note } }),
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["lead-notes", lead.id] });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="type-h4 text-foreground">{lead.name}</h2>
            <p className="text-xs text-muted-foreground">{lead.company || "No company given"}</p>
          </div>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-coral-ink">
            <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" /> {lead.email}
          </a>
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-coral-ink">
              <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" /> {lead.phone}
            </a>
          )}
        </div>

        <div className="mt-5 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
          {lead.message}
        </div>

        <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Notes
        </h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a follow-up note…"
          className="mt-2 min-h-24 w-full rounded-md border border-border bg-background p-3 text-sm"
        />
        <button
          onClick={() => add.mutate()}
          disabled={!note.trim() || add.isPending}
          className="brand-gradient mt-2 rounded-md px-4 py-2 type-button text-white disabled:opacity-60"
        >
          Save note
        </button>

        <ul className="mt-5 space-y-3">
          {(notes.data ?? []).map((n) => (
            <li key={n.id} className="rounded-lg border border-border p-3">
              <p className="text-sm text-foreground">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {new Date(n.created_at).toLocaleString("en-GB")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
