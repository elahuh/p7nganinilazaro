"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/lib/theme-context";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Register failed");
      return;
    }

    router.push("/");
  }

  return (
    <div 
      className="flex items-center justify-center h-screen transition-colors duration-300"
      style={{
        background: theme === "light" 
          ? "linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)"
          : "linear-gradient(to bottom right, #111827, #1f2937, #374151)"
      }}
    >
      <Card 
        className="w-full max-w-md p-8 shadow-xl rounded-xl border"
        style={{
          backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
          borderColor: theme === "light" ? "#e5e7eb" : "#4b5563",
        }}
      >
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <h1 
              className="text-2xl font-bold text-center flex-1"
              style={{ color: "var(--accent)" }}
            >
              Create Account
            </h1>
            <ThemeToggle />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md"
              style={{
                backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                color: theme === "light" ? "#111827" : "#f9fafb",
              }}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md"
              style={{
                backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                color: theme === "light" ? "#111827" : "#f9fafb",
              }}
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <Button
              className="w-full text-white rounded-md transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--accent)",
              }}
              type="submit"
            >
              Register
            </Button>
          </form>

          <p className="mt-4 text-center text-sm" style={{ color: theme === "light" ? "#6b7280" : "#94a3b8" }}>
            Already have an account?{" "}
            <button
              onClick={() => router.push("/")}
              style={{ color: "var(--accent)", textDecoration: "none", cursor: "pointer", fontWeight: "500" }}
              className="hover:underline"
            >
              Sign In
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
