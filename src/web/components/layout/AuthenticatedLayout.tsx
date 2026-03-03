import { LayoutDashboard, Settings } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "@/web/components/ui/AppShell";
import { Button } from "@/web/components/ui/Button";
import { Text } from "@/web/components/ui/Text";
import { ThemeSwitcher } from "@/web/components/ui/ThemeSwitcher";
import { signOut, useSession } from "@/web/lib/auth/auth-client";

const APP_NAME = "App Name";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      void navigate("/login");
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <AppShell defaultOpen>
      <AppShell.Navbar>
        <AppShell.Toggle />
        <AppShell.Brand>
          <Text variant="h6">{APP_NAME}</Text>
        </AppShell.Brand>
        <AppShell.NavbarActions>
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </Button>
        </AppShell.NavbarActions>
      </AppShell.Navbar>

      <AppShell.Sidebar>
        <AppShell.SidebarSection>
          <AppShell.SidebarLink to="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </AppShell.SidebarLink>
          <AppShell.SidebarLink to="/settings" icon={Settings}>
            Settings
          </AppShell.SidebarLink>
        </AppShell.SidebarSection>

        {session?.user && (
          <AppShell.SidebarSection title="Account">
            <div className="px-3 py-2">
              <Text variant="body-2" className="truncate">{session.user.name}</Text>
              <Text variant="body-3" color="muted" className="truncate">{session.user.email}</Text>
            </div>
          </AppShell.SidebarSection>
        )}
      </AppShell.Sidebar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
