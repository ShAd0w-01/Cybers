import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock3, User2 } from "lucide-react";

import { getPublishedPost, type BlogPost } from "@/lib/blog.functions";
import { Markdown } from "@/components/site/Markdown";
import { CtaLink } from "@/components/site/CtaLink";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<{ post: BlogPost }> => {
    const post = await getPublishedPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable | CyberSentinels" }, { name: "robots", content: "noindex" }] };
    }
    const post = loaderData.post;
    const title = post.seo_title || `${post.title} | CyberSentinels`;
    const description = post.meta_description || post.excerpt;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post.cover_image_url?.startsWith("https://")
          ? [
              { property: "og:image", content: post.cover_image_url },
              { name: "twitter:image", content: post.cover_image_url },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  component: Article,
});

function Article() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  return (
    <article>
      <header className="wash-warm band-soft relative overflow-hidden py-20 text-ink-foreground sm:py-20">
        <Doodle variant="insight" opacity={0.85} />
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-ink-foreground/65 hover:text-coral"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" /> All articles
          </Link>
          <h1 className="type-display mt-6 text-ink-foreground">{post.title}</h1>
          <p className="type-lead mt-4 text-ink-foreground/70">{post.excerpt}</p>
          <div className="mt-7 flex flex-wrap items-center gap-5 text-xs text-ink-foreground/60">
            <span className="flex items-center gap-1.5">
              <User2 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              {post.read_minutes} min read
            </span>
          </div>
        </div>
      </header>

      {post.cover_image_url && (
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <img
            src={post.cover_image_url}
            alt=""
            className="-mt-10 w-full rounded-xl border border-border object-cover shadow-lg"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <Markdown text={post.body} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-xl border border-border bg-surface p-8">
          <h2 className="type-h4 text-foreground">Need this reviewed in your environment?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Book a free 30-minute scoping call with a CyberSentinels consultant.
          </p>
          <div className="mt-5">
            <CtaLink to="/contact">Book a Consultation</CtaLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function ArticleNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
      <h1 className="type-h2 text-foreground">Article not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This article may have been unpublished or moved.
      </p>
      <div className="mt-6 flex justify-center">
        <CtaLink to="/blog">Back to the blog</CtaLink>
      </div>
    </div>
  );
}
