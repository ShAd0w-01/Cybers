# Cybersentinels Consulting — Website Build Plan

## One clarification up front
I can't produce an editable Figma `.fig` file — I build the real, responsive website directly in code. What you'll get instead is better for development: a live design system (colors, type scale, components, spacing) plus every page rendered and clickable. It can be screenshotted or handed to a designer as the visual reference.

## Design direction

**Hybrid theme** — white/near-white content pages, near-black (`#0B0B12`) hero, CTA bands and footer.

| Token | Value | Use |
|---|---|---|
| Ink (dark canvas) | `#0B0B12` / `#15151F` | hero, CTA bands, footer |
| Paper | `#FFFFFF` / `#F5F6F9` | page + section backgrounds |
| Magenta | `#D65FC2` | brand accent, gradient start |
| Coral | `#FD576B` | primary CTA, gradient mid |
| Amber | `#FF9845` | gradient end, highlights |
| Brand gradient | magenta → coral → amber, 135° | buttons, rules, icon strokes, heading underlines |

Typography: **Sora** (headings, tight tracking) + **Manrope** (body). Restrained corner radius, generous whitespace, thin hairline dividers — professional consulting feel like tcsa.in, but with the logo's arc/gradient motif as the signature.

All values go into `src/styles.css` as semantic tokens (oklch) — no hardcoded colors in components. Logo files registered as CDN assets (white logo on dark chrome, dark logo on light).

## Dynamic homepage
Built to feel alive without being gimmicky:
1. **Hero** — dark canvas, animated rotating arc motif from the logo, gradient headline, dual CTA (Book a Consultation / Explore Our Services)
2. **Trust strip** — framework marks (ISO 27001, 27701, SOC 2, PCI DSS, DPDPA, GDPR, CMMC) in a slow marquee
3. **Four service pillars** — interactive cards revealing sub-services on hover
4. **Counters** — 36 services, 4 pillars, India/UAE/international, animated on scroll
5. **How we work** — 4-step engagement path with a gradient progress rail
6. **Industries** — 4 tiles
7. **Insights teaser + dark CTA band**

Motion: scroll-reveal, count-ups, hover lifts — all subtle and reduced-motion aware.

## Site structure (57 routes, per your sitemap)
```
/                         /about-us              /careers
/services                 /industries            /contact
  4 pillar pages            4 industry pages     /case-studies
  36 service detail pages                        /insights
Legal: /privacy-notice /cookie-policy /terms-of-use
       /website-disclaimer /responsible-disclosure
```
Header: logo left, mega-menu nav (Services grouped by pillar, Industries, Resources), "Book a Consultation" button far right; mobile drawer with expandable groups. Sticky on scroll. Global footer with the full link map, legal row and disclaimers.

## Build phases
1. **Foundations** — design tokens, fonts, logo assets, header with mega-menu, footer, shared section/CTA/card components, animation primitives
2. **Homepage** — the full dynamic page above
3. **Core pages** — About, Services overview, 4 pillar pages, Industries overview + 4 industry pages, Contact, Careers, Case Studies, Insights
4. **36 service detail pages** — one shared template (hero, overview, what's included, our approach, deliverables, when to engage, related services, CTA) driven by a typed content file so copy from V1.8 lives in one place. Built in batches by pillar.
5. **Legal pages + polish** — 5 legal pages, `robots.txt`, `/sitemap.xml` server route with all 57 URLs, per-route SEO metadata (unique title/description/OG/Twitter), breadcrumbs, JSON-LD (Organization + Service), accessibility and responsive pass

## Content
All copy is lifted from `Cybersentinels_Website_Content_Master_v1.8.docx` — approved headings, body copy and exact button labels. DEVELOPER NOTE lines stay out of public copy; square-bracket placeholders are kept visible so you can replace them before launch. No client names, logos or testimonials are published, and no certification outcome is guaranteed or implied. The doc exceeds the 50-page parse limit, so I'll re-read the later sections (service details, industries, legal) in the phase that needs them.

## Forms
Contact, Book a Consultation, Request an Assessment and the scoping questionnaires are built with full validation and success states, but submissions are not stored yet (your choice). Wiring them to Lovable Cloud later is a small, isolated change.

## Technical notes
- TanStack Start file-based routes, one file per page; service details use a shared template component plus a content module
- Tailwind v4 CSS-first tokens in `src/styles.css`; shadcn components restyled to brand variants
- Motion for React for scroll/hover animation, `prefers-reduced-motion` respected
- Static — no database or auth in this scope
