import {
  Avatar,
  Badge,
  Button,
  Card,
  CommandPalette,
  type CommandPaletteItem,
  ContextMenu,
  Divider,
  Drawer,
  HoverCard,
  Kbd,
  Row,
  Stack,
  Text,
} from "@batthewz/response-ui-react-components";
import {
  Copy,
  FileText,
  LayoutDashboard,
  Pencil,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Drawer                                                            */
/* ------------------------------------------------------------------ */

function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Section title="Drawer" id="drawer">
      <SubSection label="Slide-out panel from a screen edge">
        <Button onClick={() => setOpen(true)}>Open filters drawer</Button>
        <Drawer open={open} onClose={() => setOpen(false)} side="right">
          <Stack gap="r4">
            <Text variant="h5">Filters</Text>
            <Divider />
            <Stack gap="r5">
              <Text variant="body-3" color="secondary">
                Status
              </Text>
              <Row gap="r5" wrap>
                <Badge variant="success">Active</Badge>
                <Badge>Archived</Badge>
                <Badge variant="info">Draft</Badge>
              </Row>
            </Stack>
            <Stack gap="r5">
              <Text variant="body-3" color="secondary">
                Owner
              </Text>
              <Text variant="body-2">Everyone</Text>
            </Stack>
            <Divider />
            <Row gap="r5">
              <Button onClick={() => setOpen(false)}>Apply</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Row>
          </Stack>
        </Drawer>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  ContextMenu                                                       */
/* ------------------------------------------------------------------ */

function ContextMenuDemo() {
  return (
    <Section title="Context Menu" id="contextmenu">
      <SubSection label="Right-click (or long-press) the surface below">
        <ContextMenu>
          <ContextMenu.Trigger>
            <Card className="flex h-32 items-center justify-center border-dashed text-center select-none">
              <Text color="muted">Right-click anywhere here</Text>
            </Card>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.GroupHeader>Actions</ContextMenu.GroupHeader>
            <ContextMenu.Item index={0} icon={<Pencil size={16} />}>
              Rename
            </ContextMenu.Item>
            <ContextMenu.Item index={1} icon={<Copy size={16} />}>
              Duplicate
            </ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item index={2} icon={<Trash2 size={16} />}>
              Delete
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  HoverCard                                                         */
/* ------------------------------------------------------------------ */

function HoverCardDemo() {
  return (
    <Section title="Hover Card" id="hovercard">
      <SubSection label="Hover or focus the trigger for a floating preview">
        <Text variant="body-2">
          Pull request opened by{" "}
          <HoverCard>
            <HoverCard.Trigger asChild>
              <a href="#hovercard" className="font-semibold underline underline-offset-2">
                @ada
              </a>
            </HoverCard.Trigger>
            <HoverCard.Content>
              <Stack gap="r5">
                <Row gap="r4" align="center">
                  <Avatar name="Ada Lovelace" />
                  <Stack gap="r6">
                    <Text weight="semibold">Ada Lovelace</Text>
                    <Text variant="body-3" color="muted">
                      @ada
                    </Text>
                  </Stack>
                </Row>
                <Text variant="body-3" color="secondary">
                  Mathematician & first programmer. Maintains the analytical-engine SDK.
                </Text>
                <Row gap="r4">
                  <Text variant="body-3" color="muted">
                    <Text as="span" weight="semibold" color="primary">
                      128
                    </Text>{" "}
                    repos
                  </Text>
                  <Text variant="body-3" color="muted">
                    <Text as="span" weight="semibold" color="primary">
                      4.2k
                    </Text>{" "}
                    followers
                  </Text>
                </Row>
              </Stack>
            </HoverCard.Content>
          </HoverCard>{" "}
          two hours ago.
        </Text>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  CommandPalette                                                    */
/* ------------------------------------------------------------------ */

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (label: string) => {
    setLastAction(label);
    setOpen(false);
  };

  const items: CommandPaletteItem[] = [
    {
      id: "dashboard",
      label: "Go to Dashboard",
      group: "Navigation",
      icon: <LayoutDashboard size={16} />,
      onSelect: () => run("Go to Dashboard"),
    },
    {
      id: "profile",
      label: "Open Profile",
      group: "Navigation",
      icon: <User size={16} />,
      onSelect: () => run("Open Profile"),
    },
    {
      id: "new-doc",
      label: "New Document",
      group: "Actions",
      icon: <FileText size={16} />,
      shortcut: "⌘N",
      keywords: ["create", "file"],
      onSelect: () => run("New Document"),
    },
    {
      id: "settings",
      label: "Open Settings",
      group: "Actions",
      icon: <Settings size={16} />,
      shortcut: "⌘,",
      onSelect: () => run("Open Settings"),
    },
  ];

  return (
    <Section title="Command Palette" id="commandpalette">
      <SubSection label="⌘K launcher — search + keyboard navigation">
        <Card>
          <Stack gap="r4">
            <Row gap="r4" align="center" wrap>
              <Button onClick={() => setOpen(true)}>Open command palette</Button>
              <Text variant="body-3" color="muted">
                or press{" "}
                <Row as="span" gap="r6" align="center" className="inline-flex align-middle">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </Row>
              </Text>
            </Row>
            {lastAction && (
              <Text variant="body-3" color="secondary">
                Ran: <Text as="span" weight="semibold">{lastAction}</Text>
              </Text>
            )}
          </Stack>
        </Card>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          items={items}
          placeholder="Type a command or search…"
        />
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function OverlayExtraDemos() {
  return (
    <>
      <DrawerDemo />
      <ContextMenuDemo />
      <HoverCardDemo />
      <CommandPaletteDemo />
    </>
  );
}
