import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { ThreatMap } from "@/components/site/ThreatMap";

export const Route = createFileRoute("/threat-map")({
  head: () => ({
    meta: [
      { title: "Live Cyberthreat Map | CyberSentinels" },
      {
        name: "description",
        content:
          "Watch global malware, web and network attacks in real time, and see how CyberSentinels turns that threat tempo into a testing and compliance programme.",
      },
      { property: "og:title", content: "Live Cyberthreat Map | CyberSentinels" },
      {
        property: "og:description",
        content: "Real-time global attack activity, with practical next steps for your security programme.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThreatMapPage,
});

function ThreatMapPage() {
  return (
    <>
      <PageHero
        eyebrow="Threat intelligence"
        title="Live global cyberthreat map"
        paragraphs={[
          "A real-time view of attack activity worldwide. Use it as a conversation starter with your board — then let us translate it into a tested, evidence-backed security programme.",
        ]}
        crumbs={[{ label: "Home", to: "/" }, { label: "Threat Map" }]}
      />
      <ThreatMap />
    </>
  );
}
