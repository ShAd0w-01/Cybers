import type { UIMessage } from "ai";

import { messageText, citationsFor } from "@/lib/citations";

/**
 * Client-side PDF export of a single advisor conversation, so a visitor can
 * share the guidance with their team without emailing us for a transcript.
 */
export async function exportThreadPdf(title: string, messages: UIMessage[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  const newPageIfNeeded = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (text: string, size: number, style: "normal" | "bold", color = "#111111") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, width) as string[];
    for (const line of lines) {
      newPageIfNeeded(size + 6);
      doc.text(line, margin, y);
      y += size + 5;
    }
  };

  write("CyberSentinels Advisor", 18, "bold");
  write(title, 12, "normal", "#444444");
  write(new Date().toLocaleString(), 9, "normal", "#777777");
  y += 8;

  for (const message of messages) {
    const body = messageText(message);
    if (!body) continue;
    y += 10;
    write(message.role === "user" ? "You" : "Advisor", 10, "bold", "#B0186B");
    write(body, 11, "normal");

    if (message.role !== "user") {
      const citations = citationsFor(message);
      if (citations.length) {
        write("Sources:", 9, "bold", "#555555");
        for (const citation of citations) {
          write(`• ${citation.title} — https://www.cybersentinels.com${citation.url}`, 9, "normal", "#555555");
        }
      }
    }
  }

  newPageIfNeeded(30);
  y += 12;
  write(
    "AI-generated guidance from cybersentinels.com. Confirm scope and outcomes on a consultation call.",
    8,
    "normal",
    "#888888",
  );

  const safe = title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 60) || "advisor-conversation";
  doc.save(`cybersentinels-${safe}.pdf`);
}
