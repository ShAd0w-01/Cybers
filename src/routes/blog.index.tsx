import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock3, Tag } from "lucide-react";

import { listPublishedPosts, type BlogPostCard } from "@/lib/blog.functions";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/blog/")({
  loader: async (): Promise<{ posts: BlogPostCard[] }> => ({ posts: await listPublishedPosts() }),
  head: () => ({
    meta: [
      { title: "Cybersecurity & Compliance Blog | CyberSentinels" },
      {
        name: "description",
        content:
          "Practical articles on VAPT, ISO 27001, SOC 2, DPDPA and GDPR readiness from the CyberSentinels consulting team.",
      },
      { property: "og:title", content: "Cybersecurity & Compliance Blog | CyberSentinels" },
      {
        property: "og:description",
        content: "Field notes on penetration testing, compliance programmes and privacy operations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts } = Route.useLoaderData() as { posts: BlogPostCard[] };
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Field notes on security testing, compliance and privacy"
        paragraphs={[
          "Written by the consultants who run the engagements — no vendor fluff, just what works when auditors, boards and attackers are all watching.",
        ]}
        crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
      />
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {posts.length === 0 ? (
            <p className="type-body text-muted-foreground">
              New articles are being published shortly. In the meantime, explore our{" "}
              <Link to="/insights" className="font-medium text-coral-ink underline underline-offset-4">
                insights and resources
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 50}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function PostCard({ post }: { post: BlogPostCard }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:-translate-y-0.5 hover:border-coral"
    >
      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt=""
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="brand-gradient h-1.5 w-full" aria-hidden="true" />
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.tags.length > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral-ink">
            <Tag className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {post.tags[0]}
          </span>
        )}
        <h2 className="type-h4 mt-3 text-foreground group-hover:text-coral-ink">{post.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            {post.read_minutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

export function formatDate(value: string | null) {
  if (!value) return "Draft";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
