import {
  Button,
  Card,
  Row,
  Stack,
  Stepper,
  Text,
  useToast,
  Wizard,
  type WizardStep,
} from "@batthewz/response-ui-react-components";
import { CreditCard, PackageCheck, Truck, UserRound } from "lucide-react";
import { useState } from "react";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Stepper                                                           */
/* ------------------------------------------------------------------ */

function StepperDemo() {
  const [activeStep, setActiveStep] = useState(1);
  const lastStep = 3;

  return (
    <Section title="Stepper" id="stepper">
      <SubSection label="Step progress indicator (click a step or use the buttons)">
        <Card>
          <Stack gap="r5">
            <Stepper activeStep={activeStep} onStepClick={setActiveStep}>
              <Stepper.Step title="Account" description="Your details" icon={<UserRound size={16} />} />
              <Stepper.Step title="Shipping" description="Address" icon={<Truck size={16} />} />
              <Stepper.Step title="Payment" description="Billing" icon={<CreditCard size={16} />} />
              <Stepper.Step title="Done" description="Confirm" icon={<PackageCheck size={16} />} />
            </Stepper>
            <Row gap="r5">
              <Button
                variant="secondary"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button
                disabled={activeStep === lastStep}
                onClick={() => setActiveStep((s) => Math.min(lastStep, s + 1))}
              >
                Next
              </Button>
            </Row>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Wizard                                                            */
/* ------------------------------------------------------------------ */

function WizardDemo() {
  const { toast } = useToast();

  const steps: WizardStep[] = [
    {
      title: "Workspace",
      description: "Name it",
      content: (
        <Stack gap="r5" className="py-r4">
          <Text weight="semibold">Create your workspace</Text>
          <Text variant="body-3" color="muted">
            Give your team a home. You can change this later in settings.
          </Text>
        </Stack>
      ),
    },
    {
      title: "Invite",
      description: "Add teammates",
      content: (
        <Stack gap="r5" className="py-r4">
          <Text weight="semibold">Invite your team</Text>
          <Text variant="body-3" color="muted">
            Add the people you collaborate with most — or skip and do it later.
          </Text>
        </Stack>
      ),
    },
    {
      title: "Finish",
      description: "Review",
      content: (
        <Stack gap="r5" className="py-r4">
          <Text weight="semibold">You're all set</Text>
          <Text variant="body-3" color="muted">
            Press Finish to create your workspace and head to the dashboard.
          </Text>
        </Stack>
      ),
    },
  ];

  return (
    <Section title="Wizard" id="wizard">
      <SubSection label="Multi-step flow — Stepper header + Back / Next / Finish">
        <Card>
          <Wizard steps={steps} onComplete={() => toast("Workspace created!", { variant: "success" })} />
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function PatternExtraDemos() {
  return (
    <>
      <StepperDemo />
      <WizardDemo />
    </>
  );
}
