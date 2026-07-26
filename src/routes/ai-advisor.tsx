import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ThreadSidebar } from "@/components/advisor/ThreadSidebar";
import { getVisitorId } from "@/lib/visitor";

export const Route = createFileRoute("/ai-advisor")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AI Security Advisor | Cybersentinels Consulting" },
      {
        name: "description",
        content:
          "Chat with the CyberSentinels AI Advisor for guidance on VAPT, ISO 27001, SOC 2, DPDPA and privacy readiness — and scope an assessment in minutes.",
      },
      { property: "og:title", content: "AI Security Advisor | Cybersentinels Consulting" },
      {
        property: "og:description",
        content:
          "Plain-English cybersecurity, compliance and privacy guidance, plus assessment scoping, from the CyberSentinels AI Advisor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdvisorLayout,
});

export function useVisitorId() {
  const [visitorId, setVisitorId] = useState("");
  useEffect(() => setVisitorId(getVisitorId()), []);
  return visitorId;
}

function AdvisorLayout() {
  const visitorId = useVisitorId();

  return (
    <div className="border-b border-border">
      <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col md:flex-row">
        {visitorId ? <ThreadSidebar visitorId={visitorId} /> : null}
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
