"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadWorkspace, patchStoredTheme, STORAGE_KEY_V1, STORAGE_KEY_V2, type ThemeName } from "../lib/storage";

type ThemeContextValue = {
  theme: ThemeName;
  hydrated: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const workspace = loadWorkspace(localStorage.getItem(STORAGE_KEY_V2), localStorage.getItem(STORAGE_KEY_V1));
      setThemeState(workspace.theme);
      document.documentElement.dataset.theme = workspace.theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
    setHydrated(true);
  }, []);

  function setTheme(next: ThemeName) {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY_V2, patchStoredTheme(localStorage.getItem(STORAGE_KEY_V2), next));
    } catch {
      /* The toggle still updates this visit if storage is blocked. */
    }
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return <ThemeContext.Provider value={{ theme, hydrated, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
