# Form Components

Composable form primitives that share consistent styling, focus rings, and error-state behavior. All components accept `className` for overrides (merged via `cn()`), use `forwardRef`, and spread remaining props onto the root element.

---

## Field

Wrapper that groups a label, input, and error message into a vertical stack. Provides a `FieldContext` that passes a generated `errorId` to child `FieldError` and input components for accessible `aria-describedby` linkage.

**Source:** `src/web/components/form/Field.tsx`

### Props

| Prop        | Type        | Default | Description            |
| ----------- | ----------- | ------- | ---------------------- |
| `className` | `string`    | --      | Additional CSS classes |
| `children`  | `ReactNode` | --      | Label, input, error    |

Also accepts all `div` props.

### Base Classes

```
flex flex-col gap-r6
```

### Context Exports

- **`useFieldContext()`** -- Returns `{ errorId: string } | null`. Used internally by `FieldError` and form controls.
- **`useFieldErrorProps(error)`** -- Returns `{ "aria-invalid": "true" | undefined, "aria-describedby": string | undefined }`. Used by `Input`, `Textarea`, and `Select` to wire up accessibility attributes when `error` is `true`.

### Usage

```tsx
import { Field } from "@/web/components/form/Field";
import { Label } from "@/web/components/form/Label";
import { Input } from "@/web/components/form/Input";
import { FieldError } from "@/web/components/form/FieldError";

<Field>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" error={!!errors.email} />
  <FieldError>{errors.email?.message}</FieldError>
</Field>;
```

When `error` is `true` on the input:

1. The input gets `aria-invalid="true"`.
2. The input gets `aria-describedby` pointing to the `FieldError` element's `id`.
3. `FieldError` renders with that matching `id` and `role="alert"`.

---

## Label

Standard form label with design-system typography.

**Source:** `src/web/components/form/Label.tsx`

### Props

| Prop        | Type     | Default | Description                     |
| ----------- | -------- | ------- | ------------------------------- |
| `htmlFor`   | `string` | --      | ID of the associated form input |
| `className` | `string` | --      | Additional CSS classes          |

Also accepts all `label` props.

### Base Classes

```
text-body-2 font-semibold text-fg-primary
```

### Usage

```tsx
<Label htmlFor="name">Full Name</Label>
```

---

## Input

Text input with consistent sizing, focus ring, disabled state, and error styling. Integrates with `Field` context for accessible error linkage via `useFieldErrorProps`.

**Source:** `src/web/components/form/Input.tsx`

### Props

| Prop        | Type      | Default | Description                       |
| ----------- | --------- | ------- | --------------------------------- |
| `error`     | `boolean` | --      | Apply error border and focus ring |
| `className` | `string`  | --      | Additional CSS classes            |

Also accepts all native `input` props (`type`, `placeholder`, `disabled`, `value`, `onChange`, etc.).

### Base Classes

```
w-full px-r4 py-r5 text-body-2
bg-surface-0 border border-border-strong rounded-md
placeholder:text-fg-muted
duration-fast
focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-0 focus:border-border-focus
disabled:bg-surface-3 disabled:cursor-not-allowed
```

When `error` is `true`:

```
border-status-error focus:ring-status-error
```

### Usage

```tsx
{
  /* Basic text input */
}
<Input placeholder="Enter your name" />;

{
  /* Email input */
}
<Input type="email" placeholder="you@example.com" />;

{
  /* Password input */
}
<Input type="password" />;

{
  /* With error state */
}
<Input error placeholder="Required field" />;

{
  /* Disabled */
}
<Input disabled value="Cannot edit" />;
```

---

## Textarea

Multi-line text input. Shares the same styling as `Input` with added minimum height and vertical resize. Also integrates with `Field` context via `useFieldErrorProps`.

**Source:** `src/web/components/form/Textarea.tsx`

### Props

| Prop        | Type      | Default | Description                       |
| ----------- | --------- | ------- | --------------------------------- |
| `error`     | `boolean` | --      | Apply error border and focus ring |
| `className` | `string`  | --      | Additional CSS classes            |

Also accepts all native `textarea` props.

### Base Classes

Same as `Input`, plus:

```
min-h-[100px] resize-y
```

### Usage

```tsx
{
  /* Basic textarea */
}
<Textarea placeholder="Write your message..." />;

{
  /* With error */
}
<Textarea error placeholder="This field is required" />;

{
  /* Custom height */
}
<Textarea className="min-h-50" placeholder="Write a longer response..." />;
```

---

## Select

Native select dropdown. Shares base styling with `Input` and adds a custom chevron caret via an inline SVG background image. Integrates with `Field` context via `useFieldErrorProps`.

**Source:** `src/web/components/form/Select.tsx`

### Props

| Prop        | Type      | Default | Description                       |
| ----------- | --------- | ------- | --------------------------------- |
| `error`     | `boolean` | --      | Apply error border and focus ring |
| `className` | `string`  | --      | Additional CSS classes            |

Also accepts all native `select` props. Pass `<option>` elements as children.

### Base Classes

Same as `Input`, plus:

```
appearance-none bg-no-repeat bg-position-[right_0.5rem_center] bg-size-[1.5em_1.5em] pr-10
```

A custom chevron-down SVG is applied via `background-image`.

### Usage

```tsx
{
  /* Basic select */
}
<Select>
  <option value="">Choose a country...</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="ca">Canada</option>
</Select>;

{
  /* With error state */
}
<Select error>
  <option value="">Select a role...</option>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</Select>;

{
  /* Disabled */
}
<Select disabled>
  <option>Locked option</option>
</Select>;
```

---

## Checkbox

Styled native checkbox input. Renders a 16x16 (`size-4`) square with rounded corners.

**Source:** `src/web/components/form/Checkbox.tsx`

### Props

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | --      | Additional CSS classes |

Also accepts all native `input` props except `type` (which is always `"checkbox"`).

### Base Classes

```
size-4 rounded-sm border border-border-strong text-primary
focus:ring-2 focus:ring-border-focus focus:ring-offset-2
```

### Usage

```tsx
{
  /* Basic checkbox with a label */
}
<Row gap="r5">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to the terms</Label>
</Row>;

{
  /* Disabled checkbox */
}
<Row gap="r5">
  <Checkbox id="locked" disabled checked />
  <Label htmlFor="locked">Locked option</Label>
</Row>;
```

---

## Radio

Styled native radio input. Renders a 16x16 (`size-4`) circle.

**Source:** `src/web/components/form/Radio.tsx`

### Props

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | --      | Additional CSS classes |

Also accepts all native `input` props except `type` (which is always `"radio"`).

### Base Classes

```
size-4 rounded-full border border-border-strong text-primary
focus:ring-2 focus:ring-border-focus focus:ring-offset-2
```

### Usage

```tsx
{
  /* Radio group */
}
<Stack gap="r5">
  <Row gap="r5">
    <Radio id="plan-free" name="plan" value="free" />
    <Label htmlFor="plan-free">Free</Label>
  </Row>
  <Row gap="r5">
    <Radio id="plan-pro" name="plan" value="pro" />
    <Label htmlFor="plan-pro">Pro</Label>
  </Row>
  <Row gap="r5">
    <Radio id="plan-enterprise" name="plan" value="enterprise" />
    <Label htmlFor="plan-enterprise">Enterprise</Label>
  </Row>
</Stack>;
```

---

## FieldError

Inline validation error message. Renders nothing if `children` is falsy. When used inside a `Field`, it automatically receives the context-generated `id` so that inputs can reference it via `aria-describedby`.

**Source:** `src/web/components/form/FieldError.tsx`

### Props

| Prop        | Type        | Default | Description                                |
| ----------- | ----------- | ------- | ------------------------------------------ |
| `children`  | `ReactNode` | --      | Error message text (renders null if falsy) |
| `id`        | `string`    | --      | Override the auto-generated ID             |
| `className` | `string`    | --      | Additional CSS classes                     |

Also accepts all `p` props.

### Base Classes

```
text-body-3 text-status-error
```

The element has `role="alert"` for screen reader announcements.

### Usage

```tsx
{
  /* Conditionally rendered error */
}
<FieldError>{errors.email?.message}</FieldError>;

{
  /* Always visible error */
}
<FieldError>This field is required</FieldError>;

{
  /* No error -- renders nothing */
}
<FieldError>{undefined}</FieldError>;
```

---

## FormActions

Row of action buttons at the bottom of a form, right-aligned with a top padding separator.

**Source:** `src/web/components/form/FormActions.tsx`

### Props

| Prop        | Type        | Default | Description            |
| ----------- | ----------- | ------- | ---------------------- |
| `className` | `string`    | --      | Additional CSS classes |
| `children`  | `ReactNode` | --      | Buttons                |

Also accepts all `div` props.

### Base Classes

```
flex flex-row justify-end gap-r5 pt-r4
```

### Usage

```tsx
<FormActions>
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Save</Button>
</FormActions>
```

---

## Full Examples

### Basic Text Input Field

```tsx
<Field>
  <Label htmlFor="username">Username</Label>
  <Input id="username" placeholder="Enter username" />
</Field>
```

### Login Form

```tsx
<form>
  <Stack gap="r4">
    <Field>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" error={!!errors.email} />
      <FieldError>{errors.email?.message}</FieldError>
    </Field>

    <Field>
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter password" error={!!errors.password} />
      <FieldError>{errors.password?.message}</FieldError>
    </Field>

    <FormActions>
      <Button variant="primary" className="w-full">
        Sign In
      </Button>
    </FormActions>
  </Stack>
</form>
```

### Contact Form with Textarea

```tsx
<form>
  <Stack gap="r4">
    <Field>
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Your name" />
    </Field>

    <Field>
      <Label htmlFor="contact-email">Email</Label>
      <Input id="contact-email" type="email" placeholder="you@example.com" />
    </Field>

    <Field>
      <Label htmlFor="subject">Subject</Label>
      <Select id="subject">
        <option value="">Choose a topic...</option>
        <option value="general">General Inquiry</option>
        <option value="support">Support</option>
        <option value="billing">Billing</option>
      </Select>
    </Field>

    <Field>
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="How can we help?" />
      <FieldError>{errors.message?.message}</FieldError>
    </Field>

    <FormActions>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Send Message</Button>
    </FormActions>
  </Stack>
</form>
```

### Select Dropdown

```tsx
<Field>
  <Label htmlFor="country">Country</Label>
  <Select id="country" error={!!errors.country}>
    <option value="">Select a country...</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <option value="au">Australia</option>
  </Select>
  <FieldError>{errors.country?.message}</FieldError>
</Field>
```

### Checkbox Group

```tsx
<Field>
  <Label>Notifications</Label>
  <Stack gap="r5">
    <Row gap="r5">
      <Checkbox id="notify-email" name="notifications" />
      <Label htmlFor="notify-email">Email notifications</Label>
    </Row>
    <Row gap="r5">
      <Checkbox id="notify-sms" name="notifications" />
      <Label htmlFor="notify-sms">SMS notifications</Label>
    </Row>
    <Row gap="r5">
      <Checkbox id="notify-push" name="notifications" />
      <Label htmlFor="notify-push">Push notifications</Label>
    </Row>
  </Stack>
</Field>
```

### Radio Group

```tsx
<Field>
  <Label>Subscription Plan</Label>
  <Stack gap="r5">
    <Row gap="r5">
      <Radio id="plan-free" name="plan" value="free" />
      <Label htmlFor="plan-free">Free -- $0/month</Label>
    </Row>
    <Row gap="r5">
      <Radio id="plan-pro" name="plan" value="pro" />
      <Label htmlFor="plan-pro">Pro -- $9/month</Label>
    </Row>
    <Row gap="r5">
      <Radio id="plan-enterprise" name="plan" value="enterprise" />
      <Label htmlFor="plan-enterprise">Enterprise -- $29/month</Label>
    </Row>
  </Stack>
</Field>
```

---

## Accessibility Notes

- **Field + FieldError linkage:** When an `Input`, `Textarea`, or `Select` has `error={true}` inside a `Field`, the component automatically sets `aria-invalid="true"` and `aria-describedby` pointing to the `FieldError` element's `id`. This ensures screen readers announce the error when the input is focused.
- **FieldError role:** Each `FieldError` renders with `role="alert"`, which causes screen readers to announce the error message when it appears.
- **Label association:** Always provide `htmlFor` on `Label` matching the `id` on the corresponding input.
- **Focus ring:** All inputs share a consistent `focus:ring-2 focus:ring-border-focus` style for keyboard navigation visibility.
- **Disabled state:** Disabled inputs get `bg-surface-3` and `cursor-not-allowed` to visually communicate their state.
