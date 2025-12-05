"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function UpdatePositionPage() {
  const [id, setId] = useState("");
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState<any>(null);

  const handleSearchPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/positions/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || data.message}`);
        setPosition(null);
        return;
      }

      setPosition(data);
      setPositionCode(data.position_code);
      setPositionName(data.position_name);
      setMessage("Position found");
    } catch (error) {
      setMessage("Failed to fetch position");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return;

    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/positions/${position.position_id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ position_code: positionCode, position_name: positionName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || data.message}`);
        return;
      }

      setMessage("Position updated successfully!");
      setPosition(data);
    } catch (error) {
      setMessage("Failed to update position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          Update Position
        </h1>

        {!position ? (
          <form onSubmit={handleSearchPosition} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
                Position ID
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter position ID"
                  required
                  style={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#e2e8f0",
                    flex: 1,
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                    color: "white",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#1e293b", borderLeft: "4px solid #6366f1" }}>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Editing Position ID: {position.position_id}</p>
            </div>

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

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-lg font-medium transition"
                style={{
                  background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                  color: "white",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Updating..." : "Update Position"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setPosition(null);
                  setId("");
                  setPositionCode("");
                  setPositionName("");
                  setMessage("");
                }}
                style={{
                  background: "linear-gradient(to right, #64748b, #475569)",
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

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
      </div>
    </div>
  );
}
