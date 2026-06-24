import {
  Button,
  Card,
  ColorPicker,
  Combobox,
  Field,
  FieldError,
  FormActions,
  FormProvider,
  Input,
  Label,
  MultiSelect,
  type MultiSelectOption,
  NumberInput,
  OTPInput,
  RangeSlider,
  type RangeSliderValue,
  Repeater,
  Row,
  Select,
  Slider,
  Stack,
  Switch,
  TagInput,
  Text,
  useForm,
  useToast,
} from "@batthewz/response-ui-react-components";
import { useState } from "react";
import { z } from "zod";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Combobox — searchable single-select                               */
/* ------------------------------------------------------------------ */

const FRAMEWORKS = [
  "Astro",
  "Next.js",
  "Nuxt",
  "Remix",
  "SolidStart",
  "SvelteKit",
  "TanStack Start",
  "Vite",
];

function ComboboxDemo() {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const filtered = FRAMEWORKS.filter((f) =>
    f.toLowerCase().includes(inputValue.trim().toLowerCase()),
  );

  return (
    <Section title="Combobox" id="combobox">
      <SubSection label="Type to filter, ↑/↓ to navigate, Enter to select">
        <Card className="max-w-sm">
          <Stack gap="r4">
            <Combobox
              value={value}
              onValueChange={(v) => {
                setValue(v);
                if (v) setInputValue(v);
              }}
              inputValue={inputValue}
              onInputValueChange={setInputValue}
            >
              <Combobox.Input placeholder="Search frameworks…" aria-label="Framework" />
              <Combobox.Content>
                {filtered.map((f, i) => (
                  <Combobox.Item key={f} index={i} value={f}>
                    {f}
                  </Combobox.Item>
                ))}
                {filtered.length === 0 && <Combobox.Empty>No frameworks match.</Combobox.Empty>}
              </Combobox.Content>
            </Combobox>
            <Text variant="body-3" color="muted">
              Selected: {value ?? "none"}
            </Text>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  MultiSelect                                                        */
/* ------------------------------------------------------------------ */

const SKILL_OPTIONS: MultiSelectOption[] = [
  { value: "react", label: "React" },
  { value: "ts", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "css", label: "CSS" },
  { value: "figma", label: "Figma" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

function MultiSelectDemo() {
  const [skills, setSkills] = useState<string[]>(["react", "ts"]);

  return (
    <Section title="Multi-Select" id="multiselect">
      <SubSection label="Chip-filled control with inline search (max 5)">
        <Card className="max-w-md">
          <MultiSelect
            options={SKILL_OPTIONS}
            value={skills}
            onValueChange={setSkills}
            maxItems={5}
            placeholder="Pick skills…"
            aria-label="Skills"
          />
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  ColorPicker                                                        */
/* ------------------------------------------------------------------ */

function ColorPickerDemo() {
  const [color, setColor] = useState("#6366f1");

  return (
    <Section title="Color Picker" id="colorpicker">
      <SubSection label="HSV surface, hue rail, hex field & presets">
        <Card>
          <Row gap="r4" align="center">
            <ColorPicker
              value={color}
              onValueChange={setColor}
              aria-label="Brand color"
              presets={["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9", "#ef4444"]}
            />
            <Stack gap="r6">
              <Text variant="body-2" weight="semibold" className="font-mono">
                {color}
              </Text>
              <Text variant="body-3" color="muted">
                Current value
              </Text>
            </Stack>
          </Row>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  NumberInput                                                        */
/* ------------------------------------------------------------------ */

function NumberInputDemo() {
  const [qty, setQty] = useState<number | null>(3);
  const [price, setPrice] = useState<number | null>(9.99);

  return (
    <Section title="Number Input" id="numberinput">
      <Row gap="r5" wrap align="start">
        <SubSection label="Quantity (0–10, step 1)">
          <Card className="w-48">
            <NumberInput value={qty} onValueChange={setQty} min={0} max={10} step={1} />
          </Card>
        </SubSection>
        <SubSection label="Price (step 0.5, 2 dp)">
          <Card className="w-48">
            <NumberInput value={price} onValueChange={setPrice} min={0} step={0.5} precision={2} />
          </Card>
        </SubSection>
      </Row>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  OTPInput                                                           */
/* ------------------------------------------------------------------ */

function OTPInputDemo() {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");

  return (
    <Section title="OTP Input" id="otpinput">
      <SubSection label="6-digit segmented passcode — paste-aware">
        <Card>
          <Stack gap="r4">
            <OTPInput
              className="w-fit"
              length={6}
              value={otp}
              onValueChange={setOtp}
              onComplete={(v) => toast(`Code entered: ${v}`, { variant: "success" })}
            />
            <Text variant="body-3" color="muted">
              Entered: {otp || "—"}
            </Text>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Slider                                                             */
/* ------------------------------------------------------------------ */

function SliderDemo() {
  const [volume, setVolume] = useState(60);

  return (
    <Section title="Slider" id="slider">
      <SubSection label="Single-value slider">
        <Card className="max-w-md">
          <Stack gap="r3">
            <Slider value={volume} onValueChange={setVolume} min={0} max={100} />
            <Text variant="body-3" color="muted">
              Volume: {volume}%
            </Text>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  RangeSlider                                                        */
/* ------------------------------------------------------------------ */

function RangeSliderDemo() {
  const [range, setRange] = useState<RangeSliderValue>([200, 800]);

  return (
    <Section title="Range Slider" id="rangeslider">
      <SubSection label="Two-thumb range (min distance 50)">
        <Card className="max-w-md">
          <Stack gap="r3">
            <RangeSlider
              value={range}
              onValueChange={setRange}
              min={0}
              max={1000}
              step={10}
              minDistance={50}
            />
            <Text variant="body-3" color="muted">
              Price range: ${range[0]} – ${range[1]}
            </Text>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Switch                                                             */
/* ------------------------------------------------------------------ */

function SwitchDemo() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <Section title="Switch" id="switch">
      <SubSection label="Toggle switches — md & sm">
        <Card className="max-w-md">
          <Stack gap="r4">
            <Row gap="r4" align="center" className="justify-between">
              <Label>Push notifications</Label>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </Row>
            <Row gap="r4" align="center" className="justify-between">
              <Label>Marketing emails</Label>
              <Switch size="sm" checked={marketing} onCheckedChange={setMarketing} />
            </Row>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  TagInput                                                           */
/* ------------------------------------------------------------------ */

function TagInputDemo() {
  const [tags, setTags] = useState<string[]>(["design", "frontend"]);

  return (
    <Section title="Tag Input" id="taginput">
      <SubSection label="Free-form tags — Enter/comma to add, Backspace to remove (max 6)">
        <Card className="max-w-md">
          <TagInput
            value={tags}
            onValueChange={setTags}
            maxTags={6}
            placeholder="Add a tag…"
            validateTag={(t) => (t.length <= 16 ? true : "Tags must be 16 characters or fewer")}
          />
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Validated form — headless useForm + Zod + Repeater                */
/* ------------------------------------------------------------------ */

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  role: z.string().min(1, "Please choose a role"),
  newsletter: z.boolean(),
  links: z
    .array(z.object({ url: z.url("Enter a valid URL (https://…)") }))
    .min(1, "Add at least one link"),
});

type ProfileValues = z.infer<typeof profileSchema>;

function ValidatedFormDemo() {
  const { toast } = useToast();

  const form = useForm<ProfileValues>({
    defaultValues: { name: "", email: "", role: "", newsletter: false, links: [{ url: "" }] },
    schema: profileSchema,
    mode: "onBlur",
    onSubmit: (values) => {
      toast(`Saved profile for ${values.name}`, { variant: "success" });
    },
  });

  return (
    <Section title="Validated Form (useForm + Zod)" id="validated-form">
      <SubSection label="Headless form layer — Standard Schema validation against your existing Zod">
        <Card className="max-w-lg">
          <FormProvider form={form}>
            <form {...form.props}>
              <Stack gap="r4">
                <Field name="name">
                  <Label>Name</Label>
                  <Input placeholder="Ada Lovelace" {...form.field("name")} />
                  <FieldError />
                </Field>

                <Field name="email">
                  <Label>Email</Label>
                  <Input type="email" placeholder="ada@example.com" {...form.field("email")} />
                  <FieldError />
                </Field>

                <Field name="role">
                  <Label>Role</Label>
                  <Select {...form.field("role")}>
                    <option value="">Choose a role…</option>
                    <option value="engineer">Engineer</option>
                    <option value="designer">Designer</option>
                    <option value="pm">Product Manager</option>
                  </Select>
                  <FieldError />
                </Field>

                <Field>
                  <Label>Links</Label>
                  <Repeater
                    form={form}
                    name="links"
                    defaultItem={() => ({ url: "" })}
                    addLabel="Add link"
                    min={1}
                    max={4}
                    reorderable
                  >
                    {({ name }) => (
                      <Field name={`${name}.url`} className="flex-1">
                        <Input placeholder="https://…" {...form.field(`${name}.url`)} />
                        <FieldError />
                      </Field>
                    )}
                  </Repeater>
                </Field>

                <Row gap="r4" align="center" className="justify-between">
                  <Label>Subscribe to the newsletter</Label>
                  <Switch
                    checked={Boolean(form.watch("newsletter"))}
                    onCheckedChange={(c) => form.setValue("newsletter", c)}
                  />
                </Row>

                <FormActions>
                  <Button type="submit">Save profile</Button>
                  <Button type="button" variant="secondary" onClick={() => form.reset()}>
                    Reset
                  </Button>
                </FormActions>
              </Stack>
            </form>
          </FormProvider>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function FormComponentDemos() {
  return (
    <>
      <ComboboxDemo />
      <MultiSelectDemo />
      <ColorPickerDemo />
      <NumberInputDemo />
      <OTPInputDemo />
      <SliderDemo />
      <RangeSliderDemo />
      <SwitchDemo />
      <TagInputDemo />
      <ValidatedFormDemo />
    </>
  );
}
