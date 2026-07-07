---
name: engineering-doc-generator
description: Generates two-file MDX engineering documentation (conceptual guide + TypeScript implementation) for any technical topic, following the open-kerno/docs structure and style conventions.
license: MIT
compatibility: "Claude Code, Cursor, or any agentic coding assistant with file read/write access inside the open-kerno/docs Docusaurus project."
metadata:
  author: Open-Kerno Team
  version: "1.0"
---

# Skill: Generate Engineering Documentation

Generate a two-file MDX documentation entry under `docs/` following the exact structure and style used across this repository.

## When to use

When the user provides a technical topic and asks to generate or add documentation for it.

## Output structure

For topic `{topic-slug}`, produce:

```
docs/{topic-slug}/index.mdx
docs/{topic-slug}/typescript-implementation.mdx
```

- **`index.mdx`** — Conceptual guide: the "why", standards, rules, reference tables, architectural decisions. Written from the CTO to all engineering teams.
- **`typescript-implementation.mdx`** — Concrete, copy-paste-ready TypeScript/Node.js code examples. One example per section. No theory — only implementation.

Before writing, read an existing pair to calibrate style:
- `docs/encryption-standards/index.mdx`
- `docs/encryption-standards/typescript-implementation.mdx`

---

## Prompt to use

Act as the CTO of a fast-growing startup. Write an engineering-wide technical guide to align all engineering and DevOps teams on our **{TOPIC_TITLE}** standards.

Create two MDX files at:
- `docs/{topic-slug}/index.mdx`
- `docs/{topic-slug}/typescript-implementation.mdx`

---

### File 1 — `index.mdx`

**Frontmatter:**
```yaml
---
sidebar_position: 2
title: {TOPIC_TITLE}
description: {One sentence describing what this guide covers.}
author: CTO
tags: [standards, {tag1}, {tag2}, ...]
---
```

**Tone & writing requirements:**
- Perspective: CTO to all engineering and infrastructure teams. Security/quality-focused, professional, highly actionable.
- Language: English, B1/Intermediate level. Short, direct sentences. No jargon where avoidable.
- Start with: `> **From the CTO — Required reading for all product and engineering teams.**`

**Document structure:**

1. **Table of Contents** — Numbered list linking to all H2 sections with anchor links.
2. **Why This Matters** — What goes wrong without this standard. H3 sub-sections per failure mode. Bold failure labels. End with `> **Architectural warning:**` blockquote.
3. **The Standard: {CORE_STANDARD_NAME}** — Define precisely. Include a format/rules table. Include a before/after comparison table (raw input → normalized output).
4. **Official Tooling** — Approved package(s) with `npm install` command. Bullet list of *why* this tool. Explicitly state what NOT to use.
5. **{Domain-Specific Section}** — One or more sections specific to the topic. Include SQL/config snippets where relevant.
6. **Quick Reference** — Code block with ✅/❌ examples, then a summary table of common tasks and how to do them.

**Formatting rules:**
- H1, H2, H3 headers; `---` dividers between sections.
- All tables use `|---|---|` alignment rows.
- Blockquotes for architectural warnings and critical rules.
- Inline code backticks for all values, column names, functions, package names.
- End with: `*Questions or edge cases not covered here? Open a discussion in the \`#engineering-standards\` channel.*`

---

### File 2 — `typescript-implementation.mdx`

**Frontmatter:**
```yaml
---
sidebar_position: 1
title: TypeScript Implementation
description: Code examples for {what the code demonstrates} using {main library/tool}.
tags: [typescript, {tag1}, {tag2}]
---
```

**Tone & writing requirements:**
- No theory. No "why". Only implementation.
- Each section: one sentence of context, then the code block.
- Blockquotes only for critical "never do this" or "always do this" warnings.

**Document structure:**

1. **Installation & Import** — `npm install` command, then import statement.
2. **{Basic Operation}** — Simplest possible use case. Show input and output in comments.
3. **{Validation / Check}** — Typed function that validates input and returns a structured result interface.
4. **{Normalization / Transform}** — Function that normalizes/transforms the input to the standard format.
5. **{Integration Example}** — Real-world usage (e.g. Express middleware, Prisma hook, database column). Show full context.
6. **{Edge Cases / Error Handling}** — Handle the two or three most likely failure modes. Typed error returns, no exceptions thrown.

**Formatting rules:**
- All code blocks use `typescript` language tag.
- Every code block is self-contained and runnable.
- Variable names must be explicit — no `x`, `val`, `tmp`.
- No `any` types.
