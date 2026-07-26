import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContentPage, headFor } from "@/components/site/ContentPage";
import { type PageContent, whatsapp } from "@/content/site";
import { WhatsAppIcon, whatsappHref } from "@/components/site/WhatsAppButton";

import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";

/** Page copy is loaded on demand so it never ships in the initial bundle. */
const loadPage = async () =>
  (await import("@/content/pages/contact.json")).default as PageContent;

export const Route = createFileRoute("/contact")({
  loader: async () => ({ page: await loadPage() }),
  head: ({ loaderData }) => headFor(loaderData?.page, "Contact Cybersentinels Consulting"),
  component: Contact,
});

const details = [
  { icon: Mail, label: "Email", value: "info@cybersentinels.in" },
  { icon: MapPin, label: "Coverage", value: "India • UAE • International engagements" },
  { icon: Clock, label: "Response", value: "We respond to qualified enquiries within one business day." },
];

function Contact() {
  const { page } = Route.useLoaderData();
  return (
    <ContentPage
      page={page}
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
        <div className="mx-auto mt-10 max-w-3xl px-5 lg:px-8">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6 transition-colors hover:border-[#25D366] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#25D366] text-[#062d15]">
                <WhatsAppIcon className="size-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">
                  Chat with us on WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">{whatsapp.display}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-coral-ink">Start chat →</span>
          </a>
        </div>
        <div className="mx-auto mt-8 max-w-3xl px-5 lg:px-8">
          <ContactForm />
        </div>
      </section>

    </ContentPage>
  );
}
