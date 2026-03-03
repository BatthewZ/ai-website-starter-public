# UI Components

The component library is built from scratch (no third-party UI kit). Every component uses the [design system tokens](../design-system/design-system.md), accepts a `className` prop for overrides via `cn()`, and uses `forwardRef`. No JS animation libraries — CSS only.

## Layout Primitives

Structural components for page composition.

| Component                  | Description                              |
| -------------------------- | ---------------------------------------- |
| [Stack](layout.md#stack)   | Vertical flex layout with responsive gap |
| [Row](layout.md#row)       | Horizontal flex with alignment controls  |
| [Center](layout.md#center) | Centers content on both axes             |
| [Container](layout.md#container) | Max-width wrapper (`sm`/`md`/`lg`/`xl`) |
| [Spacer](layout.md#spacer) | Flex spacer                              |
| [Divider](layout.md#divider) | Horizontal/vertical rule               |
| [AuthenticatedLayout](layout.md#authenticatedlayout) | Pre-configured AppShell for authenticated pages |

[Layout docs →](layout.md)

## Application Shell

| Component                      | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| [AppShell](app-shell.md)       | Responsive sidebar + navbar grid layout with mobile drawer               |

The `AppShell` is a compound component (`AppShell.Navbar`, `AppShell.Sidebar`, `AppShell.Main`, etc.) that provides the top-level page structure for authenticated views. See also [`AuthenticatedLayout`](layout.md#authenticatedlayout) which wraps AppShell with sign-out and navigation.

[AppShell docs →](app-shell.md)

## UI Components

General-purpose interactive and display primitives.

| Component                          | Description                                            |
| ---------------------------------- | ------------------------------------------------------ |
| [Button](button.md)                | Variants: primary, secondary, ghost, ghost-inverse, danger, link |
| [IconButton](icon-button.md)       | Square icon-only button                                |
| [Card](card.md)                    | Surface container with padding and shadow              |
| [Text](text.md)                    | Typography primitive with responsive text scaling      |
| [Badge](badge.md)                  | Status/label indicator (success, warning, error, info) |
| [Alert](alert.md)                  | Block-level status message                             |
| [Spinner](spinner.md)              | Loading indicator                                      |
| [Skeleton](skeleton.md)            | Loading placeholder                                    |
| [Avatar](avatar.md)                | User avatar with image/initials fallback               |
| [Dialog](dialog.md)                | Modal overlay using native `<dialog>`                  |
| [Tabs](tabs.md)                    | Animated tab bar (underline, pill, enclosed)            |
| [Accordion](accordion.md)          | Expand/collapse sections                               |
| [Breadcrumbs](breadcrumbs.md)      | Navigation trail with collapsible overflow             |
| [Pagination](pagination.md)        | Page navigation with numbered buttons or compact view  |
| [EmptyState](empty-state.md)       | Centered placeholder for empty/no-results views        |
| [Toast](toast.md)                  | Toast notifications via `ToastContext`                  |
| [ThemeSwitcher](theme-switcher.md) | Theme toggle component                                 |
| [ErrorBoundary](error-boundary.md) | React error boundary with fallback                     |
| [Portal](portal.md)               | Renders children into a DOM node via `createPortal`    |
| [FileUpload](file-upload.md)      | Drag-and-drop file upload dropzone                     |
| [AvatarUpload](avatar-upload.md)  | Circular avatar upload with optimistic preview         |

## Overlay Components

Floating UI components for contextual actions, information, and navigation. Built on `@floating-ui/react` via the shared [`useFloating`](hooks.md#usefloating) hook.

| Component                              | Description                                                       |
| -------------------------------------- | ----------------------------------------------------------------- |
| [Tooltip](tooltip.md)                  | Hover/focus tooltip with configurable delay and placement         |
| [Popover](popover.md)                  | Click-triggered floating dialog panel with focus trapping         |
| [DropdownMenu](dropdown-menu.md)       | Menu with keyboard navigation, typeahead, and ARIA menu pattern   |

## Data Components

Structured data display components for tabular content.

| Component                          | Description                                                               |
| ---------------------------------- | ------------------------------------------------------------------------- |
| [Table](table.md)                  | Low-level compound table primitive with density, striping, and sort icons |
| [DataTable](data-table.md)         | High-level typed table with sorting, selection, pagination, and loading   |

## Display Components

Rich visual components for content presentation.

| Component                      | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| [Hero](hero.md)                | Full-width hero section with background and overlay |
| [MediaCard](media-card.md)     | Image card with overlay and hover effects           |
| [Carousel](carousel.md)        | Horizontal scroll with snap scrolling and arrows    |
| [Swimlane](swimlane.md)        | Title + Carousel (Netflix-style browse row)         |
| [MasonryGrid](masonry-grid.md) | CSS columns-based variable-height grid              |
| [Spotlight](spotlight.md)       | Alternating image + text feature section            |
| [Timeline](timeline.md)        | Vertical timeline with animated nodes               |
| [StatCard](stat-card.md)       | Large number with trend indicator and count-up      |
| [ProgressBar](progress-bar.md) | Animated fill bar with accessible markup            |

## Form Components

Input primitives and form structure.

| Component                          | Description                    |
| ---------------------------------- | ------------------------------ |
| [Field](forms.md#field)            | Label + input + error wrapper  |
| [Label](forms.md#label)            | Form label                     |
| [Input](forms.md#input)            | Text input with focus styling  |
| [Textarea](forms.md#textarea)      | Multi-line input               |
| [Select](forms.md#select)          | Native select dropdown         |
| [Checkbox](forms.md#checkbox)      | Styled checkbox                |
| [Radio](forms.md#radio)            | Styled radio button            |
| [FieldError](forms.md#fielderror)  | Inline validation error        |
| [FormActions](forms.md#formactions) | Button row for form submission |
| [SearchInput](search-input.md)     | Search input with icon, clear button, and Escape-to-clear |

[Form docs →](forms.md)

## Animation Primitives

Behavioral wrappers that control how components appear, move, and transition.

| Component                                       | Description                           |
| ----------------------------------------------- | ------------------------------------- |
| [ScrollReveal](animations.md#scrollreveal)      | Animates children into view on scroll |
| [Stagger](animations.md#stagger)                | Cascading entrance delays for lists   |
| [AnimatePresence](animations.md#animatepresence) | Mount/unmount animation wrapper       |
| [ViewTransition](animations.md#viewtransition)  | Browser View Transitions API wrapper  |
| [Parallax](animations.md#parallax)              | Scroll-linked depth effect            |

[Animation docs →](animations.md)

## Shared Hooks

Hooks shared across multiple UI components.

| Hook                                                      | Description                                                    |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| [useFloating](hooks.md#usefloating)                       | `@floating-ui/react` wrapper with project defaults             |
| [useClickOutside](hooks.md#useclickoutside)               | Fires a callback on mouse/touch events outside an element      |
| [useFocusTrap](hooks.md#usefocustrap)                     | Traps Tab/Shift+Tab within a container                         |
| [useRovingFocus](hooks.md#userovingfocus)                 | Roving tabindex keyboard navigation                            |
| [useFileUpload](hooks.md#usefileupload)                   | File upload state management with validation                   |
| [useDocumentTitle](hooks.md#usedocumenttitle)             | Sets document title with app name suffix, restores on unmount  |
| [usePrefersReducedMotion](hooks.md#useprefersreducedmotion) | Reactively tracks `prefers-reduced-motion` media query       |
| [useApi](hooks.md#useapi)                                 | GET data-fetching with loading/error state and refetch         |
| [useTheme](hooks.md#usetheme)                             | Read and switch the active theme, persisted to localStorage    |
| [useDebounce](hooks.md#usedebounce)                       | Debounces a value with a configurable delay                    |

[Hooks docs →](hooks.md)
