"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "garden" | "apothecary";
interface Ctx { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void; }

const ThemeCtx = createContext<Ctx>({ theme: "garden", toggle: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("garden");

  // Hydrate from localStorage / system preference on mount.
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("remedia-theme")) as Theme | null;
    const prefersDark = typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "apothecary" : "garden");
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("remedia-theme", t); } catch {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "garden" ? "apothecary" : "garden");
  }, [theme, setTheme]);

  return <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

/** Tiny inline script to prevent flash-of-wrong-theme. Inject into <head>. */
export const THEME_INIT_SCRIPT = `
(function(){try{
  var t=localStorage.getItem('remedia-theme');
  if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'apothecary':'garden';}
  document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();
`;
