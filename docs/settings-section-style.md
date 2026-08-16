# Settings Section Header Design Spec

Consume this when you build or fix a DeepSeek Harness **settings section** (`settings.section` page) so your page header (page title + page description) looks exactly like the official pages, and compose cleanly with every other plugin in the same settings panel.

Authoritative anchors (measured against the shipped web UI):

- Agent Presets page: `h2.<hash>_title` + `p.<hash>_intro`
- Models page: `h2.<hash>_title` + `p.<hash>_intro`

Both are normalized by this plugin to the table below.

## The recipe

| Element | Value |
| --- | --- |
| Page title (`h2`) | `18px/26px`, `font-weight:600`, `color: var(--dsw-alias-label-primary)`, `margin: 0 0 -8px` |
| Page description (`p`) | `13px/20px`, `color: var(--dsw-alias-label-tertiary)`, `margin: 0 0 12px`, `padding-bottom:12px`, bottom `1px solid var(--dsw-alias-border-l2)` (hairline) |
| Title → description gap | **4px** |
| Group heading (`h3`) | `13px`, `font-weight:600` (e.g. the `内置/自定义` groups on Agent Presets) |
| Page container | `flex column`, `gap:12px`, `min-height:100%` |
| Icon next to the title | **None** (official page titles are plain text; icons live only in the left settings nav as 16px glyphs) |

TSX shape (yours to author; semantic tokens only, CSS Modules):

```tsx
<div className={css.section}>          {/* flex column, gap 12px, min-height 100% */}
  <h2 className={css.title}>Page title</h2>   {/* 18px/26px/600, label-primary, margin:0 0 -8px */}
  <p className={css.intro}>Page description</p>{/* 13px/20px, label-tertiary, margin:0 0 12px, padding-bottom:12px, border-bottom hairline */}
  … your groups / cards / rows …
</div>
```

Class-name convention: end your semantic class names with a **stable suffix** (`_title` for the title, `_intro` for the description) so normalization rules (below) and other tooling can match them reliably. Prefix with a plugin-specific marker (`myplugin_title`) to avoid collisions. Never depend on the full hashed class name — the hash prefix changes per build; match on suffix / structure.

## Compliance checklist

1. **Does the page have a title?** A top-level `<h2>` (18/600). If there is only a description — or the content starts immediately — the title is missing.
2. **Is the title plain text?** No logo/icon beside the title (official titles carry none).
3. **Is there a page description?** A 13px tertiary paragraph with a bottom hairline under the title. Field-level captions don't count (those are in-row hints, not the page intro).
4. **Is the spacing right?** ~4px between title and description; 12px padding + hairline below the description; content separated by the container `gap:12px`.
5. **Are the class names stable-matchable?** `_title` for the title, `_intro` for the description.
6. **Nothing else is hit?** Page-title selectors must be scoped to the page header (`settings.section` top), never to in-row `_title`/`_desc` elements.

## What this plugin normalizes automatically

When this plugin (`harness-ui-enhancer`) is installed, these apply to **any** third-party `settings.section` page without you doing anything — build to the spec anyway so you don't depend on them:

| Problem | Auto-handling |
| --- | --- |
| Title font weight/size off | `[data-slot='settings.section'] h2[class$='_title']` / `h2[class$='_heading']` → 18/600 + `margin-bottom:-8px` |
| Description font off | `p[class$='_intro']` → 13/20 tertiary + `padding-bottom:12px` + hairline |
| Icon in the title row | `[data-slot='settings.section'] [class$='_titleRow'] > svg { display:none }` |
| Missing `<h2>` but a `p[class$='_intro']` present | Client injects `<h2 class="enhc-settings-title">` (18/600) labelled from the active settings-nav item (`aria-current="true"`); purely additive |
| Title–description too cramped | Heading `gap` + title margin normalized to 4px |
| Description missing hairline | Known third-party pages get `padding-bottom:12px` + `border-bottom:1px solid` |

Boundaries: normalization only touches the **header** (visual). It does not reorder your content, does not remove functional icons (only a logo that sits directly in the title row), and does not fabricate description copy (if a title is missing and no nav label can be resolved, it skips rather than write wrong text).

## Known third-party pages

| Page | Previously non-conforming | Normalized |
| --- | --- | --- |
| Notifications (`dsh-notification`, `dsh_notification_*`) | description had no hairline; title–description too tight (~-6px due to gap + negative margin) | heading `gap:4px`, title `margin-bottom:0`, subtitle hairline added |
| Plugin market (`dshmarket`, `eGUBIq_*`) | 22px logo beside the title | direct `titleRow` svg `display:none` |
| Side cards (`dsh-better-sidebar`, `Pz1RTq_*`) | no `<h2>` at all, only a `p.intro` | injected `enhc-settings-title` labelled "侧边卡片" |
| Widgets (`harness-widgets`) | — (self-drawn inline div header, already conformant) | untouched |

## Recommendation for plugin authors

- Always use a semantic `<h2>` for the page title and a `<p>` for the page intro, with `_title` / `_intro` class suffixes.
- Register the whole page via `settings.section` (`{ name:'settings.section', id:'<key>', order:n, label:… }`).
- Do not put a logo beside the title; icons belong in the settings nav (`settings.trigger`).
- Use `--dsw-alias-*` / `--dsw-font-*` semantic tokens, never literal colors/sizes.
- Reuse `@deepseek-ai/dsh-client-ui-primitives` components where possible.
