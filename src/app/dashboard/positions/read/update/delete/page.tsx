"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function DeletePositionPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllPositions();
  }, []);

  const fetchAllPositions = async () => {
    setLoading(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/positions`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setPositions(data);
      } else {
        setPositions([]);
      }
    } catch (error) {
      setMessage("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/positions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || data.message}`);
        return;
      }

      setMessage(`Position ${id} deleted successfully!`);
      fetchAllPositions();
    } catch (error) {
      setMessage("Failed to delete position");
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
          Delete Position
        </h1>

        <form onSubmit={handleDeleteById} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="number"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="Enter position ID to delete"
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
          All Positions
        </h2>

        <div className="space-y-4">
          {positions.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No positions available</p>
          ) : (
            positions.map((item) => (
              <div
                key={item.position_id}
                className="p-4 rounded-lg border flex justify-between items-start"
                style={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  borderLeft: "4px solid #6366f1",
                }}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" style={{ color: "#e0e7ff" }}>
                    {item.position_name}
                  </h3>
                  <p style={{ color: "#cbd5e1" }}>Code: <strong>{item.position_code}</strong></p>
                  <p className="text-xs mt-2" style={{ color: "#64748b" }}>
                    ID: {item.position_id} | User ID: {item.user_id}
                  </p>
                </div>
                <Button
                  onClick={() => handleDelete(item.position_id)}
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
