import { Divider, Stack } from "@/web/components/layout";
import { Text } from "@/web/components/ui";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  const sectionId = id ?? slugify(title);

  return (
    <Stack gap="r4" id={sectionId} className="scroll-mt-20">
      <Text variant="h4">{title}</Text>
      <Divider />
      {children}
    </Stack>
  );
}

export function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack gap="r5">
      <Text variant="body-2" color="secondary" weight="semibold">
        {label}
      </Text>
      {children}
    </Stack>
  );
}
