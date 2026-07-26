import type { UIMessage } from "ai";

type Citation = { title: string; url: string };

/** Collects the exact pages the advisor used, from its tool results. */
export function citationsFor(message: UIMessage): Citation[] {
  const found = new Map<string, Citation>();
  for (const part of message.parts) {
    if (part.type === "tool-find_services" && "output" in part && part.output) {
      const output = part.output as { matches?: Citation[] };
      for (const match of output.matches ?? []) {
        if (match?.url) found.set(match.url, { title: match.title, url: match.url });
      }
    }
    if (part.type === "tool-summarise_scope" && "output" in part && part.output) {
      const output = part.output as { recommendedServices?: Citation[] };
      for (const match of output.recommendedServices ?? []) {
        if (match?.url) found.set(match.url, { title: match.title, url: match.url });
      }
    }
  }

  // Only cite pages the answer actually mentions, when it links any.
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join(" ");
  const mentioned = [...found.values()].filter((c) => text.includes(c.url));
  return mentioned.length ? mentioned : [...found.values()].slice(0, 4);
}

export function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n")
    .trim();
}
