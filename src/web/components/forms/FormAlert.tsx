import { Alert, type FormApi, useFormState } from "@batthewz/r-ui-react-components";
import { type ReactNode, useCallback, useSyncExternalStore } from "react";

interface FormAlertProps<TValues, TOutput> {
  form: FormApi<TValues, TOutput>;
  /** Headline above the message. Default: none; the message stands alone. */
  title?: ReactNode;
}

/**
 * The form-level error of a short form: what the server said about the form
 * as a whole ("Invalid email or password"), set with
 * `setErrors({ "": message })` in `onSubmit`.
 *
 * r-ui's `ErrorSummary` covers this too, but it also lists every field error,
 * which on a two-field auth form repeats the message printed under the field.
 * This shows only the errors no mounted Field owns. It registers as the form's
 * summary, so after a failed submit with no invalid field, focus moves here
 * and a screen reader reads the message (the alert is `role="alert"`).
 */
export function FormAlert<TValues, TOutput>({ form, title }: FormAlertProps<TValues, TOutput>) {
  const { store } = form;
  const { submitFailed } = useFormState(form);
  // Stable wrappers rather than the store's methods themselves: passing
  // `store.registerSummary` straight to `ref` makes the React Compiler treat
  // the whole store as a ref, and then every read of it in render is flagged.
  const subscribe = useCallback((onChange: () => void) => store.subscribe(onChange), [store]);
  const getEntries = useCallback(() => store.getErrorEntries(), [store]);
  const summaryRef = useCallback(
    (element: HTMLDivElement | null) => store.registerSummary(element),
    [store]
  );

  const entries = useSyncExternalStore(subscribe, getEntries, getEntries);
  const messages = entries.filter((entry) => !entry.field).map((entry) => entry.message);

  if (!submitFailed || messages.length === 0) return null;

  return (
    <Alert ref={summaryRef} tabIndex={-1} tone="error" title={title}>
      {messages.join(" ")}
    </Alert>
  );
}
