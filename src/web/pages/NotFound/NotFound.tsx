import { Button, Center, Stack, Text, useDocumentTitle } from "@batthewz/response-ui-react-components";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  useDocumentTitle("Page Not Found");
  const navigate = useNavigate();

  return (
    <Center className="min-h-screen bg-surface-1">
      <Stack gap="r3" className="items-center text-center">
        <Text variant="h1" color="secondary">
          404
        </Text>
        <Text variant="h4">Page not found</Text>
        <Text variant="body-1" color="secondary">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button variant="primary" onClick={() => void navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </Stack>
    </Center>
  );
}

export default NotFound;
