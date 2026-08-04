import { Card, Timeline } from "@batthewz/response-ui-react-components";
import { CheckCircle2, GitCommit, Package, Rocket, Truck } from "lucide-react";

import { Section, SubSection } from "./helpers";

/**
 * Timeline is configured by four *orthogonal* props — `align`, `density`,
 * `card` and `animate` — rather than by a `variant="dashboard"` preset, because
 * `variant` already means "a visual skin" on Button/Badge/Alert/Tabs and a
 * preset would freeze one taste judgement into the API. The sub-sections below
 * therefore demo the axes themselves, so a reader can see which knob produces
 * which change instead of memorising named presets.
 *
 * Every `titleAs` here is `"h5"`. `Section` renders its heading as
 * `<Text variant="h4">`, which is a real `<h4>`, so the component's `"h3"`
 * default would emit an `<h3>` *nested under* an `<h4>` and invert the document
 * outline for anyone navigating by heading. The default is only correct beneath
 * an `<h2>`; the level always has to be matched to the host page.
 */

/** A build/deploy log — the shape the single-column and dense feeds narrate. */
const DEPLOY_EVENTS = [
  { time: "09:14:02", title: "Build queued" },
  { time: "09:21:47", title: "Tests passed" },
  { time: "09:22:10", title: "Image pushed" },
  { time: "09:23:55", title: "Deployed to production" },
  { time: "09:41:08", title: "Health check green" },
];

export function TimelineDemo() {
  return (
    <Section title="Timeline" id="timeline">
      {/*
        The default shape: rail down the centre with cards alternating either
        side above 40rem, collapsing to the left layout below it (a half-width
        card has no room for a sentence on a phone). Children are plain strings
        rather than a wrapped `<Text variant="body-2" color="secondary">` —
        `.timeline-body` already resolves to exactly that size and ink, so the
        wrapper only added a redundant nested <p>.
      */}
      <SubSection label='Default — centre rail, alternating cards, scroll-revealed (align="center")'>
        <Card>
          <Timeline>
            <Timeline.Item titleAs="h5" date="Jan 2026" title="Project Kickoff">
              Initial project setup with Cloudflare Workers, Hono, and React.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="Feb 2026" title="Auth & Database">
              Added Better Auth, Drizzle ORM on D1, and Zod validation.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="Mar 2026" title="Component Library">
              Built animation primitives and display components with full theming support.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="Apr 2026" title="Launch">
              Production deployment with themes, accessibility, and documentation.
            </Timeline.Item>
          </Timeline>
        </Card>
      </SubSection>

      {/*
        `align="left"` is single-column at *every* width — nothing reflows at the
        breakpoint and no row is ever half empty, which is what makes it the
        dashboard answer. The trade is that cards leave the pinned
        `calc(50% - gutter)` width and take whatever the root gives them, so the
        root is constrained here (`max-w-lg`) rather than the card; there is no
        `maxWidth` prop, and a `className` on an item cannot reach the card.
      */}
      <SubSection label='Single-column rail — align="left", constrained root'>
        <Card>
          <Timeline align="left" animate={false} className="max-w-lg">
            <Timeline.Item titleAs="h5" date="09:14" title="Build queued">
              Commit <code>a1b2c3d</code> on <code>main</code>.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="09:21" title="Tests passed">
              1,284 tests, no retries.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="09:23" title="Deployed to production" />
          </Timeline>
        </Card>
      </SubSection>

      {/*
        `align="right"` is a true mirror, not just a nudge: the root's padding,
        the rail and the node's translateX all flip, and cards enter from the
        left instead of the right. The vocabulary is physical (left/right, not
        start/end) because the CSS is physical — under dir="rtl" an align="left"
        rail stays on the left, so `start` would promise a direction-awareness
        nothing here honours.
      */}
      <SubSection label='Mirrored rail — align="right"'>
        <Card>
          <Timeline align="right" animate={false} className="max-w-lg ml-auto">
            <Timeline.Item titleAs="h5" date="09:14" title="Build queued" />
            <Timeline.Item titleAs="h5" date="09:21" title="Tests passed" />
            <Timeline.Item titleAs="h5" date="09:23" title="Deployed to production" />
          </Timeline>
        </Card>
      </SubSection>

      {/*
        The dashboard feed: all four axes turned away from their marketing
        defaults at once. `card={false}` strips the border, surface and padding
        and re-centres each dot on the entry's first line of text, since there is
        no longer a card edge for it to sit level with. `animate={false}` matters
        for more than taste — every animating item constructs its own
        IntersectionObserver, so a long polled feed would be one observer per row
        replaying an entrance on each re-render.

        Mapping over an array is safe: side and entrance direction both come off
        the same CSS `:nth-child` rule now, so nothing in React counts the items
        and a `.map` cannot desynchronise layout from animation. The items are
        spread directly into the root — a wrapper element around each would make
        every item `nth-child(1)`, and a non-item child would break the rail,
        which is drawn per item.
      */}
      <SubSection label='Dashboard feed — align="left" density="dense" card={false} animate={false}'>
        <Card>
          <Timeline align="left" density="dense" card={false} animate={false} className="max-w-lg">
            {DEPLOY_EVENTS.map((evt) => (
              <Timeline.Item key={evt.time} titleAs="h5" date={evt.time} title={evt.title} />
            ))}
          </Timeline>
        </Card>
      </SubSection>

      {/*
        `card` is a separate axis from `density` on purpose. Coupling them would
        have made two legitimate shapes unreachable — a dense *carded* timeline,
        and this one: spacious and flat, where the borders would be noise but the
        rhythm should still breathe. `density` retunes spacing only; it changes
        no type size, and it does not touch the border or surface.
      */}
      <SubSection label='Spacious & flat — density="spacious" card={false}'>
        <Card>
          <Timeline align="left" density="spacious" card={false} animate={false}>
            <Timeline.Item titleAs="h5" date="2019" title="Founded">
              Two people and a rented server.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="2022" title="Series A">
              Enough runway to stop counting.
            </Timeline.Item>
            <Timeline.Item titleAs="h5" date="2026" title="Series B">
              Hiring in three timezones.
            </Timeline.Item>
          </Timeline>
        </Card>
      </SubSection>

      {/*
        `icon` replaces the dot and lands in an opaque marker puck. The disc is
        load-bearing, not decoration: the rail is drawn *behind* the node, so a
        bare glyph with transparent gaps would show the line running through
        itself and reading as passing over the final marker rather than
        terminating on it.

        The glyphs carry no `size` prop deliberately — the puck sizes direct
        `svg` children with `density` (1.5/0.875rem dense → 2/1.125rem spacious),
        so hand-tuning a size here would fight the scale and crowd or swim at one
        end of it. They are `aria-hidden` because `icon` renders as-is and gets
        no accessible name of its own.

        `highlight` champions one entry through *two* channels: the marker fills
        with `--timeline-highlight-fill` and gains a ring in the same colour, so
        it reads bigger. The width half is the cue that survives greyscale and a
        theme whose accent sits near the surface — which is why the ring's width
        is the one part that is not a custom property and cannot be overridden
        away. The rail reserves that width whether or not anything is
        highlighted, so championing an entry never slides the rail sideways.
      */}
      <SubSection label="Icons on the rail, with one championed entry (icon + highlight)">
        <Card>
          <Timeline align="left" density="comfortable" animate={false} className="max-w-lg">
            <Timeline.Item
              titleAs="h5"
              icon={<Package aria-hidden />}
              date="12 March"
              title="Order placed"
            >
              Three items, paid with the card ending 4242.
            </Timeline.Item>
            <Timeline.Item
              titleAs="h5"
              icon={<Truck aria-hidden />}
              date="13 March"
              title="Out for delivery"
            >
              Handed to the courier in Rotterdam.
            </Timeline.Item>
            <Timeline.Item
              titleAs="h5"
              highlight
              icon={<Rocket aria-hidden />}
              date="14 March"
              title="Arriving today"
            >
              Out on the van, ninth stop of nineteen.
            </Timeline.Item>
            <Timeline.Item
              titleAs="h5"
              icon={<CheckCircle2 aria-hidden />}
              date="15 March"
              title="Delivered"
            >
              Signed for by Ada Lovelace.
            </Timeline.Item>
          </Timeline>
        </Card>
      </SubSection>

      {/*
        The root is a bare <div> with no role and the items are bare <div>s too,
        so list semantics are opt-in. Rest props reach the DOM on both the
        animating and the static path, which is why role/aria-label land here
        regardless of `animate` — and why `id` and `data-*` on an item survive
        the ScrollReveal wrapper.
      */}
      <SubSection label='Opt-in list semantics — role="list" / role="listitem"'>
        <Card>
          <Timeline
            align="left"
            density="dense"
            animate={false}
            role="list"
            aria-label="Release history"
            className="max-w-lg"
          >
            <Timeline.Item
              role="listitem"
              titleAs="h5"
              icon={<GitCommit aria-hidden />}
              date="0.17.0"
              title="Timeline alignment axes"
            />
            <Timeline.Item
              role="listitem"
              titleAs="h5"
              icon={<GitCommit aria-hidden />}
              date="0.14.0"
              title="Contrast guard in CI"
            />
            <Timeline.Item
              role="listitem"
              titleAs="h5"
              icon={<GitCommit aria-hidden />}
              date="0.10.1"
              title="Rail ends at the last dot"
            />
          </Timeline>
        </Card>
      </SubSection>
    </Section>
  );
}
