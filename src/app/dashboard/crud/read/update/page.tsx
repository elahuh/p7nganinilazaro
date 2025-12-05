"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function UpdatePage() {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [item, setItem] = useState<any>(null);

  const handleSearchItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        setItem(null);
        return;
      }

      const response = await fetch(`${API_BASE}/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.message || response.statusText}`);
        setItem(null);
        return;
      }

      const data = await response.json();
      setItem(data);
      setUsername(data.username);
      setRole(data.role);
      setMessage("User found");
    } catch (error: any) {
      setMessage(`Failed to fetch user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        return;
      }

      const updateData: any = { username, role };
      if (password) {
        updateData.password = password;
      }

      const response = await fetch(`${API_BASE}/users/${item.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setMessage("User updated successfully!");
      setItem(data);
    } catch (error: any) {
      setMessage(`Failed to update user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          Update User
        </h1>

        {!item ? (
          <form onSubmit={handleSearchItem} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
                User ID
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter user ID"
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
              <p className="text-sm" style={{ color: "#94a3b8" }}>Editing User ID: {item.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
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
                Password (leave empty to keep current)
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  color: "#e2e8f0",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #334155",
                  width: "100%",
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
                {loading ? "Updating..." : "Update User"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setItem(null);
                  setId("");
                  setUsername("");
                  setPassword("");
                  setRole("user");
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
