import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { getPage } from "@/content/site";
import { Reveal } from "@/components/site/Reveal";

const page = getPage("/contact");

export const Route = createFileRoute("/contact")({
  head: () => headFor(page, "Contact Cybersentinels Consulting"),
  component: Contact,
});

const details = [
  { icon: Mail, label: "Email", value: "info@cybersentinels.in" },
  { icon: MapPin, label: "Coverage", value: "India • UAE • International engagements" },
  { icon: Clock, label: "Response", value: "We respond to qualified enquiries within one business day." },
];

function Contact() {
  return (
    <ContentPage
      page={page!}
      eyebrow="Contact"
      crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
    >
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-3 lg:px-8">
          {details.map((d, i) => (
            <Reveal
              key={d.label}
              delay={i * 60}
              className="rounded-xl border border-border bg-background p-7"
            >
              <d.icon className="size-5 text-coral-ink" aria-hidden="true" />
              <h2 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {d.label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{d.value}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </ContentPage>
  );
}
