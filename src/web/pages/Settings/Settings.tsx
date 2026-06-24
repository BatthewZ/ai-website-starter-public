import { Container, Divider, Stack, Text, useDocumentTitle } from "@batthewz/response-ui-react-components";

import { AuthenticatedLayout } from "@/web/components/layout";

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
