import { Fragment } from "react";

/**
 * Minimal, safe renderer for the lightweight markdown used in blog posts.
 * No HTML is ever injected — every node is created as a React element.
 */
export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-5">
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith("### "))
          return (
            <h3 key={i} className="type-h4 pt-2 text-foreground">
              {inline(block.slice(4))}
            </h3>
          );
        if (block.startsWith("## "))
          return (
            <h2 key={i} className="type-h3 pt-4 text-foreground">
              {inline(block.slice(3))}
            </h2>
          );
        if (block.startsWith("> "))
          return (
            <blockquote
              key={i}
              className="border-l-2 border-coral pl-4 text-[15px] italic text-muted-foreground"
            >
              {inline(block.replace(/^> ?/gm, ""))}
            </blockquote>
          );
        if (/^([-*]|\d+\.)\s/.test(block)) {
          const ordered = /^\d+\.\s/.test(block);
          const items = block.split("\n").map((l) => l.replace(/^([-*]|\d+\.)\s*/, ""));
          const List = ordered ? "ol" : "ul";
          return (
            <List
              key={i}
              className={`space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground ${
                ordered ? "list-decimal" : "list-disc"
              }`}
            >
              {items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </List>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}

/** Bold (**x**) and links ([text](/url)) only. */
function inline(text: string) {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {m[1]}
        </strong>,
      );
    } else {
      const href = m[3];
      const external = href.startsWith("http");
      parts.push(
        <a
          key={key++}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-coral-ink underline underline-offset-4"
        >
          {m[2]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
