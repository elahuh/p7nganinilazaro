"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function GetPage() {
  const [endpoint, setEndpoint] = useState("users");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handleGetAll = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setResponse(data);
      setMessage(`Retrieved ${Array.isArray(data) ? data.length : 1} item(s)`);
    } catch (error) {
      setMessage("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/${endpoint}/${query}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error || data.message}`);
        setResponse(null);
        return;
      }

      setResponse(data);
      setMessage("Item found");
    } catch (error) {
      setMessage("Failed to fetch item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          GET Request
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
              Endpoint
            </label>
            <select
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
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
              <option value="users">GET /users</option>
              <option value="positions">GET /positions</option>
            </select>
          </div>

          <form onSubmit={handleGetById} className="flex gap-2">
            <Input
              type="number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Enter ${endpoint.slice(0, -1)} ID to retrieve`}
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
              {loading ? "Loading..." : "Get by ID"}
            </Button>
          </form>

          <Button
            onClick={handleGetAll}
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium"
            style={{
              background: "linear-gradient(to right, #10b981, #14b8a6)",
              color: "white",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : `Get All ${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`}
          </Button>
        </div>

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

        {response && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "#1e293b", borderLeft: "4px solid #6366f1" }}>
            <h3 className="font-semibold mb-2" style={{ color: "#e0e7ff" }}>
              Response:
            </h3>
            <pre style={{ color: "#a1a5b0", overflowX: "auto", maxHeight: "500px", overflow: "auto" }}>
              {typeof response === "object"
                ? JSON.stringify(response, null, 2)
                : response}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: "#1e293b", borderLeft: "4px solid #8b5cf6" }}>
          <h3 className="font-semibold mb-2" style={{ color: "#e0e7ff" }}>
            Available Endpoints
          </h3>
          <ul style={{ color: "#cbd5e1", fontSize: "14px" }} className="space-y-1">
            <li><code style={{ color: "#a1a5b0" }}>GET /users</code> - Get all users</li>
            <li><code style={{ color: "#a1a5b0" }}>GET /users/:id</code> - Get user by ID</li>
            <li><code style={{ color: "#a1a5b0" }}>POST /users</code> - Create user</li>
            <li><code style={{ color: "#a1a5b0" }}>PUT /users/:id</code> - Update user</li>
            <li><code style={{ color: "#a1a5b0" }}>DELETE /users/:id</code> - Delete user</li>
            <li><code style={{ color: "#a1a5b0" }}>GET /positions</code> - Get all positions</li>
            <li><code style={{ color: "#a1a5b0" }}>GET /positions/:id</code> - Get position by ID</li>
            <li><code style={{ color: "#a1a5b0" }}>POST /positions</code> - Create position</li>
            <li><code style={{ color: "#a1a5b0" }}>PUT /positions/:id</code> - Update position</li>
            <li><code style={{ color: "#a1a5b0" }}>DELETE /positions/:id</code> - Delete position</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
