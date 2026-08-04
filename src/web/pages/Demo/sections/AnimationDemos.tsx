import {
  AnimatePresence,
  Button,
  Card,
  Center,
  Parallax,
  Stack,
  Text,
  ViewTransition,
} from "@batthewz/response-ui-react-components";
import { useCallback, useState } from "react";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  AnimatePresence Demo                                               */
/* ------------------------------------------------------------------ */

function AnimatePresenceDemo() {
  const [show, setShow] = useState(true);

  return (
    <Section title="AnimatePresence">
      <Card>
        <Stack gap="r4">
          <SubSection label="Toggle Mount / Unmount">
            <Text variant="body-3" color="muted">
              Animates enter/exit when mounting and unmounting children. Respects
              prefers-reduced-motion.
            </Text>
            <div>
              <Button variant="secondary" size="sm" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </Button>
            </div>
            <div style={{ minHeight: 72 }}>
              <AnimatePresence show={show} enterClass="fade-in" exitClass="fade-out">
                <Card padding="r4" shadow="sm">
                  <Text variant="body-2">
                    This card animates in and out. Click the button above to toggle.
                  </Text>
                </Card>
              </AnimatePresence>
            </div>
          </SubSection>

          <SubSection label="Custom Classes">
            <AnimatePresenceCustom />
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

function AnimatePresenceCustom() {
  const [show, setShow] = useState(true);

  return (
    <Stack gap="r5">
      <Text variant="body-3" color="muted">
        Use enterClass and exitClass to customize the animation.
      </Text>
      <div>
        <Button variant="secondary" size="sm" onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"} (fade-up)
        </Button>
      </div>
      <div style={{ minHeight: 72 }}>
        <AnimatePresence show={show} enterClass="fade-up" exitClass="fade-out">
          <Card padding="r4" shadow="sm">
            <Text variant="body-2">Fades up on enter, fades out on exit.</Text>
          </Card>
        </AnimatePresence>
      </div>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  ViewTransition Demo                                                */
/* ------------------------------------------------------------------ */

function ViewTransitionDemo() {
  const [variant, setVariant] = useState<"A" | "B">("A");

  const handleSwitch = useCallback(() => {
    const toggle = () => setVariant((v) => (v === "A" ? "B" : "A"));
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(toggle);
    } else {
      toggle();
    }
  }, []);

  return (
    <Section title="ViewTransition">
      <Card>
        <Stack gap="r4">
          <SubSection label="Named View Transitions">
            <Text variant="body-3" color="muted">
              Wraps children with a viewTransitionName CSS property. When used with
              document.startViewTransition(), the browser smoothly cross-fades between states. Also
              exports useViewTransition() for navigation transitions.
            </Text>
            <div>
              <Button variant="secondary" size="sm" onClick={handleSwitch}>
                Switch to {variant === "A" ? "B" : "A"}
              </Button>
            </div>
            <ViewTransition name="demo-card">
              <Card padding="r4" shadow="sm">
                <Stack gap="r5">
                  <Text variant="h6">{variant === "A" ? "Card A" : "Card B"}</Text>
                  <Text variant="body-2" color="secondary">
                    {variant === "A"
                      ? "This is the first view. Click the button to transition."
                      : "This is the second view. The element shares a viewTransitionName."}
                  </Text>
                </Stack>
              </Card>
            </ViewTransition>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Parallax Demo                                                      */
/*                                                                     */
/*  The TOC has always listed a "parallax" entry, but no section ever   */
/*  rendered that id — the link scrolled nowhere. This section is that  */
/*  missing target, so the anchor resolves.                            */
/*                                                                     */
/*  Two layers at different rates is the demo that actually shows the   */
/*  effect: parallax is only legible as *relative* motion, so a single  */
/*  drifting layer reads as a rendering glitch rather than as depth.    */
/*  Both are clamped — an unclamped rate on a long page shoves a layer  */
/*  well outside its box, and this section sits in the middle of a very */
/*  long page.                                                          */
/* ------------------------------------------------------------------ */

function ParallaxDemo() {
  return (
    <Section title="Parallax">
      <Card>
        <Stack gap="r4">
          <Text variant="body-3" color="muted">
            Translates its children vertically as the page scrolls, throttled with
            requestAnimationFrame. A positive rate moves the layer ahead of the page, a negative
            rate makes it lag. clamp bounds the drift. Scroll the page to see the two bands
            separate — and note it stands perfectly still under prefers-reduced-motion.
          </Text>
          <div className="relative overflow-hidden rounded-lg bg-surface-2" style={{ height: 220 }}>
            <Parallax rate={-0.15} clamp={40} className="absolute inset-x-0 top-1/2">
              <Center>
                <Text variant="h4" color="muted">
                  lagging layer · rate -0.15
                </Text>
              </Center>
            </Parallax>
            <Parallax rate={0.25} clamp={60} className="absolute inset-x-0 top-1/2">
              <Center>
                <Card padding="r4" shadow="md">
                  <Text variant="body-2">leading layer · rate 0.25</Text>
                </Card>
              </Center>
            </Parallax>
          </div>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function AnimationDemos() {
  return (
    <>
      <AnimatePresenceDemo />
      <ViewTransitionDemo />
      <ParallaxDemo />
    </>
  );
}
