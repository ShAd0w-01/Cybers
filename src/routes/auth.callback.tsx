import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in | CyberSentinels" },
      { name: "description", content: "Completing sign-in to the CyberSentinels AI Advisor." },
      { property: "og:title", content: "Signing you in | CyberSentinels" },
      { property: "og:description", content: "Completing sign-in to the CyberSentinels AI Advisor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      const stored = sessionStorage.getItem("cs-auth-redirect");
      sessionStorage.removeItem("cs-auth-redirect");
      const to = stored && stored.startsWith("/") && !stored.startsWith("//") ? stored : "/ai-advisor";
      void navigate({ to, replace: true });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) go();
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });
    const timeout = setTimeout(() => navigate({ to: "/auth", replace: true }), 8000);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </main>
  );
}
