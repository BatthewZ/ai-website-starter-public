import {
  Bell,
  ChevronDown,
  Copy,
  Edit,
  Info,
  LogOut,
  Settings,
  Share,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

import { Input } from "@/web/components/form";
import { Row, Stack } from "@/web/components/layout";
import {
  Button,
  Card,
  DropdownMenu,
  IconButton,
  Popover,
  Text,
  Tooltip,
  useToast,
} from "@/web/components/ui";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Tooltip Demos                                                     */
/* ------------------------------------------------------------------ */

function TooltipDemos() {
  return (
    <Section title="Tooltip">
      <Card>
        <Stack gap="r4">
          <SubSection label="Basic">
            <Tooltip content="This is a tooltip">
              <Button variant="secondary">Hover me</Button>
            </Tooltip>
          </SubSection>

          <SubSection label="Placements">
            <Row gap="r5" wrap>
              <Tooltip content="Appears on top" placement="top">
                <Button variant="secondary" size="sm">
                  Top
                </Button>
              </Tooltip>
              <Tooltip content="Appears on the right" placement="right">
                <Button variant="secondary" size="sm">
                  Right
                </Button>
              </Tooltip>
              <Tooltip content="Appears on the bottom" placement="bottom">
                <Button variant="secondary" size="sm">
                  Bottom
                </Button>
              </Tooltip>
              <Tooltip content="Appears on the left" placement="left">
                <Button variant="secondary" size="sm">
                  Left
                </Button>
              </Tooltip>
            </Row>
          </SubSection>

          <SubSection label="On IconButton">
            <Row gap="r5">
              <Tooltip content="Notifications">
                <IconButton aria-label="Notifications">
                  <Bell size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip content="Settings">
                <IconButton aria-label="Settings">
                  <Settings size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip content="User profile">
                <IconButton aria-label="User profile">
                  <User size={20} />
                </IconButton>
              </Tooltip>
            </Row>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Popover Demos                                                     */
/* ------------------------------------------------------------------ */

function PopoverFilterForm() {
  const [filter, setFilter] = useState("");

  return (
    <Stack gap="r5">
      <Text variant="body-2" weight="semibold">
        Filter results
      </Text>
      <Input
        placeholder="Search..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Button size="sm" onClick={() => setFilter("")}>
        Apply
      </Button>
    </Stack>
  );
}

function PopoverDemos() {
  return (
    <Section title="Popover">
      <Card>
        <Stack gap="r4">
          <SubSection label="Basic">
            <Popover>
              <Popover.Trigger>
                <Button variant="secondary" as="span">
                  Open Popover
                </Button>
              </Popover.Trigger>
              <Popover.Content>
                <Stack gap="r5">
                  <Text variant="body-2" weight="semibold">
                    Popover Title
                  </Text>
                  <Text variant="body-3" color="secondary">
                    This is some informational content inside a popover. Click
                    outside or press Escape to dismiss.
                  </Text>
                </Stack>
              </Popover.Content>
            </Popover>
          </SubSection>

          <SubSection label="With Form Content">
            <Popover placement="bottom">
              <Popover.Trigger>
                <Button variant="secondary" as="span">
                  Open Filter
                </Button>
              </Popover.Trigger>
              <Popover.Content style={{ width: 260 }}>
                <PopoverFilterForm />
              </Popover.Content>
            </Popover>
          </SubSection>

          <SubSection label="Placements">
            <Row gap="r5" wrap>
              <Popover placement="top">
                <Popover.Trigger>
                  <Button variant="secondary" size="sm" as="span">
                    Top
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Text variant="body-3">Popover on top</Text>
                </Popover.Content>
              </Popover>

              <Popover placement="right">
                <Popover.Trigger>
                  <Button variant="secondary" size="sm" as="span">
                    Right
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Text variant="body-3">Popover on right</Text>
                </Popover.Content>
              </Popover>

              <Popover placement="bottom">
                <Popover.Trigger>
                  <Button variant="secondary" size="sm" as="span">
                    Bottom
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Text variant="body-3">Popover on bottom</Text>
                </Popover.Content>
              </Popover>

              <Popover placement="left">
                <Popover.Trigger>
                  <Button variant="secondary" size="sm" as="span">
                    Left
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Text variant="body-3">Popover on left</Text>
                </Popover.Content>
              </Popover>
            </Row>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  DropdownMenu Demos                                                */
/* ------------------------------------------------------------------ */

function DropdownMenuDemos() {
  const { toast } = useToast();

  return (
    <Section title="Dropdown Menu">
      <Card>
        <Stack gap="r4">
          <SubSection label="Basic">
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <Button variant="secondary" as="span">
                  Actions <ChevronDown size={16} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item index={0} icon={<Edit size={16} />}>
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item index={1} icon={<Copy size={16} />}>
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item index={2} icon={<Share size={16} />}>
                  Share
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  index={3}
                  icon={<Trash2 size={16} />}
                  onSelect={() =>
                    toast("Item deleted", {
                      variant: "success",
                      title: "Deleted",
                    })
                  }
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </SubSection>

          <SubSection label="With Dividers and Labels">
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <Button variant="secondary" as="span">
                  Options <ChevronDown size={16} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Account</DropdownMenu.Label>
                <DropdownMenu.Item index={0} icon={<User size={16} />}>
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item index={1} icon={<Settings size={16} />}>
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Divider />
                <DropdownMenu.Label>Notifications</DropdownMenu.Label>
                <DropdownMenu.Item index={2} icon={<Bell size={16} />}>
                  Preferences
                </DropdownMenu.Item>
                <DropdownMenu.Divider />
                <DropdownMenu.Item index={3} icon={<LogOut size={16} />}>
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </SubSection>

          <SubSection label="With Disabled Items">
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <Button variant="secondary" as="span">
                  Menu <ChevronDown size={16} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item index={0} icon={<Edit size={16} />}>
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item index={1} icon={<Copy size={16} />} disabled>
                  Duplicate (disabled)
                </DropdownMenu.Item>
                <DropdownMenu.Item index={2} icon={<Share size={16} />}>
                  Share
                </DropdownMenu.Item>
                <DropdownMenu.Item index={3} icon={<Trash2 size={16} />} disabled>
                  Delete (disabled)
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </SubSection>

          <SubSection label="With Toast on Select">
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <Button variant="secondary" as="span">
                  Quick Actions <ChevronDown size={16} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  index={0}
                  icon={<Info size={16} />}
                  onSelect={() =>
                    toast("Details panel opened", {
                      variant: "info",
                      title: "Info",
                    })
                  }
                >
                  View details
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  index={1}
                  icon={<Copy size={16} />}
                  onSelect={() =>
                    toast("Link copied to clipboard", {
                      variant: "success",
                      title: "Copied",
                    })
                  }
                >
                  Copy link
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  index={2}
                  icon={<Bell size={16} />}
                  onSelect={() =>
                    toast("You will be notified of changes", {
                      variant: "info",
                      title: "Subscribed",
                    })
                  }
                >
                  Subscribe
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function OverlayComponentDemos() {
  return (
    <>
      <TooltipDemos />
      <PopoverDemos />
      <DropdownMenuDemos />
    </>
  );
}
