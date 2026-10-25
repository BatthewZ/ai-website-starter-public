import { Stack } from "@batthewz/r-ui-react-components";
import { useState } from "react";

import { AuthenticatedLayout } from "@/web/components/layout";

import { DangerZoneSection } from "./components/DangerZoneSection";
import { PasswordSection } from "./components/PasswordSection";
import { ProfileSection } from "./components/ProfileSection";
import { SessionsSection } from "./components/SessionsSection";

/**
 * Account settings: one card per concern, each with its own form and its own
 * errors, so a failure saving the profile never blocks a password change.
 * Reading width (`measure`): these are forms, not a dashboard.
 */
export function Settings() {
  // Bumped when a password change signs other devices out, so the device
  // list reloads instead of showing sessions that no longer exist.
  const [sessionsVersion, setSessionsVersion] = useState(0);

  return (
    <AuthenticatedLayout title="Settings" width="measure">
      <Stack gap="r2">
        <ProfileSection />
        <PasswordSection onOtherSessionsRevoked={() => setSessionsVersion((v) => v + 1)} />
        <SessionsSection refreshKey={sessionsVersion} />
        <DangerZoneSection />
      </Stack>
    </AuthenticatedLayout>
  );
}

export default Settings;
