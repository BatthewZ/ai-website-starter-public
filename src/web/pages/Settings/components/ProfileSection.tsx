import { Alert, AvatarUpload, Button, Card, Field, Input, Label, Stack, Text } from "@batthewz/response-ui-react-components";
import { useState } from "react";

import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE } from "@/shared/schemas/upload";
import { updateProfileSchema } from "@/shared/schemas/user";
import { api } from "@/web/lib/api/client";
import { updateUser, useSession } from "@/web/lib/auth/auth-client";

export function ProfileSection() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = updateProfileSchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await updateUser({ name });
      if (updateError) {
        setError(updateError.message ?? "Failed to update profile");
        return;
      }
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <Stack gap="r4">
        <Text variant="h5">Profile</Text>

        <AvatarUpload
          src={session?.user?.image}
          name={session?.user?.name ?? ""}
          size="xl"
          accept={ALLOWED_IMAGE_TYPES}
          maxSize={MAX_AVATAR_SIZE}
          onUpload={async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const result = await api.put<{ upload: { url: string } }>(
              "/api/users/me/avatar",
              formData
            );
            return { url: result.upload.url };
          }}
        />

        <form onSubmit={(e) => void handleSubmit(e)}>
          <Stack gap="r4">
            <Field>
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!error}
              />
            </Field>

            {error && <Alert variant="error">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
