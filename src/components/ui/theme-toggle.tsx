"use client";

import React from "react";
import { useTheme, type Theme, type Color } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";

const colors: { name: Color; light: string; dark: string; label: string }[] = [
  { name: "indigo", light: "#6366f1", dark: "#818cf8", label: "Indigo" },
  { name: "blue", light: "#3b82f6", dark: "#60a5fa", label: "Blue" },
  { name: "purple", light: "#a855f7", dark: "#d8b4fe", label: "Purple" },
  { name: "rose", light: "#f43f5e", dark: "#fb7185", label: "Rose" },
  { name: "emerald", light: "#10b981", dark: "#6ee7b7", label: "Emerald" },
  { name: "cyan", light: "#06b6d4", dark: "#22d3ee", label: "Cyan" },
];

export function ThemeToggle() {
  const { theme, color, setTheme, setColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const currentColor = colors.find((c) => c.name === color);
  const colorValue = theme === "light" ? currentColor?.light : currentColor?.dark;

  return (
    <div className="flex items-center gap-3">
      {/* Minimalist Theme Toggle Slider */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative inline-flex items-center h-7 w-12 rounded-full transition-all duration-300 hover:shadow-md active:scale-95"
        style={{
          backgroundColor: theme === "light" ? "#e5e7eb" : "#4b5563",
        }}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {/* Slider background */}
        <div className="absolute inset-0 rounded-full" />
        
        {/* Animated toggle circle */}
        <div
          className="absolute left-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center"
          style={{
            backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
            transform: theme === "light" ? "translateX(0)" : "translateX(20px)",
          }}
        >
          <div className="text-xs transition-opacity duration-300">
            {theme === "light" ? (
              <Moon size={14} />
            ) : (
              <Sun size={14} />
            )}
          </div>
        </div>
      </button>

      {/* Color Picker Button */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-6 h-6 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border"
          style={{
            backgroundColor: colorValue,
            borderColor: theme === "light" ? "#d1d5db" : "#6b7280",
            boxShadow: showColorPicker ? `0 0 0 2px ${theme === "light" ? "#ffffff" : "#1f2937"}, 0 0 0 3px ${colorValue}` : "none",
          }}
          aria-label="Choose accent color"
          title="Choose accent color"
        />

        {/* Color Picker Dropdown */}
        {showColorPicker && (
          <div
            className="absolute top-full right-0 mt-2 p-2 rounded-lg shadow-lg backdrop-blur-sm z-50 grid grid-cols-3 gap-2"
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
              border: `1px solid ${theme === "light" ? "#e5e7eb" : "#4b5563"}`,
            }}
          >
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setColor(c.name);
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: theme === "light" ? c.light : c.dark,
                  boxShadow: color === c.name ? `0 0 0 1.5px ${theme === "light" ? "#ffffff" : "#1f2937"}, 0 0 0 3px #000000` : "none",
                }}
                title={c.label}
              />
            ))}
          </div>
        )}  
      </div>
    </div>
  );
}
