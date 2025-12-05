"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function ReadPositionsPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllPositions();
  }, []);

  const fetchAllPositions = async () => {
    setLoading(true);
    setMessage("");

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
        if (data && data.message) {
          setMessage(`Info: ${data.message}`);
        }
      }
    } catch (error) {
      setMessage("Failed to fetch positions");
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
      const response = await fetch(`${API_BASE}/positions/${searchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || data.message}`);
        setPositions([]);
        return;
      }

      setPositions([data]);
      setMessage("Position found");
    } catch (error) {
      setMessage("Failed to search position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          Read Positions
        </h1>

        <form onSubmit={handleSearchById} className="flex gap-2 mb-6">
          <Input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter position ID to search"
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
            onClick={fetchAllPositions}
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
          {positions.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No positions found</p>
          ) : (
            positions.map((item) => (
              <div
                key={item.position_id}
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
                      {item.position_name}
                    </h3>
                    <p style={{ color: "#cbd5e1" }}>Code: <strong>{item.position_code}</strong></p>
                    <p className="text-xs mt-2" style={{ color: "#64748b" }}>
                      ID: {item.position_id} | User ID: {item.user_id} | Created: {item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}
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
