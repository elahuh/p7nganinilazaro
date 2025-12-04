"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type Color = "indigo" | "blue" | "purple" | "rose" | "emerald" | "cyan";

interface ThemeContextType {
  theme: Theme;
  color: Color;
  setTheme: (theme: Theme) => void;
  setColor: (color: Color) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [color, setColorState] = useState<Color>("indigo");

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    const savedColor = (localStorage.getItem("color") as Color) || "indigo";

    setThemeState(savedTheme);
    setColorState(savedColor);
    applyTheme(savedTheme, savedColor);
  }, []);

  const applyTheme = (newTheme: Theme, newColor: Color) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.setAttribute("data-color", newColor);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme, color);
  };

  const setColor = (newColor: Color) => {
    setColorState(newColor);
    localStorage.setItem("color", newColor);
    applyTheme(theme, newColor);
  };

  return (
    <ThemeContext.Provider value={{ theme, color, setTheme, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
