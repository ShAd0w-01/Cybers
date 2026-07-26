"""Parse the Cybersentinels Website Content Master docx into structured JSON.

Usage: pandoc <docx> -t html -o /tmp/cs.html && python3 scripts/parse-content.py /tmp/cs.html src/content/pages.json
"""

import json
import re
import sys

from bs4 import BeautifulSoup


def clean(text: str) -> str:
    t = re.sub(r"\s+", " ", text or "").strip()
    return t


def main(src: str, out: str) -> None:
    soup = BeautifulSoup(open(src).read(), "lxml")
    els = list(soup.body.find_all(recursive=False))

    # Find start indexes of each "PAGE n" marker paragraph.
    starts = []
    for i, e in enumerate(els):
        if e.name == "p" and re.fullmatch(r"PAGE \d+", clean(e.get_text())):
            starts.append(i)
    starts.append(len(els))

    pages = []
    for si in range(len(starts) - 1):
        block = els[starts[si] : starts[si + 1]]
        page = parse_page(block)
        if page:
            pages.append(page)

    json.dump(pages, open(out, "w"), indent=2, ensure_ascii=False)
    print(f"wrote {len(pages)} pages to {out}")


META_KEYS = {
    "recommended url": "url",
    "seo title": "seoTitle",
    "meta description": "metaDescription",
    "primary cta": "primaryCta",
    "secondary cta": "secondaryCta",
    "page type": "pageType",
    "template": "template",
}


def parse_page(block):
    num = int(clean(block[0].get_text()).split()[1])
    name = None
    meta = {}
    sections = []
    current = None

    for e in block[1:]:
        name_tag = e.name
        text = clean(e.get_text(" "))

        if name_tag == "table":
            for row in e.find_all("tr"):
                cells = row.find_all(["td", "th"])
                if len(cells) == 2:
                    k = clean(cells[0].get_text(" ")).lower().rstrip(":")
                    v = clean(cells[1].get_text(" "))
                    if k in META_KEYS:
                        meta[META_KEYS[k]] = v
                    else:
                        push(current, {"type": "kv", "label": clean(cells[0].get_text(" ")), "value": v})
            continue

        if not text:
            continue

        if name_tag == "h1":
            if name is None:
                name = text
            else:
                push(current, {"type": "h1", "text": text})
            continue

        if name_tag == "h2":
            current = {"heading": text, "blocks": []}
            sections.append(current)
            continue

        if name_tag == "h3":
            push(current, {"type": "h3", "text": text})
            continue

        if name_tag in ("h4", "h5", "h6"):
            push(current, {"type": "h3", "text": text})
            continue

        if name_tag == "ul" or name_tag == "ol":
            items = [clean(li.get_text(" ")) for li in e.find_all("li", recursive=False)]
            items = [i for i in items if i]
            if items:
                push(current, {"type": "ul", "items": items})
            continue

        if name_tag == "p":
            upper = text.upper()
            if upper.startswith("DEVELOPER NOTE"):
                continue  # never publish
            if upper.startswith("DEVELOPER BLUEPRINT"):
                continue
            if upper.startswith("BUTTON LABELS"):
                labels = text.split(":", 1)[1] if ":" in text else ""
                buttons = [clean(b) for b in labels.split("|") if clean(b)]
                if buttons:
                    push(current, {"type": "buttons", "items": buttons})
                continue
            if re.fullmatch(r"(EYEBROW|H1|H2|H3|HERO)", text):
                continue
            if re.fullmatch(r"Cybersentinels Consulting\s*[•·]\s*\d+", text):
                continue
            if text.upper().startswith("CYBERSENTINELS CONSULTING | WEBSITE CONTENT MASTER"):
                continue
            push(current, {"type": "p", "text": text})
            continue

    # Drop empty sections and normalize the hero section name.
    sections = [s for s in sections if s["blocks"]]

    return {
        "page": num,
        "name": name or f"Page {num}",
        **meta,
        "sections": sections,
    }


def push(section, block):
    if section is None:
        return
    section["blocks"].append(block)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
