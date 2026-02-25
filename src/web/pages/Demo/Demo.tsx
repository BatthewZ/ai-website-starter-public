import { Clock, EllipsisVertical, Settings, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ScrollReveal, Stagger } from "@/web/components/animation";
import {
  Checkbox,
  Field,
  FieldError,
  FormActions,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
} from "@/web/components/form";
import { Center, Container, Divider, Row, Spacer, Stack } from "@/web/components/layout";
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Carousel,
  Dialog,
  Hero,
  IconButton,
  MasonryGrid,
  MediaCard,
  ProgressBar,
  Spinner,
  Spotlight,
  StatCard,
  Swimlane,
  Tabs,
  Text,
  ThemeSwitcher,
  Timeline,
  useToast,
} from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="r4">
      <Text variant="h4">{title}</Text>
      <Divider />
      {children}
    </Stack>
  );
}

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack gap="r5">
      <Text variant="body-2" color="secondary" weight="semibold">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

export function Demo() {
  useDocumentTitle("Component Demo");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formAgree, setFormAgree] = useState(false);
  const [formPlan, setFormPlan] = useState("free");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Name is required";
    if (!formEmail.trim()) errors.email = "Email is required";
    else if (!formEmail.includes("@")) errors.email = "Invalid email address";
    if (!formRole) errors.role = "Please select a role";
    if (!formAgree) errors.agree = "You must agree to continue";

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      toast("Form submitted successfully!", {
        variant: "success",
        title: "Success",
      });
    }
  }

  return (
    <Stack className="min-h-screen bg-surface-1">
      {/* Hero */}
      <Hero size="sm" overlay>
        <Hero.Background
          style={{
            background:
              "linear-gradient(135deg, var(--C-PRIMARY-HOVER) 0%, color-mix(in srgb, var(--C-ACCENT), black 50%) 100%)",
          }}
        />
        <Hero.Content animate animation="fade-up">
          <Row justify="between" align="center" className="w-full flex-wrap">
            <Text variant="h1" color="on-primary">
              Component Library
            </Text>

            <Row>
              <Button variant="ghost-inverse" size="sm" onClick={() => void navigate("/dashboard")}>
                Back to Dashboard
              </Button>

              <Button variant="ghost-inverse" size="sm" onClick={() => void navigate("/showcase")}>
                Showcase
              </Button>
            </Row>
          </Row>
          <Text variant="body-1" color="on-primary">
            A showcase of UI Primitives for the project
          </Text>
        </Hero.Content>
      </Hero>

      <Container size="xl">
        <Stack gap="r2" className="py-r2">
          {/* ── Theme Switcher ── */}
          <div className="sticky top-0 z-50">
            <Card padding="r4" className="bg-surface-0/80 backdrop-blur-md flex justify-center">
              <ThemeSwitcher />
            </Card>
          </div>

          {/* ── Typography ── */}
          <Section title="Typography">
            <Card>
              <Stack gap="r4">
                <Text variant="h1">Heading 1</Text>
                <Text variant="h2">Heading 2</Text>
                <Text variant="h3">Heading 3</Text>
                <Text variant="h4">Heading 4</Text>
                <Text variant="h5">Heading 5</Text>
                <Text variant="h6">Heading 6</Text>
                <Divider />
                <Text variant="body-1">
                  Body 1 — The quick brown fox jumps over the lazy dog. This is the default body
                  text size used for primary content.
                </Text>
                <Text variant="body-2">
                  Body 2 — A slightly smaller text variant, often used for secondary information and
                  metadata.
                </Text>
                <Text variant="body-3">
                  Body 3 — The smallest body text, useful for captions, labels, and fine print.
                </Text>
                <Divider />
                <Row gap="r3" wrap>
                  <Text color="primary">Primary</Text>
                  <Text color="secondary">Secondary</Text>
                  <Text color="muted">Muted</Text>
                  <Text color="inverse" className="bg-primary px-r5 py-r6 rounded-md">
                    Inverse
                  </Text>
                </Row>
                <Row gap="r3" wrap>
                  <Text weight="semibold">Semibold weight</Text>
                  <Text weight="bold">Bold weight</Text>
                </Row>
              </Stack>
            </Card>
          </Section>

          {/* ── Buttons ── */}
          <Section title="Buttons">
            <Card>
              <Stack gap="r4">
                <SubSection label="Variants">
                  <Row gap="r5" wrap>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="link">Link</Button>
                  </Row>
                </SubSection>
                <SubSection label="Sizes">
                  <Row gap="r5" wrap align="end">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </Row>
                </SubSection>
                <SubSection label="Disabled">
                  <Row gap="r5" wrap>
                    <Button disabled>Primary</Button>
                    <Button variant="secondary" disabled>
                      Secondary
                    </Button>
                    <Button variant="ghost" disabled>
                      Ghost
                    </Button>
                    <Button variant="danger" disabled>
                      Danger
                    </Button>
                  </Row>
                </SubSection>
                <SubSection label="Icon Button">
                  <Row gap="r5">
                    <IconButton aria-label="Close">
                      <X size={20} />
                    </IconButton>
                    <IconButton aria-label="Settings">
                      <Settings size={20} />
                    </IconButton>
                    <IconButton aria-label="More" disabled>
                      <EllipsisVertical size={20} />
                    </IconButton>
                  </Row>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Badges ── */}
          <Section title="Badges">
            <Card>
              <Row gap="r5" wrap>
                <Badge>Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </Row>
            </Card>
          </Section>

          {/* ── Alerts ── */}
          <Section title="Alerts">
            <Card>
              <Stack gap="r4">
                <Alert variant="info">
                  This is an informational alert — useful for tips and general notices.
                </Alert>
                <Alert variant="success">
                  Operation completed successfully. Your changes have been saved.
                </Alert>
                <Alert variant="warning">
                  Your session will expire in 5 minutes. Please save your work.
                </Alert>
                <Alert variant="error">
                  Something went wrong. Please try again or contact support.
                </Alert>
              </Stack>
            </Card>
          </Section>

          {/* ── Toasts ── */}
          <Section title="Toasts">
            <Card>
              <Text variant="body-2" color="secondary" className="mb-r5">
                Click a button to trigger a toast notification in the corner.
              </Text>
              <Row gap="r5" wrap>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast("Here is some useful information.", {
                      variant: "info",
                      title: "Info",
                    })
                  }
                >
                  Info Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast("Your changes have been saved.", {
                      variant: "success",
                      title: "Success",
                    })
                  }
                >
                  Success Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast("Disk space is running low.", {
                      variant: "warning",
                      title: "Warning",
                    })
                  }
                >
                  Warning Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast("Failed to save. Please try again.", {
                      variant: "error",
                      title: "Error",
                    })
                  }
                >
                  Error Toast
                </Button>
              </Row>
            </Card>
          </Section>

          {/* ── Cards ── */}
          <Section title="Cards">
            <Row gap="r4" wrap align="start">
              <Card padding="r4" shadow="sm" className="flex-1 min-w-50">
                <Stack gap="r5">
                  <Text variant="h6">Small Shadow</Text>
                  <Text variant="body-2" color="secondary">
                    Padding r4, shadow sm. Subtle elevation for inline content.
                  </Text>
                </Stack>
              </Card>
              <Card padding="r3" shadow="md" className="flex-1 min-w-50">
                <Stack gap="r5">
                  <Text variant="h6">Medium Shadow</Text>
                  <Text variant="body-2" color="secondary">
                    Padding r3, shadow md. The default card style for most use cases.
                  </Text>
                </Stack>
              </Card>
              <Card padding="r2" shadow="lg" className="flex-1 min-w-50">
                <Stack gap="r5">
                  <Text variant="h6">Large Shadow</Text>
                  <Text variant="body-2" color="secondary">
                    Padding r2, shadow lg. High emphasis for modals or featured content.
                  </Text>
                </Stack>
              </Card>
            </Row>
          </Section>

          {/* ── Dialog ── */}
          <Section title="Dialog">
            <Card>
              <Stack gap="r4">
                <Text variant="body-2" color="secondary">
                  A modal dialog built on the native HTML dialog element with backdrop and
                  escape-to-close.
                </Text>
                <div>
                  <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                    Open Dialog
                  </Button>
                </div>
              </Stack>
            </Card>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <Stack gap="r4">
                <Text variant="h5">Confirm Action</Text>
                <Divider />
                <Text variant="body-2" color="secondary">
                  Are you sure you want to proceed? This is a demo dialog — no actual action will be
                  taken.
                </Text>
                <FormActions>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setDialogOpen(false);
                      toast("Action confirmed!", {
                        variant: "success",
                        title: "Done",
                      });
                    }}
                  >
                    Confirm
                  </Button>
                </FormActions>
              </Stack>
            </Dialog>
          </Section>

          {/* ── Spinner ── */}
          <Section title="Spinner">
            <Card>
              <Row gap="r3" align="end">
                <Stack gap="r5" className="items-center">
                  <Spinner size="sm" />
                  <Text variant="body-3" color="muted">
                    Small
                  </Text>
                </Stack>
                <Stack gap="r5" className="items-center">
                  <Spinner size="md" />
                  <Text variant="body-3" color="muted">
                    Medium
                  </Text>
                </Stack>
                <Stack gap="r5" className="items-center">
                  <Spinner size="lg" />
                  <Text variant="body-3" color="muted">
                    Large
                  </Text>
                </Stack>
              </Row>
            </Card>
          </Section>

          {/* ── Divider ── */}
          <Section title="Dividers">
            <Card>
              <Stack gap="r4">
                <Text variant="body-2" color="secondary">
                  Horizontal
                </Text>
                <Divider />
                <Text variant="body-2" color="secondary">
                  Content between dividers
                </Text>
                <Divider />
                <Text variant="body-2" color="secondary">
                  Vertical (inside a row)
                </Text>
                <Row gap="r5" className="h-12">
                  <Text variant="body-2">Left</Text>
                  <Divider orientation="vertical" />
                  <Text variant="body-2">Center</Text>
                  <Divider orientation="vertical" />
                  <Text variant="body-2">Right</Text>
                </Row>
              </Stack>
            </Card>
          </Section>

          {/* ── Layout: Stack & Row ── */}
          <Section title="Layout — Stack & Row">
            <Card>
              <Stack gap="r4">
                <SubSection label="Stack (vertical, gap r5)">
                  <Stack gap="r5">
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-2">Item 1</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-2">Item 2</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-2">Item 3</Text>
                    </div>
                  </Stack>
                </SubSection>

                <SubSection label="Row (horizontal, various alignments)">
                  <Row gap="r5" justify="start">
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Start</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Aligned</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Left</Text>
                    </div>
                  </Row>
                  <Row gap="r5" justify="center">
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Center</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Aligned</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Row</Text>
                    </div>
                  </Row>
                  <Row gap="r5" justify="between">
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Space</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Between</Text>
                    </div>
                    <div className="bg-surface-2 rounded-md px-r4 py-r5">
                      <Text variant="body-3">Items</Text>
                    </div>
                  </Row>
                </SubSection>

                <SubSection label="Row with Spacer">
                  <Row gap="r5" className="bg-surface-2 rounded-md px-r4 py-r5">
                    <Text variant="body-2">Logo</Text>
                    <Spacer />
                    <Text variant="body-2" color="secondary">
                      Pushed to the right
                    </Text>
                  </Row>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Layout: Container Sizes ── */}
          <Section title="Layout — Container Sizes">
            <Stack gap="r5">
              {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
                <Container key={size} size={size}>
                  <div className="bg-surface-2 border border-border-default rounded-md px-r4 py-r5">
                    <Text variant="body-3" color="secondary">
                      Container size=&quot;{size}&quot;
                    </Text>
                  </div>
                </Container>
              ))}
            </Stack>
          </Section>

          {/* ── Layout: Center ── */}
          <Section title="Layout — Center">
            <Card>
              <Center className="h-32 bg-surface-2 rounded-md">
                <Text variant="body-2" color="secondary">
                  Centered content
                </Text>
              </Center>
            </Card>
          </Section>

          {/* ── Form Components ── */}
          <Section title="Form Components">
            <Card>
              <form onSubmit={handleFormSubmit}>
                <Stack gap="r4">
                  <Text variant="h5">Sample Form</Text>
                  <Divider />

                  <Field>
                    <Label htmlFor="demo-name">Name</Label>
                    <Input
                      id="demo-name"
                      placeholder="Enter your name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      error={!!formErrors.name}
                    />
                    <FieldError>{formErrors.name}</FieldError>
                  </Field>

                  <Field>
                    <Label htmlFor="demo-email">Email</Label>
                    <Input
                      id="demo-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      error={!!formErrors.email}
                    />
                    <FieldError>{formErrors.email}</FieldError>
                  </Field>

                  <Field>
                    <Label htmlFor="demo-bio">Bio</Label>
                    <Textarea
                      id="demo-bio"
                      placeholder="Tell us about yourself..."
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="demo-role">Role</Label>
                    <Select
                      id="demo-role"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      error={!!formErrors.role}
                    >
                      <option value="">Select a role...</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="manager">Manager</option>
                      <option value="other">Other</option>
                    </Select>
                    <FieldError>{formErrors.role}</FieldError>
                  </Field>

                  <Field>
                    <Label>Plan</Label>
                    <Stack gap="r5">
                      <Label className="flex items-center gap-r5 cursor-pointer font-normal">
                        <Radio
                          name="plan"
                          value="free"
                          checked={formPlan === "free"}
                          onChange={() => setFormPlan("free")}
                        />
                        Free
                      </Label>
                      <Label className="flex items-center gap-r5 cursor-pointer font-normal">
                        <Radio
                          name="plan"
                          value="pro"
                          checked={formPlan === "pro"}
                          onChange={() => setFormPlan("pro")}
                        />
                        Pro
                      </Label>
                      <Label className="flex items-center gap-r5 cursor-pointer font-normal">
                        <Radio
                          name="plan"
                          value="enterprise"
                          checked={formPlan === "enterprise"}
                          onChange={() => setFormPlan("enterprise")}
                        />
                        Enterprise
                      </Label>
                    </Stack>
                  </Field>

                  <Field>
                    <Label className="flex items-center gap-r5 cursor-pointer">
                      <Checkbox
                        checked={formAgree}
                        onChange={(e) => setFormAgree(e.target.checked)}
                      />
                      I agree to the terms and conditions
                    </Label>
                    <FieldError>{formErrors.agree}</FieldError>
                  </Field>

                  <FormActions>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setFormName("");
                        setFormEmail("");
                        setFormBio("");
                        setFormRole("");
                        setFormPlan("free");
                        setFormAgree(false);
                        setFormErrors({});
                      }}
                    >
                      Reset
                    </Button>
                    <Button type="submit">Submit</Button>
                  </FormActions>
                </Stack>
              </form>
            </Card>
          </Section>

          {/* ── Form States ── */}
          <Section title="Form States">
            <Card>
              <Stack gap="r4">
                <SubSection label="Default">
                  <Input placeholder="Default input" />
                </SubSection>
                <SubSection label="Error">
                  <Input placeholder="Error input" error />
                </SubSection>
                <SubSection label="Disabled">
                  <Input placeholder="Disabled input" disabled />
                </SubSection>
                <SubSection label="Disabled Textarea">
                  <Textarea placeholder="Disabled textarea" disabled />
                </SubSection>
                <SubSection label="Disabled Select">
                  <Select disabled>
                    <option>Disabled select</option>
                  </Select>
                </SubSection>
                <SubSection label="Disabled Checkbox & Radio">
                  <Row gap="r4">
                    <Label className="flex items-center gap-r5 cursor-not-allowed opacity-50">
                      <Checkbox disabled />
                      Disabled
                    </Label>
                    <Label className="flex items-center gap-r5 cursor-not-allowed opacity-50">
                      <Checkbox disabled checked />
                      Disabled checked
                    </Label>
                    <Label className="flex items-center gap-r5 cursor-not-allowed opacity-50">
                      <Radio disabled />
                      Disabled
                    </Label>
                    <Label className="flex items-center gap-r5 cursor-not-allowed opacity-50">
                      <Radio disabled checked />
                      Disabled checked
                    </Label>
                  </Row>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Color Palette ── */}
          <Section title="Color Palette">
            <Card>
              <Stack gap="r4">
                <SubSection label="Brand">
                  <Row gap="r5" wrap>
                    <Swatch color="bg-primary" label="Primary" />
                    <Swatch color="bg-primary-hover" label="Primary Hover" />
                    <Swatch color="bg-accent" label="Accent" />
                    <Swatch color="bg-accent-hover" label="Accent Hover" />
                    <Swatch color="bg-secondary" label="Secondary" light />
                    <Swatch color="bg-secondary-hover" label="Secondary Hover" light />
                  </Row>
                </SubSection>
                <SubSection label="Surfaces">
                  <Row gap="r5" wrap>
                    <Swatch color="bg-surface-0" label="Surface 0" light />
                    <Swatch color="bg-surface-1" label="Surface 1" light />
                    <Swatch color="bg-surface-2" label="Surface 2" light />
                    <Swatch color="bg-surface-3" label="Surface 3" light />
                  </Row>
                </SubSection>
                <SubSection label="Status">
                  <Row gap="r5" wrap>
                    <Swatch color="bg-status-success" label="Success" />
                    <Swatch color="bg-status-warning" label="Warning" />
                    <Swatch color="bg-status-error" label="Error" />
                    <Swatch color="bg-status-info" label="Info" />
                  </Row>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Avatars ── */}
          <Section title="Avatars">
            <Card>
              <Stack gap="r4">
                <SubSection label="Sizes">
                  <Row gap="r5" align="center" wrap>
                    <Avatar name="Alice Chen" size="xs" />
                    <Avatar name="Bob Smith" size="sm" />
                    <Avatar name="Charlie Davis" size="md" />
                    <Avatar name="Diana Evans" size="lg" />
                    <Avatar name="Edward Fox" size="xl" />
                  </Row>
                </SubSection>
                <SubSection label="Status indicators">
                  <Row gap="r5" align="center">
                    <Avatar name="Online User" status="online" />
                    <Avatar name="Away User" status="away" />
                    <Avatar name="Offline User" status="offline" />
                  </Row>
                </SubSection>
                <SubSection label="Avatar Group">
                  <AvatarGroup max={4}>
                    <Avatar name="Alice Chen" />
                    <Avatar name="Bob Smith" />
                    <Avatar name="Charlie Davis" />
                    <Avatar name="Diana Evans" />
                    <Avatar name="Edward Fox" />
                    <Avatar name="Fiona Grant" />
                  </AvatarGroup>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Progress Bars ── */}
          <Section title="Progress Bars">
            <Card>
              <Stack gap="r4">
                <SubSection label="Variants">
                  <Stack gap="r5">
                    <ProgressBar value={65} />
                    <ProgressBar value={45} variant="gradient" />
                    <ProgressBar value={80} variant="striped" />
                  </Stack>
                </SubSection>
                <SubSection label="Colors">
                  <Stack gap="r5">
                    <ProgressBar value={75} color="accent" />
                    <ProgressBar value={100} color="success" />
                    <ProgressBar value={40} color="warning" />
                    <ProgressBar value={25} color="error" />
                  </Stack>
                </SubSection>
                <SubSection label="Sizes">
                  <Stack gap="r5">
                    <ProgressBar value={60} size="sm" />
                    <ProgressBar value={60} size="md" />
                    <ProgressBar value={60} size="lg" />
                  </Stack>
                </SubSection>
                <SubSection label="With Label">
                  <Stack gap="r5">
                    <Row justify="between">
                      <ProgressBar.Label>Uploading files...</ProgressBar.Label>
                      <ProgressBar.Value>72%</ProgressBar.Value>
                    </Row>
                    <ProgressBar value={72} variant="gradient" animate />
                  </Stack>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Stat Cards ── */}
          <Section title="Stat Cards">
            <ScrollReveal>
              <Stagger>
                <Row gap="r4" wrap>
                  <StatCard className="flex-1 min-w-40">
                    <StatCard.Icon>
                      <Users size={20} />
                    </StatCard.Icon>
                    <StatCard.Value
                      animateValue
                      from={0}
                      to={12847}
                      format={(v) => Math.round(v).toLocaleString()}
                    />
                    <StatCard.Label>Total Users</StatCard.Label>
                    <StatCard.Trend value={12.5} direction="up" />
                  </StatCard>
                  <StatCard className="flex-1 min-w-40">
                    <StatCard.Icon>
                      <TrendingUp size={20} />
                    </StatCard.Icon>
                    <StatCard.Value
                      animateValue
                      from={0}
                      to={98.7}
                      format={(v) => `${v.toFixed(1)}%`}
                    />
                    <StatCard.Label>Uptime</StatCard.Label>
                    <StatCard.Trend value={0.3} direction="up" />
                  </StatCard>
                  <StatCard className="flex-1 min-w-40">
                    <StatCard.Icon>
                      <Clock size={20} />
                    </StatCard.Icon>
                    <StatCard.Value
                      animateValue
                      from={0}
                      to={42}
                      format={(v) => String(Math.round(v))}
                    />
                    <StatCard.Label>Avg Response (ms)</StatCard.Label>
                    <StatCard.Trend value={5.2} direction="down" />
                  </StatCard>
                </Row>
              </Stagger>
            </ScrollReveal>
          </Section>

          {/* ── Tabs ── */}
          <Section title="Tabs">
            <Card>
              <Stack gap="r4">
                <SubSection label="Underline variant">
                  <Tabs defaultValue="overview" variant="underline">
                    <Tabs.List>
                      <Tabs.Tab value="overview">Overview</Tabs.Tab>
                      <Tabs.Tab value="features">Features</Tabs.Tab>
                      <Tabs.Tab value="pricing">Pricing</Tabs.Tab>
                      <Tabs.Tab value="disabled" disabled>
                        Disabled
                      </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="overview">
                      <Text variant="body-2" color="secondary">
                        Overview panel content. Tabs support keyboard navigation with arrow keys.
                      </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="features">
                      <Text variant="body-2" color="secondary">
                        Features panel content. Each tab panel is lazy-rendered.
                      </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="pricing">
                      <Text variant="body-2" color="secondary">
                        Pricing panel content with proper ARIA roles.
                      </Text>
                    </Tabs.Panel>
                  </Tabs>
                </SubSection>
                <SubSection label="Pill variant">
                  <Tabs defaultValue="tab1" variant="pill">
                    <Tabs.List>
                      <Tabs.Tab value="tab1">First</Tabs.Tab>
                      <Tabs.Tab value="tab2">Second</Tabs.Tab>
                      <Tabs.Tab value="tab3">Third</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="tab1">
                      <Text variant="body-2" color="secondary">
                        First tab content.
                      </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="tab2">
                      <Text variant="body-2" color="secondary">
                        Second tab content.
                      </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="tab3">
                      <Text variant="body-2" color="secondary">
                        Third tab content.
                      </Text>
                    </Tabs.Panel>
                  </Tabs>
                </SubSection>
                <SubSection label="Enclosed variant">
                  <Tabs defaultValue="a" variant="enclosed">
                    <Tabs.List>
                      <Tabs.Tab value="a">Alpha</Tabs.Tab>
                      <Tabs.Tab value="b">Beta</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="a">
                      <Text variant="body-2" color="secondary">
                        Alpha panel.
                      </Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="b">
                      <Text variant="body-2" color="secondary">
                        Beta panel.
                      </Text>
                    </Tabs.Panel>
                  </Tabs>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Accordion ── */}
          <Section title="Accordion">
            <Card>
              <Stack gap="r4">
                <SubSection label="Single mode (one item at a time)">
                  <Accordion mode="single" defaultValue="item-1">
                    <Accordion.Item value="item-1">
                      <Accordion.Trigger>What is this starter template?</Accordion.Trigger>
                      <Accordion.Content>
                        <Text variant="body-2" color="secondary">
                          A full-stack Cloudflare Workers starter with Hono API, React SPA, Better
                          Auth, Drizzle ORM, and Zod validation.
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="item-2">
                      <Accordion.Trigger>How does theming work?</Accordion.Trigger>
                      <Accordion.Content>
                        <Text variant="body-2" color="secondary">
                          All visual values go through CSS custom properties. Swap themes by
                          overriding :root variables — zero component code changes.
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="item-3">
                      <Accordion.Trigger>Are animations accessible?</Accordion.Trigger>
                      <Accordion.Content>
                        <Text variant="body-2" color="secondary">
                          All animation components respect prefers-reduced-motion. Animations are
                          disabled or minimized for users who prefer reduced motion.
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </SubSection>
                <SubSection label="Multiple mode">
                  <Accordion mode="multiple">
                    <Accordion.Item value="m-1">
                      <Accordion.Trigger>First section</Accordion.Trigger>
                      <Accordion.Content>
                        <Text variant="body-2" color="secondary">
                          Multiple items can be open at once.
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item value="m-2">
                      <Accordion.Trigger>Second section</Accordion.Trigger>
                      <Accordion.Content>
                        <Text variant="body-2" color="secondary">
                          Try opening this alongside the first.
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </SubSection>
              </Stack>
            </Card>
          </Section>

          {/* ── Media Cards ── */}
          <Section title="Media Cards">
            <Row gap="r4" wrap align="start">
              <MediaCard orientation="portrait" className="w-48">
                <MediaCard.Image
                  alt="Portrait card"
                  style={{
                    background: "linear-gradient(135deg, var(--C-PRIMARY), var(--C-ACCENT))",
                  }}
                />
                <MediaCard.Badge>
                  <Badge>New</Badge>
                </MediaCard.Badge>
                <MediaCard.Overlay />
                <MediaCard.Content>
                  <Text variant="body-2" color="inverse" weight="semibold">
                    Portrait Card
                  </Text>
                  <Text variant="body-3" color="inverse" style={{ opacity: 0.8 }}>
                    Poster aspect ratio
                  </Text>
                </MediaCard.Content>
              </MediaCard>
              <MediaCard orientation="landscape" className="w-72">
                <MediaCard.Image
                  alt="Landscape card"
                  style={{
                    background: "linear-gradient(135deg, var(--C-ACCENT), var(--C-PRIMARY))",
                  }}
                />
                <MediaCard.Overlay />
                <MediaCard.Content>
                  <Text variant="body-2" color="inverse" weight="semibold">
                    Landscape Card
                  </Text>
                  <Text variant="body-3" color="inverse" style={{ opacity: 0.8 }}>
                    Widescreen ratio
                  </Text>
                </MediaCard.Content>
              </MediaCard>
              <MediaCard orientation="square" className="w-48">
                <MediaCard.Image
                  alt="Square card"
                  style={{
                    background: "linear-gradient(45deg, var(--C-STATUS-INFO), var(--C-ACCENT))",
                  }}
                />
                <MediaCard.Overlay />
                <MediaCard.Content>
                  <Text variant="body-2" color="inverse" weight="semibold">
                    Square Card
                  </Text>
                </MediaCard.Content>
              </MediaCard>
            </Row>
          </Section>

          {/* ── Carousel ── */}
          <Section title="Carousel">
            <Carousel title={<Text variant="h6">Featured Items</Text>}>
              <Carousel.Track>
                {Array.from({ length: 8 }, (_, i) => (
                  <Carousel.Item key={i}>
                    <Card padding="r4" className="min-w-48 m-1">
                      <Stack gap="r5">
                        <div
                          className="h-24 rounded-md"
                          style={{ background: `hsl(${i * 45}, 70%, 60%)` }}
                        />
                        <Text variant="body-2" weight="semibold">
                          Item {i + 1}
                        </Text>
                        <Text variant="body-3" color="secondary">
                          Carousel slide content
                        </Text>
                      </Stack>
                    </Card>
                  </Carousel.Item>
                ))}
              </Carousel.Track>
            </Carousel>
          </Section>

          {/* ── Swimlane ── */}
          <Section title="Swimlane">
            <Swimlane title="Trending Now" subtitle="Most popular items this week" viewAllHref="#">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} padding="r4" className="min-w-44 not-first:mt-r4">
                  <Stack gap="r5">
                    <div
                      className="h-20 rounded-md"
                      style={{ background: `hsl(${200 + i * 25}, 65%, 55%)` }}
                    />
                    <Text variant="body-2" weight="semibold">
                      Trending #{i + 1}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Swimlane>
          </Section>

          {/* ── Spotlight ── */}
          <Section title="Spotlight">
            <Spotlight animate>
              <Spotlight.Item>
                <Spotlight.Image
                  src=""
                  alt="Feature 1"
                  style={{
                    background: "linear-gradient(135deg, var(--C-PRIMARY), var(--C-ACCENT))",
                    minHeight: "200px",
                  }}
                />
                <Spotlight.Content>
                  <Text variant="h4">Theme-Agnostic Design</Text>
                  <Text variant="body-2" color="secondary">
                    Every visual value flows through CSS custom properties. Switch themes by
                    overriding :root — zero component changes needed.
                  </Text>
                </Spotlight.Content>
              </Spotlight.Item>
              <Spotlight.Item>
                <Spotlight.Image
                  src=""
                  alt="Feature 2"
                  style={{
                    background: "linear-gradient(135deg, var(--C-ACCENT), var(--C-STATUS-INFO))",
                    minHeight: "200px",
                  }}
                />
                <Spotlight.Content>
                  <Text variant="h4">Zero-Dependency Animations</Text>
                  <Text variant="body-2" color="secondary">
                    Pure CSS animations with IntersectionObserver and requestAnimationFrame. No
                    runtime JS animation libraries.
                  </Text>
                </Spotlight.Content>
              </Spotlight.Item>
            </Spotlight>
          </Section>

          {/* ── Timeline ── */}
          <Section title="Timeline">
            <Card>
              <Timeline animate>
                <Timeline.Item date="Jan 2026" title="Project Kickoff">
                  <Text variant="body-2" color="secondary">
                    Initial project setup with Cloudflare Workers, Hono, and React.
                  </Text>
                </Timeline.Item>
                <Timeline.Item date="Feb 2026" title="Auth & Database">
                  <Text variant="body-2" color="secondary">
                    Added Better Auth, Drizzle ORM on D1, and Zod validation.
                  </Text>
                </Timeline.Item>
                <Timeline.Item date="Mar 2026" title="Component Library">
                  <Text variant="body-2" color="secondary">
                    Built animation primitives and display components with full theming support.
                  </Text>
                </Timeline.Item>
                <Timeline.Item date="Apr 2026" title="Launch">
                  <Text variant="body-2" color="secondary">
                    Production deployment with themes, accessibility, and documentation.
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </Section>

          {/* ── Masonry Grid ── */}
          <Section title="Masonry Grid">
            <MasonryGrid columns={{ sm: 2, md: 3, lg: 4 }} animate>
              {[120, 180, 100, 200, 140, 160, 110, 190, 130, 150, 170, 125].map((height, i) => (
                <MasonryGrid.Item key={i}>
                  <Card padding="r4">
                    <div
                      className="rounded-md"
                      style={{
                        height: `${height}px`,
                        background: `hsl(${i * 30}, 60%, 65%)`,
                        marginBottom: "var(--R-SIZE-5)",
                      }}
                    />
                    <Text variant="body-3" color="secondary">
                      Item {i + 1}
                    </Text>
                  </Card>
                </MasonryGrid.Item>
              ))}
            </MasonryGrid>
          </Section>

          {/* Footer spacer */}
          <div className="py-r3" />
        </Stack>
      </Container>
    </Stack>
  );
}

function Swatch({ color, label, light }: { color: string; label: string; light?: boolean }) {
  return (
    <Stack gap="r6" className="items-center">
      <div className={`${color} w-12 h-12 rounded-md border border-border-default`} />
      <Text variant="body-3" color={light ? "secondary" : "muted"}>
        {label}
      </Text>
    </Stack>
  );
}

export default Demo;
