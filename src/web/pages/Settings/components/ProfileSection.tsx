import {
  AvatarUpload,
  Card,
  Field,
  Form,
  FormActions,
  Input,
  Stack,
  useForm,
  useToast,
} from "@batthewz/r-ui-react-components";

import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE } from "@/shared/schemas/upload";
import { updateProfileSchema } from "@/shared/schemas/user";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { api, ApiError, apiUpload } from "@/web/lib/api/client";
import { updateUser, useSession } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";

interface AvatarUploadResponse {
  upload: { url: string };
}

/**
 * Photo and display name. The photo saves on its own (crop, then upload with
 * progress, cancel and retry, all r-ui's `AvatarUpload`); the name saves with
 * its form. Both refresh the session afterwards so the header's avatar and
 * name change at once, not on the next reload.
 */
export function ProfileSection() {
  const { toast } = useToast();
  const { data: session, refetch } = useSession();
  const user = session?.user;

  const form = useForm({
    schema: updateProfileSchema,
    defaultValues: { name: user?.name ?? "" },
    onSubmit: async (values, { setErrors, reset }) => {
      try {
        const { error } = await updateUser(values);
        if (error) {
          setErrors({
            "": authErrorMessage(error, "We couldn't save your profile. Please try again."),
          });
          return;
        }
        reset(values);
        toast({ title: "Profile updated", tone: "success" });
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  async function removeAvatar() {
    try {
      await api.delete("/api/users/me/avatar");
      await refetch();
    } catch (error) {
      toast({
        title: "Couldn't remove your photo",
        description: error instanceof ApiError ? error.message : NETWORK_ERROR_MESSAGE,
        tone: "error",
      });
    }
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Profile</Card.Title>
        <Card.Description>How you appear in the app.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="r2">
          <Field>
            <Field.Label>Photo</Field.Label>
            <AvatarUpload<string>
              personName={user?.name}
              value={user?.image ?? null}
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              maxSize={MAX_AVATAR_SIZE}
              outputType="image/webp"
              onUpload={async (file, { signal, onProgress }) => {
                const body = new FormData();
                body.append("file", file, "avatar.webp");
                const result = await apiUpload<AvatarUploadResponse>("/api/users/me/avatar", body, {
                  signal,
                  onProgress,
                });
                await refetch();
                return result.upload.url;
              }}
              onValueChange={(value: string | null) => {
                if (value === null) void removeAvatar();
              }}
            />
            <Field.Description>
              JPEG, PNG, GIF or WebP, up to {MAX_AVATAR_SIZE / (1024 * 1024)} MB.
            </Field.Description>
            <Field.Error />
          </Field>

          <Form form={form}>
            <Stack gap="r3">
              <FormAlert form={form} />
              <Field name="name" required>
                <Field.Label>Display name</Field.Label>
                <Input autoComplete="name" />
                <Field.Error />
              </Field>
              <FormActions>
                <FormActions.Submit>Save changes</FormActions.Submit>
              </FormActions>
            </Stack>
          </Form>
        </Stack>
      </Card.Body>
    </Card>
  );
}
