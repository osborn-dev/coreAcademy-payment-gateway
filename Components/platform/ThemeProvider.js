"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Theme model:
//   - "system": follow the OS (prefers-color-scheme), live-updating
//   - "light" / "dark": explicit user override, saved to localStorage
// The actual `.dark` class on <html> is applied by applyTheme() and, on first
// paint, by the inline ThemeScript below (so there's no flash of the wrong theme).

const STORAGE_KEY = "coreacademy-theme";
const ThemeContext = createContext(null);

// Inline script injected in <head> before any paint. It reads the saved choice
// (or OS preference) and sets the .dark class on <html> synchronously, avoiding
// a flash. Kept as a string so it runs before React hydrates.
export const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem('${STORAGE_KEY}');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = saved === 'dark' || ((!saved || saved === 'system') && systemDark);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

function systemPrefersDark() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  const dark = theme === "dark" || (theme === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }) {
  // Default to "system"; the real value is read from storage on mount.
  const [theme, setThemeState] = useState("system");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const initial = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  // When following the system, react to OS changes live.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
  }, []);

  // Convenience: flip between light and dark (an explicit override).
  const toggle = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
