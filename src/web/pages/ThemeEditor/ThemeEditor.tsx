import { Clipboard, Download, Pipette, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Field, Input, Label, Select } from "@/web/components/form";
import { Container, Divider, Row, Stack } from "@/web/components/layout";
import {
  Alert,
  Badge,
  Button,
  Card,
  IconButton,
  ProgressBar,
  Tabs,
  Text,
  useToast,
} from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { THEMES } from "@/web/hooks/use-theme";
import { cn } from "@/web/util/style/style";

/* ------------------------------------------------------------------ */
/*  Token definitions                                                  */
/* ------------------------------------------------------------------ */

type TokenDef = {
  variable: string;
  label: string;
  type: "color" | "text";
};

type TokenGroup = {
  title: string;
  tokens: TokenDef[];
};

const COLOR_GROUPS: TokenGroup[] = [
  {
    title: "Canvas",
    tokens: [{ variable: "--C-CANVAS", label: "Canvas", type: "color" }],
  },
  {
    title: "Brand",
    tokens: [
      { variable: "--C-PRIMARY", label: "Primary", type: "color" },
      { variable: "--C-PRIMARY-HOVER", label: "Primary Hover", type: "color" },
      { variable: "--C-PRIMARY-ACTIVE", label: "Primary Active", type: "color" },
      { variable: "--C-SECONDARY", label: "Secondary", type: "color" },
      { variable: "--C-SECONDARY-HOVER", label: "Secondary Hover", type: "color" },
      { variable: "--C-ACCENT", label: "Accent", type: "color" },
      { variable: "--C-ACCENT-HOVER", label: "Accent Hover", type: "color" },
    ],
  },
  {
    title: "Surface",
    tokens: [
      { variable: "--C-SURFACE-0", label: "Surface 0", type: "color" },
      { variable: "--C-SURFACE-1", label: "Surface 1", type: "color" },
      { variable: "--C-SURFACE-2", label: "Surface 2", type: "color" },
      { variable: "--C-SURFACE-3", label: "Surface 3", type: "color" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { variable: "--C-TEXT-PRIMARY", label: "Text Primary", type: "color" },
      { variable: "--C-TEXT-SECONDARY", label: "Text Secondary", type: "color" },
      { variable: "--C-TEXT-MUTED", label: "Text Muted", type: "color" },
      { variable: "--C-TEXT-INVERSE", label: "Text Inverse", type: "color" },
      { variable: "--C-TEXT-ON-PRIMARY", label: "On Primary", type: "color" },
      { variable: "--C-TEXT-ON-ACCENT", label: "On Accent", type: "color" },
    ],
  },
  {
    title: "Border",
    tokens: [
      { variable: "--C-BORDER-DEFAULT", label: "Default", type: "color" },
      { variable: "--C-BORDER-STRONG", label: "Strong", type: "color" },
      { variable: "--C-BORDER-FOCUS", label: "Focus", type: "color" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { variable: "--C-STATUS-ERROR", label: "Error", type: "color" },
      { variable: "--C-STATUS-ERROR-BG", label: "Error BG", type: "color" },
      { variable: "--C-STATUS-SUCCESS", label: "Success", type: "color" },
      { variable: "--C-STATUS-SUCCESS-BG", label: "Success BG", type: "color" },
      { variable: "--C-STATUS-WARNING", label: "Warning", type: "color" },
      { variable: "--C-STATUS-WARNING-BG", label: "Warning BG", type: "color" },
      { variable: "--C-STATUS-INFO", label: "Info", type: "color" },
      { variable: "--C-STATUS-INFO-BG", label: "Info BG", type: "color" },
    ],
  },
];

const TYPOGRAPHY_TOKENS: TokenGroup[] = [
  {
    title: "Font Families",
    tokens: [
      { variable: "--DEFAULT-FONT", label: "Default Font", type: "text" },
      { variable: "--DEFAULT-MONO-FONT", label: "Mono Font", type: "text" },
      { variable: "--HEADING-FONT", label: "Heading Font", type: "text" },
    ],
  },
  {
    title: "Heading Style",
    tokens: [
      { variable: "--HEADING-LETTER-SPACING", label: "Letter Spacing", type: "text" },
      { variable: "--HEADING-TEXT-TRANSFORM", label: "Text Transform", type: "text" },
    ],
  },
  {
    title: "Weights",
    tokens: [
      { variable: "--Bold-Weight", label: "Bold", type: "text" },
      { variable: "--Semibold-Weight", label: "Semibold", type: "text" },
    ],
  },
];

const RADIUS_TOKENS: TokenGroup[] = [
  {
    title: "Border Radius",
    tokens: [
      { variable: "--RADIUS-SM", label: "Small", type: "text" },
      { variable: "--RADIUS-MD", label: "Medium", type: "text" },
      { variable: "--RADIUS-LG", label: "Large", type: "text" },
      { variable: "--RADIUS-XL", label: "Extra Large", type: "text" },
      { variable: "--RADIUS-FULL", label: "Full", type: "text" },
    ],
  },
];

const SHADOW_TOKENS: TokenGroup[] = [
  {
    title: "Shadows",
    tokens: [
      { variable: "--SHADOW-SM", label: "Small", type: "text" },
      { variable: "--SHADOW-MD", label: "Medium", type: "text" },
      { variable: "--SHADOW-LG", label: "Large", type: "text" },
    ],
  },
];

const MOTION_TOKENS: TokenGroup[] = [
  {
    title: "Durations",
    tokens: [
      { variable: "--MOTION-DURATION-ENTER", label: "Enter", type: "text" },
      { variable: "--MOTION-DURATION-EXIT", label: "Exit", type: "text" },
      { variable: "--MOTION-DURATION-SHIFT", label: "Shift", type: "text" },
      { variable: "--MOTION-DURATION-PAGE", label: "Page", type: "text" },
    ],
  },
  {
    title: "Easing",
    tokens: [
      { variable: "--MOTION-EASE-PAGE", label: "Page", type: "text" },
      { variable: "--MOTION-EASE-ENTER", label: "Enter", type: "text" },
      { variable: "--MOTION-EASE-EXIT", label: "Exit", type: "text" },
      { variable: "--MOTION-EASE-SHIFT", label: "Shift", type: "text" },
      { variable: "--MOTION-EASE-BOUNCE", label: "Bounce", type: "text" },
    ],
  },
  {
    title: "Distances",
    tokens: [
      { variable: "--MOTION-DISTANCE-SM", label: "Small", type: "text" },
      { variable: "--MOTION-DISTANCE-MD", label: "Medium", type: "text" },
      { variable: "--MOTION-DISTANCE-LG", label: "Large", type: "text" },
    ],
  },
  {
    title: "Scale",
    tokens: [
      { variable: "--MOTION-SCALE-HOVER", label: "Hover", type: "text" },
      { variable: "--MOTION-SCALE-PRESS", label: "Press", type: "text" },
    ],
  },
];

const OVERLAY_TOKENS: TokenGroup[] = [
  {
    title: "Overlay",
    tokens: [
      { variable: "--OVERLAY-SCRIM-COLOR", label: "Scrim Color", type: "text" },
      { variable: "--OVERLAY-GRADIENT-START", label: "Gradient Start", type: "text" },
      { variable: "--OVERLAY-GRADIENT-END", label: "Gradient End", type: "text" },
      { variable: "--OVERLAY-BLUR", label: "Blur", type: "text" },
      { variable: "--OVERLAY-BLUR-HEAVY", label: "Blur Heavy", type: "text" },
    ],
  },
];

const TRANSITION_TOKENS: TokenGroup[] = [
  {
    title: "Transitions",
    tokens: [
      { variable: "--DURATION-FAST", label: "Fast", type: "text" },
      { variable: "--DURATION-NORMAL", label: "Normal", type: "text" },
      { variable: "--DURATION-SLOW", label: "Slow", type: "text" },
    ],
  },
];

const TAB_CONFIG = [
  { value: "colors", label: "Colors", groups: COLOR_GROUPS },
  { value: "typography", label: "Typography", groups: TYPOGRAPHY_TOKENS },
  { value: "radius", label: "Radius", groups: RADIUS_TOKENS },
  { value: "shadows", label: "Shadows", groups: SHADOW_TOKENS },
  { value: "motion", label: "Motion", groups: MOTION_TOKENS },
  { value: "overlay", label: "Overlay", groups: OVERLAY_TOKENS },
  { value: "transitions", label: "Transitions", groups: TRANSITION_TOKENS },
] as const;

/** All editable variables in a flat list */
const ALL_TOKENS = TAB_CONFIG.flatMap((t) => t.groups.flatMap((g) => g.tokens));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Read the current computed value for a CSS variable */
function getComputedVar(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

/** Snapshot every token's current computed value */
function snapshotAll(): Record<string, string> {
  const snap: Record<string, string> = {};
  for (const t of ALL_TOKENS) {
    snap[t.variable] = getComputedVar(t.variable);
  }
  return snap;
}

/** Convert rgb(r, g, b) or similar to #hex for color inputs */
function toHex(raw: string): string {
  const v = raw.trim();
  // Already hex
  if (v.startsWith("#")) return v;

  // rgb(r, g, b) or rgb(r g b)
  const rgbMatch = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const hex = [r, g, b]
      .map((c) =>
        Math.round(Number(c))
          .toString(16)
          .padStart(2, "0")
      )
      .join("");
    return `#${hex}`;
  }

  return v;
}

/* ------------------------------------------------------------------ */
/*  Color Input                                                        */
/* ------------------------------------------------------------------ */

function ColorTokenInput({
  variable,
  label,
  value,
  onChange,
}: {
  variable: string;
  label: string;
  value: string;
  onChange: (variable: string, value: string) => void;
}) {
  const hex = toHex(value);
  return (
    <div className="flex flex-col gap-r6">
      <Text variant="body-3" color="secondary" className="truncate" title={variable}>
        {label}
      </Text>
      <div className="flex items-center gap-r6">
        <label
          className={cn(
            "relative shrink-0 w-9 h-9 rounded-md overflow-hidden cursor-pointer",
            "border border-border-strong",
            "hover:ring-2 hover:ring-border-focus hover:ring-offset-1 duration-fast"
          )}
          style={{ backgroundColor: hex }}
        >
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(variable, e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
        <Input
          value={value}
          onChange={(e) => onChange(variable, e.target.value)}
          className="!py-1.5 !text-body-3 mono-font min-w-0"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Text Input                                                         */
/* ------------------------------------------------------------------ */

function TextTokenInput({
  variable,
  label,
  value,
  onChange,
}: {
  variable: string;
  label: string;
  value: string;
  onChange: (variable: string, value: string) => void;
}) {
  return (
    <Field>
      <Label className="!text-body-3 !font-normal !text-fg-secondary truncate" title={variable}>
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(variable, e.target.value)}
        className="!py-1.5 !text-body-3 mono-font"
      />
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*  Token Group                                                        */
/* ------------------------------------------------------------------ */

function TokenGroupSection({
  group,
  overrides,
  onChange,
}: {
  group: TokenGroup;
  overrides: Record<string, string>;
  onChange: (variable: string, value: string) => void;
}) {
  const isColorGroup = group.tokens[0]?.type === "color";

  return (
    <div>
      <Text variant="body-2" weight="semibold" className="mb-r5">
        {group.title}
      </Text>
      <div
        className={cn(
          "grid gap-x-r4 gap-y-r5",
          isColorGroup
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {group.tokens.map((token) =>
          token.type === "color" ? (
            <ColorTokenInput
              key={token.variable}
              variable={token.variable}
              label={token.label}
              value={overrides[token.variable] ?? ""}
              onChange={onChange}
            />
          ) : (
            <TextTokenInput
              key={token.variable}
              variable={token.variable}
              label={token.label}
              value={overrides[token.variable] ?? ""}
              onChange={onChange}
            />
          )
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Live Preview                                                       */
/* ------------------------------------------------------------------ */

function LivePreview() {
  return (
    <Card padding="r3" shadow="lg" className="sticky top-6">
      <Stack gap="r5">
        <Text variant="h6">Live Preview</Text>
        <Divider />

        {/* Typography */}
        <Stack gap="r6">
          <Text variant="h4">Heading</Text>
          <Text variant="body-1">
            Body text in the primary color, showing how your theme affects readable content.
          </Text>
          <Text variant="body-2" color="secondary">
            Secondary text for supporting content and metadata.
          </Text>
          <Text variant="body-3" color="muted">
            Muted text for subtle hints and timestamps.
          </Text>
        </Stack>

        <Divider />

        {/* Buttons */}
        <Row gap="r5" wrap>
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="danger">
            Danger
          </Button>
        </Row>

        <Divider />

        {/* Badges */}
        <Row gap="r5" wrap>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Row>

        <Divider />

        {/* Alerts */}
        <Stack gap="r6">
          <Alert variant="info">Info alert message</Alert>
          <Alert variant="success">Success alert message</Alert>
          <Alert variant="warning">Warning alert message</Alert>
          <Alert variant="error">Error alert message</Alert>
        </Stack>

        <Divider />

        {/* Progress */}
        <Stack gap="r6">
          <ProgressBar value={65} color="accent" size="md" />
          <ProgressBar value={40} color="success" size="sm" />
        </Stack>

        <Divider />

        {/* Surfaces */}
        <div className="grid grid-cols-4 gap-r6">
          {([0, 1, 2, 3] as const).map((n) => (
            <div
              key={n}
              className={cn(
                "rounded-md p-r5 text-center text-body-3 text-fg-secondary border border-border-default",
                n === 0 && "bg-surface-0",
                n === 1 && "bg-surface-1",
                n === 2 && "bg-surface-2",
                n === 3 && "bg-surface-3"
              )}
            >
              S-{n}
            </div>
          ))}
        </div>

        <Divider />

        {/* Card inside card for depth */}
        <Card padding="r4" shadow="sm" className="bg-surface-1">
          <Stack gap="r6">
            <Text variant="body-2" weight="semibold">
              Nested card
            </Text>
            <Text variant="body-3" color="secondary">
              Testing surface layering, border, and shadow tokens together.
            </Text>
            <Row gap="r5">
              <div className="w-8 h-8 rounded-sm bg-accent" />
              <div className="w-8 h-8 rounded-sm bg-primary" />
              <div className="w-8 h-8 rounded-sm bg-secondary" />
            </Row>
          </Stack>
        </Card>

        {/* Input preview */}
        <Field>
          <Label>Sample Input</Label>
          <Input placeholder="Type something..." />
        </Field>
      </Stack>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export function ThemeEditor() {
  useDocumentTitle("Theme Editor");
  const { toast } = useToast();

  // Track which theme was active on mount so we can restore it on leave
  const originalThemeAttr = useRef(
    document.documentElement.getAttribute("data-theme")
  );
  // Snapshot the initial computed values before any user overrides
  const baselineRef = useRef<Record<string, string>>(snapshotAll());

  const [overrides, setOverrides] = useState<Record<string, string>>(() => snapshotAll());
  const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());

  // Clean up inline overrides on unmount
  useEffect(() => {
    const savedAttr = originalThemeAttr.current;
    return () => {
      for (const token of ALL_TOKENS) {
        document.documentElement.style.removeProperty(token.variable);
      }
      // Restore original theme attribute
      if (savedAttr) {
        document.documentElement.setAttribute("data-theme", savedAttr);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };
  }, []);

  const handleChange = useCallback((variable: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [variable]: value }));
    setChangedKeys((prev) => new Set(prev).add(variable));
    document.documentElement.style.setProperty(variable, value);
  }, []);

  const handleLoadTheme = useCallback((themeName: string) => {
    // Clear all inline overrides first
    for (const token of ALL_TOKENS) {
      document.documentElement.style.removeProperty(token.variable);
    }

    // Apply the theme via data attribute to get its computed values
    if (themeName === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeName);
    }

    // Wait a frame for styles to recompute then snapshot
    requestAnimationFrame(() => {
      const snap = snapshotAll();
      setOverrides(snap);
      baselineRef.current = snap;
      setChangedKeys(new Set());
    });
  }, []);

  const handleReset = useCallback(() => {
    for (const token of ALL_TOKENS) {
      document.documentElement.style.removeProperty(token.variable);
    }
    const snap = snapshotAll();
    setOverrides(snap);
    setChangedKeys(new Set());
    toast("All overrides cleared", { variant: "info" });
  }, [toast]);

  const copyThemeCSS = useCallback(
    (tokens: TokenDef[], successMsg: string) => {
      const lines = tokens.map((t) => `  ${t.variable}: ${overrides[t.variable]};`);
      const css = `:root[data-theme="custom"] {\n${lines.join("\n")}\n}`;
      navigator.clipboard.writeText(css).then(
        () => toast(successMsg, { variant: "success" }),
        () => toast("Failed to copy to clipboard", { variant: "error" })
      );
    },
    [overrides, toast]
  );

  const handleExport = useCallback(() => {
    const changed = ALL_TOKENS.filter((t) => changedKeys.has(t.variable));
    if (changed.length === 0) {
      toast("No changes to export. Modify some values first.", { variant: "warning" });
      return;
    }
    copyThemeCSS(changed, "CSS copied to clipboard!");
  }, [changedKeys, copyThemeCSS, toast]);

  const handleExportAll = useCallback(() => {
    copyThemeCSS(ALL_TOKENS, "Full theme CSS copied to clipboard!");
  }, [copyThemeCSS]);

  const changeCount = changedKeys.size;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-border-default bg-surface-0 sticky top-0 z-30">
        <Container size="full" className="!max-w-[1400px]">
          <div className="flex items-center justify-between py-r5 gap-r4 flex-wrap">
            <Row gap="r5" align="center">
              <Pipette className="w-5 h-5 text-accent shrink-0" />
              <Text variant="h5" className="whitespace-nowrap">
                Theme Editor
              </Text>
              {changeCount > 0 && (
                <Badge variant="info">{changeCount} changed</Badge>
              )}
            </Row>

            <Row gap="r5" align="center" wrap>
              <Row gap="r6" align="center">
                <Text variant="body-3" color="secondary" className="whitespace-nowrap">
                  Start from
                </Text>
                <Select
                  className="!w-auto !py-1.5 !text-body-3"
                  onChange={(e) => handleLoadTheme(e.target.value)}
                >
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </Select>
              </Row>

              <IconButton
                aria-label="Reset all overrides"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" />
              </IconButton>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleExportAll}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export All
              </Button>

              <Button size="sm" onClick={handleExport}>
                <Clipboard className="w-3.5 h-3.5 mr-1.5" />
                Export Changes
              </Button>
            </Row>
          </div>
        </Container>
      </div>

      {/* Body */}
      <Container size="full" className="!max-w-[1400px] py-r2">
        <div className="flex gap-r3 flex-col lg:flex-row lg:items-start">
          {/* Editor panel */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="colors" variant="pill">
              <Tabs.List className="mb-r4">
                {TAB_CONFIG.map((tab) => (
                  <Tabs.Tab key={tab.value} value={tab.value}>
                    {tab.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {TAB_CONFIG.map((tab) => (
                <Tabs.Panel key={tab.value} value={tab.value}>
                  <Card padding="r3" shadow="sm">
                    <Stack gap="r4">
                      {tab.groups.map((group) => (
                        <TokenGroupSection
                          key={group.title}
                          group={group}
                          overrides={overrides}
                          onChange={handleChange}
                        />
                      ))}
                    </Stack>
                  </Card>
                </Tabs.Panel>
              ))}
            </Tabs>
          </div>

          {/* Preview panel */}
          <div className="w-full lg:w-[380px] shrink-0">
            <LivePreview />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ThemeEditor;
