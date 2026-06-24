import { Card, Collapsible, Row, Stack, Text } from "@batthewz/response-ui-react-components";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Section, SubSection } from "./helpers";

function CollapsibleDemo() {
  const [open, setOpen] = useState(true);

  return (
    <Section title="Collapsible" id="collapsible">
      <SubSection label="Single expand/collapse panel">
        <Card className="max-w-md">
          <Collapsible open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger className="flex w-full items-center justify-between gap-r4">
              <Text weight="semibold">Shipping details</Text>
              <ChevronDown
                size={18}
                style={{
                  transition: "transform 150ms ease",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Stack gap="r5" className="pt-r4">
                <Row className="justify-between">
                  <Text variant="body-3" color="secondary">
                    Carrier
                  </Text>
                  <Text variant="body-3">Express · 2-day</Text>
                </Row>
                <Row className="justify-between">
                  <Text variant="body-3" color="secondary">
                    Tracking
                  </Text>
                  <Text variant="body-3" className="font-mono">
                    1Z999AA10123456784
                  </Text>
                </Row>
                <Row className="justify-between">
                  <Text variant="body-3" color="secondary">
                    Estimated
                  </Text>
                  <Text variant="body-3">Mar 3, 2027</Text>
                </Row>
              </Stack>
            </Collapsible.Content>
          </Collapsible>
        </Card>
      </SubSection>
    </Section>
  );
}

export function NavigationExtraDemos() {
  return <CollapsibleDemo />;
}
