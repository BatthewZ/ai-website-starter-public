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

[Layout docs →](layout.md)

## UI Components

General-purpose interactive and display primitives.

| Component                          | Description                                            |
| ---------------------------------- | ------------------------------------------------------ |
| [Button](button.md)                | Variants: primary, secondary, ghost, danger, link      |
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
| [Toast](toast.md)                  | Toast notifications via `ToastContext`                  |
| [ThemeSwitcher](theme-switcher.md) | Theme toggle component                                 |
| [ErrorBoundary](error-boundary.md) | React error boundary with fallback                     |

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
