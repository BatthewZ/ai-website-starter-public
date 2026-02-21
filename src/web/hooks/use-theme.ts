import { useCallback, useSyncExternalStore } from "react";

export const THEMES = ["default", "events", "grimdark", "tech"] as const;
type Theme = (typeof THEMES)[number];

export const STORAGE_KEY = "theme";

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return THEMES.includes(attr as Theme) ? (attr as Theme) : "default";
}

function getServerSnapshot(): Theme {
  return "default";
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "data-theme") {
        callback();
        break;
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    if (next === "default") {
      document.documentElement.removeAttribute("data-theme");
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* private browsing */ }
    } else {
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private browsing */ }
    }
  }, []);

  return { theme, setTheme, themes: THEMES };
}

export type { Theme };
