import { Card, Markdown, Stack, Text } from "@batthewz/response-ui-react-components";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Markdown Demo                                                      */
/*                                                                     */
/*  Added in @batthewz/response-ui-react-components 0.13.0. Renders a  */
/*  documented *subset* of Markdown as real components — fenced blocks  */
/*  become CodeBlock, tables become Table — so a rendered document is   */
/*  the same design system as the rest of the app and re-tints with     */
/*  the theme. The parser emits an AST, never an HTML string, so there  */
/*  is no dangerouslySetInnerHTML in the path and no sanitizer to       */
/*  misconfigure. These demos exist to show the subset boundary as      */
/*  much as the happy path: what renders, and what deliberately does    */
/*  not.                                                               */
/* ------------------------------------------------------------------ */

const PROSE_SOURCE = [
  "## Deploying to production",
  "",
  "A deploy is **atomic** — every route flips at once, or none of them do.",
  "Run it from a clean tree; a dirty tree is *rejected* before anything uploads.",
  "",
  "1. Tag the release",
  "2. Wait for CI to go green",
  "3. Promote the build",
  "",
  "- Rollbacks are one command and never rebuild",
  "  - The previous bundle is kept hot for 30 days",
  "- Logs stream to the dashboard within ~2s",
  "",
  "> Deploys are cheap. Reverts are cheaper.",
  "> Ship the small thing.",
  "",
  "Links are allowlisted by scheme — [the deploy guide](https://example.com/deploy) resolves,",
  "and `javascript:` URLs are dropped while keeping the author's text.",
  "",
  "---",
  "",
  "Inline styles: `code`, ~~struck~~, **bold**, and *emphasis* all render.",
].join("\n");

const TABLE_SOURCE = [
  "| Prop | Type | Default |",
  "| :-- | :-: | --: |",
  '| `rate` | number | `0.3` |',
  "| `clamp` | number | — |",
  '| `children` | ReactNode | required |',
].join("\n");

const CODE_SOURCE = [
  "### Install",
  "",
  "```bash",
  "bun add @batthewz/response-ui-react-components",
  "```",
  "",
  "Then render a document:",
  "",
  "```tsx",
  'import { Markdown } from "@batthewz/response-ui-react-components";',
  "",
  "export function Doc({ source }: { source: string }) {",
  "  return <Markdown>{source}</Markdown>;",
  "}",
  "```",
].join("\n");

const RAW_HTML_SOURCE = [
  "Accepts `Partial<Record<Status, string>>` — and <b>this stays text</b>.",
  "",
  "A generated API reference is full of type syntax sitting in prose. A renderer that",
  "honoured raw HTML would swallow `Omit<ComponentPropsWithRef<\"a\">, \"href\">` as an",
  "unknown tag and delete half the line. This one shows it.",
].join("\n");

const QUIET_CODE_SOURCE = [
  "Run `bun test`, then:",
  "",
  "```bash",
  "bun run build",
  "```",
].join("\n");

function MarkdownDemo() {
  return (
    <Section title="Markdown">
      <Card>
        <Stack gap="r4">
          <Text variant="body-2" color="secondary">
            Renders a documented subset of Markdown as real components. The parser produces an AST
            and the component renders React elements from it — no HTML string is ever built, so
            there is no dangerouslySetInnerHTML in the path.
          </Text>

          <SubSection label="Prose, lists and blockquotes">
            <Text variant="body-3" color="muted">
              Headings, paragraphs, ordered and unordered lists (nested by indentation),
              blockquotes, thematic breaks and inline emphasis. URLs pass a scheme allowlist.
            </Text>
            <Markdown>{PROSE_SOURCE}</Markdown>
          </SubSection>

          <SubSection label="Tables become the Table component">
            <Text variant="body-3" color="muted">
              A GFM table renders as this library&apos;s own Table, alignment row honoured — not a
              second source of truth for what a table looks like.
            </Text>
            <Markdown>{TABLE_SOURCE}</Markdown>
          </SubSection>

          <SubSection label="Fenced blocks become CodeBlock">
            <Text variant="body-3" color="muted">
              The first word of the info string becomes the language. Copy buttons and syntax
              treatment come from CodeBlock itself.
            </Text>
            <Markdown>{CODE_SOURCE}</Markdown>
          </SubSection>

          <SubSection label="Raw HTML renders as text">
            <Text variant="body-3" color="muted">
              A tag in the source renders as the characters that spell it, never as an element.
              That is a feature before it is a restriction — it is what lets generic type syntax
              survive.
            </Text>
            <Markdown>{RAW_HTML_SOURCE}</Markdown>
          </SubSection>

          <SubSection label="codeBlockProps reaches every fence at once">
            <Text variant="body-3" color="muted">
              Everything CodeBlock takes except code and language, which come from the fence. Here
              the copy button is turned off.
            </Text>
            <Markdown codeBlockProps={{ copyable: false }}>{QUIET_CODE_SOURCE}</Markdown>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function MarkdownDemos() {
  return <MarkdownDemo />;
}
