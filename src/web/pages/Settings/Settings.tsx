import { AuthenticatedLayout, Container, Divider, Stack } from "@/web/components/layout";
import { Text } from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";

import { DangerZoneSection } from "./components/DangerZoneSection";
import { PasswordSection } from "./components/PasswordSection";
import { ProfileSection } from "./components/ProfileSection";
import { SessionsSection } from "./components/SessionsSection";

export function Settings() {
  useDocumentTitle("Settings");
  return (
    <AuthenticatedLayout>
      <Container size="lg">
        <Stack gap="r3" className="py-r2">
          <Text variant="h3">Settings</Text>
          <ProfileSection />
          <Divider />
          <PasswordSection />
          <Divider />
          <SessionsSection />
          <Divider />
          <DangerZoneSection />
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}

export default Settings;
