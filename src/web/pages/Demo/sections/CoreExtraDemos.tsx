import {
  Card,
  CodeBlock,
  CopyButton,
  Divider,
  Kbd,
  Row,
  Stack,
  Text,
} from "@batthewz/response-ui-react-components";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  CodeBlock                                                          */
/* ------------------------------------------------------------------ */

const SAMPLE_CODE = `import { Button, useToast } from "@batthewz/response-ui-react-components";

export function SaveButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast("Saved!")}>
      Save changes
    </Button>
  );
}`;

function CodeBlockDemo() {
  return (
    <Section title="Code Block" id="codeblock">
      <SubSection label="With filename, line numbers & copy button">
        <CodeBlock
          code={SAMPLE_CODE}
          language="tsx"
          filename="SaveButton.tsx"
          showLineNumbers
          copyable
        />
      </SubSection>

      <SubSection label="Inline snippet, no chrome">
        <CodeBlock code={`bun add @batthewz/response-ui-react-components`} language="bash" />
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  CopyButton                                                         */
/* ------------------------------------------------------------------ */

const COPY_ROWS = [
  { value: "npm i @batthewz/response-ui-react-components" },
  { value: "#6366f1", copiedLabel: "Color copied" },
];

function CopyButtonDemo() {
  return (
    <Section title="Copy Button" id="copybutton">
      <SubSection label="Click to copy — shows confirmation feedback">
        <Card className="max-w-lg">
          <Stack gap="r5">
            {COPY_ROWS.map((row, i) => (
              <Stack key={row.value} gap="r5">
                {i > 0 && <Divider />}
                <Row justify="between" align="center" gap="r4">
                  <Text variant="body-2" className="truncate font-mono">
                    {row.value}
                  </Text>
                  <CopyButton value={row.value} copiedLabel={row.copiedLabel} />
                </Row>
              </Stack>
            ))}
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Kbd                                                                */
/* ------------------------------------------------------------------ */

const SHORTCUTS: { label: string; keys: string[] }[] = [
  { label: "Open command palette", keys: ["⌘", "K"] },
  { label: "Save", keys: ["Ctrl", "S"] },
  { label: "Dismiss", keys: ["Esc"] },
];

function KbdDemo() {
  return (
    <Section title="Kbd" id="kbd">
      <SubSection label="Keyboard-key indicators">
        <Card className="max-w-sm">
          <Stack gap="r5">
            {SHORTCUTS.map(({ label, keys }) => (
              <Row key={label} justify="between" align="center" gap="r4">
                <Text variant="body-2" color="secondary">
                  {label}
                </Text>
                <Row gap="r6" align="center">
                  {keys.map((k) => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </Row>
              </Row>
            ))}
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function CoreExtraDemos() {
  return (
    <>
      <CodeBlockDemo />
      <CopyButtonDemo />
      <KbdDemo />
    </>
  );
}
