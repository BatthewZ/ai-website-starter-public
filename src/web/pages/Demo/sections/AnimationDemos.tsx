import { useCallback, useState } from "react";

import { AnimatePresence, ViewTransition } from "@/web/components/animation";
import { Stack } from "@/web/components/layout";
import { Button, Card, Text } from "@/web/components/ui";

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
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function AnimationDemos() {
  return (
    <>
      <AnimatePresenceDemo />
      <ViewTransitionDemo />
    </>
  );
}
