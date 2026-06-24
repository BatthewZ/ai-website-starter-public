import { Popover, useActiveSection } from "@batthewz/response-ui-react-components";
import { List } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { groupedToc, TOC_SECTIONS } from "./toc";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Scroll-spy lives here, inside the TOC components, rather than at the Demo
 * root. Keeping it local means the IntersectionObserver's frequent updates only
 * re-render the small TOC, not the entire (very large) demo content tree.
 */
function useTocActiveId() {
  const sectionIds = useMemo(() => TOC_SECTIONS.map((s) => s.id), []);
  return useActiveSection(sectionIds);
}

/* ── Desktop Sidebar ── */

export function DemoTableOfContents() {
  const activeId = useTocActiveId();
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeRef.current && navRef.current) {
      const nav = navRef.current;
      const link = activeRef.current;
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      // Auto-scroll if active link is outside visible area
      if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
        link.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [activeId]);

  const groups = groupedToc();

  return (
    <nav ref={navRef} aria-label="Table of contents">
      {groups.map(({ group, items }) => (
        <div key={group}>
          <div className="demo-toc__group-title">{group}</div>
          {items.map((entry) => (
            <a
              key={entry.id}
              ref={entry.id === activeId ? activeRef : undefined}
              href={`#${entry.id}`}
              className={`demo-toc__link${entry.id === activeId ? " demo-toc__link--active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                history.replaceState(null, "", `#${entry.id}`);
                scrollToSection(entry.id);
              }}
            >
              {entry.title}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}

/* ── Mobile Floating Bubble ── */

export function DemoTocMobile() {
  const activeId = useTocActiveId();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const activeTitle =
    TOC_SECTIONS.find((s) => s.id === activeId)?.title ?? "Sections";

  const handleSelect = useCallback((id: string) => {
    setOpen(false);
    history.replaceState(null, "", `#${id}`);
    requestAnimationFrame(() => scrollToSection(id));
  }, []);

  // Scroll active link into view inside panel
  useEffect(() => {
    if (!open || !panelRef.current || !activeId) return;
    const active = panelRef.current.querySelector("[data-active]");
    if (active) active.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [open, activeId]);

  const groups = groupedToc();

  return (
    <div className="toc-bubble">
      <Popover placement="top-start" offset={12} open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="toc-bubble__fab">
          <List size={18} className="toc-bubble__icon" />
          <span className="toc-bubble__label">{activeTitle}</span>
        </Popover.Trigger>
        <Popover.Content className="toc-bubble__panel">
          <nav ref={panelRef} aria-label="Sections">
            {groups.map(({ group, items }) => (
              <div key={group}>
                <div className="toc-bubble__group">{group}</div>
                {items.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    data-active={entry.id === activeId || undefined}
                    className={`toc-bubble__link${entry.id === activeId ? " toc-bubble__link--active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(entry.id);
                    }}
                  >
                    {entry.title}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </Popover.Content>
      </Popover>
    </div>
  );
}
