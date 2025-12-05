"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function CreatePositionPage() {
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState<any>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE}/positions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ position_code: positionCode, position_name: positionName }),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.error || error.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setMessage("Position created successfully!");
      setCreated(data);
      setPositionCode("");
      setPositionName("");
    } catch (error: any) {
      setMessage(`Failed to create position: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          Create Position
        </h1>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
              Position Code
            </label>
            <Input
              type="text"
              value={positionCode}
              onChange={(e) => setPositionCode(e.target.value)}
              placeholder="e.g., MGR001"
              required
              style={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                color: "#e2e8f0",
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
              Position Name
            </label>
            <Input
              type="text"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              placeholder="e.g., Manager"
              required
              style={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                color: "#e2e8f0",
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium transition"
            style={{
              background: "linear-gradient(to right, #6366f1, #8b5cf6)",
              color: "white",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Position"}
          </Button>
        </form>

        {message && (
          <div
            className="mt-4 p-4 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: message.includes("Error") ? "#7f1d1d" : "#065f46",
              color: message.includes("Error") ? "#fecaca" : "#a7f3d0",
            }}
          >
            {message}
          </div>
        )}

        {created && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "#1e293b", borderLeft: "4px solid #6366f1" }}>
            <h3 className="font-semibold mb-2" style={{ color: "#e0e7ff" }}>
              Created Position:
            </h3>
            <pre style={{ color: "#a1a5b0" }}>{JSON.stringify(created, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
