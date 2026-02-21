import { Link } from "react-router-dom";

import { Container, Divider, Row, Spacer, Stack } from "@/web/components/layout";
import { Button, Text } from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";

import { DangerZoneSection } from "./components/DangerZoneSection";
import { PasswordSection } from "./components/PasswordSection";
import { ProfileSection } from "./components/ProfileSection";
import { SessionsSection } from "./components/SessionsSection";

export function Settings() {
  useDocumentTitle("Settings");
  return (
    <Stack className="min-h-screen bg-surface-1">
      <Row className="px-r3 py-r5 bg-surface-0 border-b border-border-default">
        <Text variant="h6">Settings</Text>
        <Spacer />
        <Button as={Link} to="/dashboard" variant="ghost" size="sm">
          Back to Dashboard
        </Button>
      </Row>

      <Container size="lg">
        <Stack gap="r3" className="py-r2">
          <ProfileSection />
          <Divider />
          <PasswordSection />
          <Divider />
          <SessionsSection />
          <Divider />
          <DangerZoneSection />
        </Stack>
      </Container>
    </Stack>
  );
}

export default Settings;
