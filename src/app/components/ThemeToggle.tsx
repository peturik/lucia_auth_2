// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const storeSetTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    // setTheme(theme === "dark" ? "light" : "dark");
    setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark");
    storeSetTheme(
      theme === "dark" || resolvedTheme === "dark" ? "light" : "dark",
    );
  };

  return (
    <button onClick={toggleTheme} className="">
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
