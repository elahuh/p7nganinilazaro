"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function ReadPage() {
  const [items, setItems] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        setItems([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.message || response.statusText}`);
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
        if (data && data.message) {
          setMessage(`Info: ${data.message}`);
        }
      }
    } catch (error: any) {
      setMessage(`Failed to fetch users: ${error.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        setItems([]);
        return;
      }

      const response = await fetch(`${API_BASE}/users/${searchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.message || response.statusText}`);
        setItems([]);
        return;
      }

      const data = await response.json();
      setItems([data]);
      setMessage("User found");
    } catch (error: any) {
      setMessage(`Failed to search user: ${error.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          Read Users
        </h1>

        <form onSubmit={handleSearchById} className="flex gap-2 mb-6">
          <Input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter user ID to search"
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
          <Button
            type="button"
            onClick={fetchAllUsers}
            disabled={loading}
            style={{
              background: "linear-gradient(to right, #10b981, #14b8a6)",
              color: "white",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Load All
          </Button>
        </form>

        {message && (
          <div
            className="mb-4 p-4 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: message.includes("Error") ? "#7f1d1d" : "#065f46",
              color: message.includes("Error") ? "#fecaca" : "#a7f3d0",
            }}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          {items.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No users found</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  borderLeft: "4px solid #6366f1",
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" style={{ color: "#e0e7ff" }}>
                      {item.username}
                    </h3>
                    <p style={{ color: "#cbd5e1" }}>Role: <strong>{item.role}</strong></p>
                    <p className="text-xs mt-2" style={{ color: "#64748b" }}>
                      ID: {item.id} | Created: {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
