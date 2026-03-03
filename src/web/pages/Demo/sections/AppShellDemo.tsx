import { Home, LayoutDashboard, Settings, Users } from "lucide-react";

import { Stack } from "@/web/components/layout";
import { AppShell, Button, Card, Text } from "@/web/components/ui";

import { Section, SubSection } from "./helpers";

function MiniAppShell({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  return (
    <div
      style={{
        height: 400,
        border: "1px solid var(--C-BORDER-DEFAULT)",
        borderRadius: "var(--RADIUS-MD)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AppShell defaultCollapsed={defaultCollapsed}>
        <AppShell.Navbar>
          <AppShell.Toggle />
          <AppShell.Brand>
            <Text variant="h6" color="on-primary">
              My App
            </Text>
          </AppShell.Brand>
          <AppShell.NavbarActions>
            <Button variant="ghost-inverse" size="sm">
              Sign Out
            </Button>
          </AppShell.NavbarActions>
        </AppShell.Navbar>

        <AppShell.Sidebar>
          <AppShell.SidebarSection title="Navigation">
            <AppShell.SidebarLink to="#" icon={Home}>
              Home
            </AppShell.SidebarLink>
            <AppShell.SidebarLink to="#" icon={LayoutDashboard}>
              Dashboard
            </AppShell.SidebarLink>
            <AppShell.SidebarLink to="#" icon={Users}>
              Users
            </AppShell.SidebarLink>
          </AppShell.SidebarSection>
          <AppShell.SidebarSection title="System">
            <AppShell.SidebarLink to="#" icon={Settings}>
              Settings
            </AppShell.SidebarLink>
          </AppShell.SidebarSection>
        </AppShell.Sidebar>

        <AppShell.Main>
          <Stack gap="r4" className="p-r3">
            <Text variant="h5">Main Content Area</Text>
            <Text variant="body-2" color="secondary">
              This is the main content rendered inside AppShell.Main. The sidebar
              can be collapsed using the toggle button in the navbar. On mobile
              viewports, the sidebar becomes a slide-over panel.
            </Text>
            <Card padding="r4">
              <Text variant="body-2" color="secondary">
                Nested card content inside the shell.
              </Text>
            </Card>
          </Stack>
        </AppShell.Main>
      </AppShell>
    </div>
  );
}

export function AppShellDemo() {
  return (
    <Section title="App Shell">
      <Stack gap="r4">
        <SubSection label="Expanded Sidebar">
          <Text variant="body-3" color="muted">
            Full sidebar with icon + label. Click the toggle to collapse.
          </Text>
          <MiniAppShell />
        </SubSection>

        <SubSection label="Collapsed Sidebar (default)">
          <Text variant="body-3" color="muted">
            Starts collapsed — icons only with tooltips on hover.
          </Text>
          <MiniAppShell defaultCollapsed />
        </SubSection>

        <Card padding="r4">
          <Stack gap="r5">
            <Text variant="body-2" weight="semibold">Sub-components</Text>
            <Text variant="body-3" color="secondary">
              AppShell is a compound component with 9 parts: AppShell (root),
              AppShell.Navbar, AppShell.Brand, AppShell.NavbarActions,
              AppShell.Toggle, AppShell.Sidebar, AppShell.SidebarSection,
              AppShell.SidebarLink, and AppShell.Main.
            </Text>
            <Text variant="body-3" color="secondary">
              On mobile (below 640px), the sidebar renders as a portal overlay
              with focus trapping, backdrop scrim, and escape-to-close.
              Resize your browser to see the mobile behavior.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Section>
  );
}
