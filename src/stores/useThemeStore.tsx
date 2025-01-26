"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

// export const useThemeStore = create<ThemeState>()((set) => {
//   const storedTheme = localStorage.getItem("theme");
//   const prefersDark =
//     typeof window !== "undefined" &&
//     window.matchMedia("(prefers-color-scheme: dark)").matches;

//   const initialTheme =
//     storedTheme && storedTheme !== "system"
//       ? storedTheme
//       : prefersDark
//       ? "dark"
//       : "light";

//   return {
//     theme: initialTheme, // Значення за замовчуванням
//     setTheme: (theme) => set({ theme }),
//   };
// });

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "", // Значення за замовчуванням
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme-color" }
  )
);
