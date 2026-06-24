export interface TocEntry {
  id: string;
  title: string;
  group: string;
}

export const TOC_SECTIONS: TocEntry[] = [
  // Core
  { id: "typography", title: "Typography", group: "Core" },
  { id: "buttons", title: "Buttons", group: "Core" },
  { id: "badges", title: "Badges", group: "Core" },
  { id: "alerts", title: "Alerts", group: "Core" },
  { id: "toasts", title: "Toasts", group: "Core" },
  { id: "cards", title: "Cards", group: "Core" },
  { id: "dialog", title: "Dialog", group: "Core" },
  { id: "spinner", title: "Spinner", group: "Core" },
  { id: "dividers", title: "Dividers", group: "Core" },
  { id: "codeblock", title: "Code Block", group: "Core" },
  { id: "copybutton", title: "Copy Button", group: "Core" },
  { id: "kbd", title: "Kbd", group: "Core" },

  // Layout
  { id: "layout-stack-row", title: "Stack & Row", group: "Layout" },
  { id: "layout-container-sizes", title: "Container Sizes", group: "Layout" },
  { id: "layout-center", title: "Center", group: "Layout" },

  // Forms
  { id: "form-components", title: "Form Components", group: "Forms" },
  { id: "search-input", title: "Search Input", group: "Forms" },
  { id: "form-states", title: "Form States", group: "Forms" },
  { id: "combobox", title: "Combobox", group: "Forms" },
  { id: "multiselect", title: "Multi-Select", group: "Forms" },
  { id: "colorpicker", title: "Color Picker", group: "Forms" },
  { id: "numberinput", title: "Number Input", group: "Forms" },
  { id: "otpinput", title: "OTP Input", group: "Forms" },
  { id: "slider", title: "Slider", group: "Forms" },
  { id: "rangeslider", title: "Range Slider", group: "Forms" },
  { id: "switch", title: "Switch", group: "Forms" },
  { id: "taginput", title: "Tag Input", group: "Forms" },
  { id: "validated-form", title: "Validated Form", group: "Forms" },

  // Dates
  { id: "calendar", title: "Calendar", group: "Dates" },
  { id: "rangecalendar", title: "Range Calendar", group: "Dates" },
  { id: "datepicker", title: "Date Picker", group: "Dates" },
  { id: "daterangepicker", title: "Date Range Picker", group: "Dates" },

  // Data Display
  { id: "color-palette", title: "Color Palette", group: "Data Display" },
  { id: "avatars", title: "Avatars", group: "Data Display" },
  { id: "progress-bars", title: "Progress Bars", group: "Data Display" },
  { id: "stat-cards", title: "Stat Cards", group: "Data Display" },
  { id: "sparkline", title: "Sparkline", group: "Data Display" },
  { id: "progressring", title: "Progress Ring", group: "Data Display" },
  { id: "meter", title: "Meter", group: "Data Display" },
  { id: "rating", title: "Rating", group: "Data Display" },
  { id: "descriptionlist", title: "Description List", group: "Data Display" },
  { id: "activityfeed", title: "Activity Feed", group: "Data Display" },

  // Navigation
  { id: "tabs", title: "Tabs", group: "Navigation" },
  { id: "accordion", title: "Accordion", group: "Navigation" },
  { id: "collapsible", title: "Collapsible", group: "Navigation" },

  // Media
  { id: "media-cards", title: "Media Cards", group: "Media" },
  { id: "carousel", title: "Carousel", group: "Media" },
  { id: "swimlane", title: "Swimlane", group: "Media" },
  { id: "spotlight", title: "Spotlight", group: "Media" },
  { id: "timeline", title: "Timeline", group: "Media" },
  { id: "masonry-grid", title: "Masonry Grid", group: "Media" },

  // Animation
  { id: "animatepresence", title: "AnimatePresence", group: "Animation" },
  { id: "viewtransition", title: "ViewTransition", group: "Animation" },
  { id: "parallax", title: "Parallax", group: "Animation" },

  // Patterns
  { id: "app-shell", title: "App Shell", group: "Patterns" },
  { id: "emptystate", title: "EmptyState", group: "Patterns" },
  { id: "breadcrumbs", title: "Breadcrumbs", group: "Patterns" },
  { id: "pagination", title: "Pagination", group: "Patterns" },
  { id: "skeleton", title: "Skeleton", group: "Patterns" },
  { id: "stepper", title: "Stepper", group: "Patterns" },
  { id: "wizard", title: "Wizard", group: "Patterns" },

  // Overlays
  { id: "tooltip", title: "Tooltip", group: "Overlays" },
  { id: "popover", title: "Popover", group: "Overlays" },
  { id: "dropdown-menu", title: "Dropdown Menu", group: "Overlays" },
  { id: "drawer", title: "Drawer", group: "Overlays" },
  { id: "contextmenu", title: "Context Menu", group: "Overlays" },
  { id: "hovercard", title: "Hover Card", group: "Overlays" },
  { id: "commandpalette", title: "Command Palette", group: "Overlays" },

  // Data
  { id: "table", title: "Table", group: "Data" },
  { id: "datatable", title: "DataTable", group: "Data" },
  { id: "fileupload", title: "FileUpload", group: "Data" },
  { id: "avatarupload", title: "AvatarUpload", group: "Data" },
  { id: "virtualizeddatatable", title: "Virtualized Table", group: "Data" },
];

export function groupedToc(): { group: string; items: TocEntry[] }[] {
  const groups: { group: string; items: TocEntry[] }[] = [];
  let current: { group: string; items: TocEntry[] } | null = null;

  for (const entry of TOC_SECTIONS) {
    if (!current || current.group !== entry.group) {
      current = { group: entry.group, items: [] };
      groups.push(current);
    }
    current.items.push(entry);
  }

  return groups;
}
