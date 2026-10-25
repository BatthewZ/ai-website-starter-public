import {
  AppShell,
  Avatar,
  Container,
  type ContainerWidth,
  DropdownMenu,
  PreferencesMenu,
  useDocumentTitle,
  useToast,
} from "@batthewz/r-ui-react-components";
import { LogOut, Settings } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import { BrandMark } from "@/web/components/brand/BrandMark";
import { APP_NAME } from "@/web/lib/app";
import { signOut, useSession } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";
import { AUTHENTICATED_HOME } from "@/web/lib/auth/redirect";
import { NAV_ITEMS } from "@/web/lib/navigation";
import { THEMES } from "@/web/lib/themes";

interface AuthenticatedLayoutProps {
  /** The page's `h1` (in the sticky header) and document title. */
  title: string;
  /** Content width: `page` for dashboards, `measure` for forms and reading. Default `page`. */
  width?: ContainerWidth;
  children: ReactNode;
}

/**
 * The frame of every signed-in page, on r-ui's `AppShell`: sidebar on wide
 * screens, an icon rail on medium ones, a bottom nav on phones (the shell
 * picks by viewport), with a skip link to the main region. The header holds
 * the page title, the viewer's preferences (theme, density, input) and the
 * account menu.
 *
 * Current-page marking comes from the `RouterProvider` in App.tsx; nothing
 * here passes `current`.
 */
export function AuthenticatedLayout({ title, width = "page", children }: AuthenticatedLayoutProps) {
  useDocumentTitle(title);

  return (
    <AppShell>
      <AppShell.Sidebar>
        <AppShell.Brand href={AUTHENTICATED_HOME} mark={<BrandMark />}>
          {APP_NAME}
        </AppShell.Brand>
        <AppShell.SidebarSection>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <AppShell.NavItem key={href} href={href} icon={<Icon aria-hidden />}>
              {label}
            </AppShell.NavItem>
          ))}
        </AppShell.SidebarSection>
        <AppShell.SidebarSection position="end">
          <AppShell.SidebarToggle />
        </AppShell.SidebarSection>
      </AppShell.Sidebar>

      <AppShell.Header>
        <h1 className="min-w-0 flex-1 truncate text-h4">{title}</h1>
        <PreferencesMenu themes={THEMES} />
        <AccountMenu />
      </AppShell.Header>

      <AppShell.Main>
        <Container width={width} gutter={false}>
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.BottomNav>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <AppShell.NavItem key={href} href={href} icon={<Icon aria-hidden />}>
            {label}
          </AppShell.NavItem>
        ))}
      </AppShell.BottomNav>
    </AppShell>
  );
}

/**
 * Who is signed in, and the way out. Sign-out failures are reported as a toast
 * rather than swallowed: a user who believes they signed out on a shared
 * machine, but did not, is the failure that matters here.
 */
function AccountMenu() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const user = session?.user;

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Sign-out failed",
          description: authErrorMessage(error, "Please try again."),
          tone: "error",
        });
        return;
      }
      void navigate("/login", { replace: true });
    } catch {
      toast({ title: "Sign-out failed", description: NETWORK_ERROR_MESSAGE, tone: "error" });
    } finally {
      setSigningOut(false);
    }
  }

  if (!user) return null;

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenu.Trigger
        variant="ghost"
        loading={signingOut}
        iconStart={<Avatar src={user.image} name={user.name} alt="" size="icon" />}
        classNames={{ label: "max-w-column-sm truncate" }}
      >
        {user.name}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content aria-label="Account">
        <DropdownMenu.Label>
          <span className="block truncate text-body-2 text-fg-primary">{user.name}</span>
          <span className="block truncate text-body-3 text-fg-secondary">{user.email}</span>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          icon={<Settings aria-hidden />}
          onSelect={() => void navigate("/settings")}
        >
          Settings
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={<LogOut aria-hidden />} onSelect={() => void handleSignOut()}>
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
