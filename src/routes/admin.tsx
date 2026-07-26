import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  // The admin panel depends on the browser session, so it is client-rendered.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin panel | CyberSentinels" },
      { name: "description", content: "Manage leads, blog posts and website content." },
      { property: "og:title", content: "Admin panel | CyberSentinels" },
      { property: "og:description", content: "CyberSentinels internal administration." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminShell />,
});
