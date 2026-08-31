# Showcase Copy Guide

How Velora showcase pages should read and teach. Complements [SHOWCASE_PAGE_PLAYBOOK.md](./SHOWCASE_PAGE_PLAYBOOK.md) (motion contract) and [DEPLOY.md](./DEPLOY.md) (hosting).

## Principle: demonstrate at peak Velora

Every primary page must answer in **under 10 seconds of scrolling**:

1. What can I copy?
2. What do I interact with?
3. What makes this different from a generic CSS demo?

**Show, then label.** Motion runs first; copy explains the contract beside or after the demo — never instead of it.

### Voice

| Do | Don't |
| --- | --- |
| Imperative cues: "Scroll.", "Hover.", "Pin this stage." | Abstract marketing: "next-gen", "revolutionary" |
| One job per page (see matrix below) | Same "Release 07 / 72%" beat on every page |
| Copyable `<pre>` near live demos | Walls of preset tables without targets |
| Honest limits: fallback, reduced motion, host-agnostic | "Works everywhere", "zero JavaScript" (absolute) |

Use **Zero animation runtime JavaScript** — not "Zero JavaScript".

### Frame · Cue · Cut

Borrowed from the home reel — use on every primary act:

- **Frame** — one dominant stage (hero, pin track, product card)
- **Cue** — attribute direction (`vl-enter`, `vl-act`, `vl-scroll`)
- **Cut** — handoff to next beat (scroll, link, scene change)

---

## Page jobs (primary tier)

| Page | One-line job | Hero promise | Must-have demos |
| --- | --- | --- | --- |
| **Home** | Product manifesto + map | "Motion is markup. Browser is the runtime." | Hero 3D, metrics from catalog, pin teaching clock, grammar grid |
| **Core** | Public grammar + clocks | "Scroll the contract — twelve beats, one engine." | Pin opera, channel stack card, policy grid |
| **Elements** | Lifecycle + DS primitives | "Same page. Native state. No app runtime." | Enter+hover card, accordion/popover, form focus |
| **Scenes** | Scene clock authoring | "Pin the stage. Scrub the story." | 3-beat pin demo, story grid, host snippet |
| **Skins** | Editorial voice swap | "Same product. Four models." | 4 skin previews (identical semantics) |
| **Catalog** | Decision → channel → preset | "Pick intent. See it live. Copy markup." | Intent map, live targets per channel, registry |

Secondary pages (Hosts, Compatibility, Playground) teach **one tool each** — shorter copy, one interactive block minimum.

---

## Copy patterns

### Section header (template)

```text
{kicker}     // Act NN · {verb the demo}
{title}      — outcome in plain language
{lead}       — one sentence: what to do + what you'll see
{hint}       — optional: "Scroll slowly" / "Hover each card" / "Try reduced motion in OS settings"
```

### Practical hint (inline)

```html
<p class="showcase-practical-hint">↓ Scroll — the stage pins while <code>vl-act</code> advances the shared clock.</p>
```

### Copy block (beside demo)

```html
<pre class="scene-tl-code">&lt;h1 vl-enter="clip-rise" vl-act="1"&gt;…&lt;/h1&gt;</pre>
```

Place within **800ms read** of the demo it reproduces.

---

## Narrative beats (where allowed)

| Beat | Pages | Purpose |
| --- | --- | --- |
| Editorial "Release brief" | Home (idx-clock only), Skins | Product-shaped Skin demo |
| Grammar / catalog numbers | Core, Home metrics | Defensible claims from `packages/catalog/` |
| Scene clock / pin+scrub | Scenes, Home idx-clock, Core opera | Engine proof |
| Host-agnostic | Hosts, Core policy, Scenes portable | Integration story |

Do **not** reuse Release 07 on Core, Scenes, Elements, or Catalog.

---

## Docs cross-link

Showcase teaches by doing. Docs teach by reading.

- Footer / hero secondary CTA: `https://docs.veloracss.io`
- Deep spec: link GitHub `docs/spec/attribute-grammar.md`
- Generated data: link Catalog `#preset-registry`

---

## Review checklist (per page edit)

- [ ] Every act has a live motion demo (not text-only cards)
- [ ] User action stated (scroll / hover / focus / navigate)
- [ ] At least one copyable snippet per major section
- [ ] No marketing counts unless from `catalog-summary.json`
- [ ] `pnpm verify:contract` passes after markup changes
