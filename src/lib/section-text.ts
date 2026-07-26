import type { Block, Section } from "@/content/site";

/**
 * Sections are stored as structured blocks, but editors want plain text.
 * These helpers translate between the two using a tiny, forgiving syntax:
 *   # Heading        -> h1
 *   ## Sub-heading   -> h3
 *   - item           -> list item
 *   > Label: Value   -> key/value row
 *   [Button label]   -> CTA button
 *   anything else    -> paragraph
 */
export function blocksToText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h1":
          return `# ${b.text}`;
        case "h3":
          return `## ${b.text}`;
        case "ul":
          return b.items.map((i) => `- ${i}`).join("\n");
        case "buttons":
          return b.items.map((i) => `[${i}]`).join("\n");
        case "kv":
          return `> ${b.label}: ${b.value}`;
        default:
          return b.text;
      }
    })
    .join("\n\n");
}

export function textToBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let list: string[] | null = null;
  let buttons: string[] | null = null;

  const flush = () => {
    if (list?.length) blocks.push({ type: "ul", items: list });
    if (buttons?.length) blocks.push({ type: "buttons", items: buttons });
    list = null;
    buttons = null;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("- ")) {
      if (buttons) flush();
      list = [...(list ?? []), line.slice(2).trim()];
      continue;
    }
    if (line.startsWith("[") && line.endsWith("]")) {
      if (list) flush();
      buttons = [...(buttons ?? []), line.slice(1, -1).trim()];
      continue;
    }
    flush();
    if (line.startsWith("## ")) blocks.push({ type: "h3", text: line.slice(3).trim() });
    else if (line.startsWith("# ")) blocks.push({ type: "h1", text: line.slice(2).trim() });
    else if (line.startsWith("> ") && line.includes(":")) {
      const body = line.slice(2);
      const idx = body.indexOf(":");
      blocks.push({
        type: "kv",
        label: body.slice(0, idx).trim(),
        value: body.slice(idx + 1).trim(),
      });
    } else blocks.push({ type: "p", text: line });
  }
  flush();
  return blocks;
}

export function sectionsToDraft(sections: Section[]) {
  return sections.map((s) => ({ heading: s.heading, text: blocksToText(s.blocks) }));
}

export function draftToSections(draft: Array<{ heading: string; text: string }>): Section[] {
  return draft
    .filter((s) => s.heading.trim() || s.text.trim())
    .map((s) => ({ heading: s.heading.trim(), blocks: textToBlocks(s.text) }));
}
