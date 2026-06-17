"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

// Sun/Moon toggle. Flips between explicit light and dark. Renders a neutral
// placeholder until mounted so the icon matches the actually-applied theme
// (the inline script may have set .dark before React hydrates).
export default function ThemeToggle() {
  const { toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function onClick() {
    toggle();
    setIsDark(document.documentElement.classList.contains("dark"));
  }

  return (
    <button
      onClick={onClick}
      aria-label="Toggle light and dark theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
    >
      {!mounted ? (
        <span className="w-4 h-4" />
      ) : isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
