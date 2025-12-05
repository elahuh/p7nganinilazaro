"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getToken } from "@/lib/auth";
import { useTheme } from "@/lib/theme-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function CreatePage() {
  const { theme } = useTheme();
  const [entityType, setEntityType] = useState("users");
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      const endpoint = entityType === "users" ? "/users" : "/positions";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || response.statusText;
        } catch (e) {
          // Response wasn't JSON
        }
        setMessage(`Error ${response.status}: ${errorMsg}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessage(`✅ ${data.message || "Created successfully"}`);
      setFormData({});
    } catch (error: any) {
      setMessage(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8" style={{ color: theme === "light" ? "#111827" : "#f9fafb" }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--accent)" }}>
        Create New Entity
      </h1>

      <Card className="max-w-2xl" style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}>
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Entity Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Entity Type</label>
              <select
                value={entityType}
                name="type"
                className="w-full p-2 rounded border"
                style={{
                  backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                  borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                  color: theme === "light" ? "#111827" : "#f9fafb",
                }}
                onChange={(e) => {
                  setEntityType(e.target.value);
                  setFormData({});
                }}
              >
                <option value="users">Users</option>
                <option value="positions">Positions</option>
              </select>
            </div>

            {/* Users Fields */}
            {entityType === "users" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                      borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                      color: theme === "light" ? "#111827" : "#f9fafb",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                      borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                      color: theme === "light" ? "#111827" : "#f9fafb",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role || "user"}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border"
                    style={{
                      backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                      borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                      color: theme === "light" ? "#111827" : "#f9fafb",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            {/* Positions Fields */}
            {entityType === "positions" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Position Code</label>
                  <Input
                    type="text"
                    name="position_code"
                    placeholder="e.g., MGR001"
                    value={formData.position_code || ""}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                      borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                      color: theme === "light" ? "#111827" : "#f9fafb",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Position Name</label>
                  <Input
                    type="text"
                    name="position_name"
                    placeholder="e.g., Manager"
                    value={formData.position_name || ""}
                    onChange={handleInputChange}
                    style={{
                      backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                      borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                      color: theme === "light" ? "#111827" : "#f9fafb",
                    }}
                  />
                </div>
              </>
            )}

            {message && (
              <p
                className="p-2 rounded text-sm"
                style={{
                  backgroundColor: message.includes("Error") ? "#fee2e2" : "#dcfce7",
                  color: message.includes("Error") ? "#991b1b" : "#166534",
                }}
              >
                {message}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
