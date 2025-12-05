"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function DeletePage() {
  const [items, setItems] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        setItems([]);
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
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error: any) {
      setMessage(`Failed to fetch users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(`Error: ${error.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setMessage(`User ${id} deleted successfully!`);
      fetchAllUsers();
    } catch (error: any) {
      setMessage(`Failed to delete user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteId) {
      await handleDelete(parseInt(deleteId));
      setDeleteId("");
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          Delete User
        </h1>

        <form onSubmit={handleDeleteById} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="number"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="Enter user ID to delete"
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
                background: "linear-gradient(to right, #dc2626, #b91c1c)",
                color: "white",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>

        {message && (
          <div
            className="mb-4 p-4 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: message.includes("Error") ? "#7f1d1d" : message.includes("deleted") ? "#7f1d1d" : "#065f46",
              color: message.includes("Error") ? "#fecaca" : message.includes("deleted") ? "#fecaca" : "#a7f3d0",
            }}
          >
            {message}
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4" style={{ color: "#e0e7ff" }}>
          All Users
        </h2>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No users available</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border flex justify-between items-start"
                style={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  borderLeft: "4px solid #6366f1",
                }}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" style={{ color: "#e0e7ff" }}>
                    {item.username}
                  </h3>
                  <p style={{ color: "#cbd5e1" }}>Role: <strong>{item.role}</strong></p>
                  <p className="text-xs mt-2" style={{ color: "#64748b" }}>
                    ID: {item.id}
                  </p>
                </div>
                <Button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(to right, #dc2626, #b91c1c)",
                    color: "white",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
