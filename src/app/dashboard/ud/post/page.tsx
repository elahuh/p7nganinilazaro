"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function PostPage() {
  const [endpoint, setEndpoint] = useState("users");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResponse(null);

    try {
      const parsedData = JSON.parse(data);
      const token = getToken();

      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(parsedData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${responseData.error || responseData.message}`);
        return;
      }

      setMessage("POST request successful!");
      setResponse(responseData);
      setData("");
    } catch (error: any) {
      setMessage(error.message || "Failed to send POST request");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    setData(template);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#0f172a" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: "#e0e7ff" }}>
          POST Request
        </h1>

        <form onSubmit={handlePost} className="space-y-6">
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
              <option value="users">POST /users (Create User)</option>
              <option value="positions">POST /positions (Create Position)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#c7d2fe" }}>
              JSON Data
            </label>
            <Textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder='Enter JSON data'
              required
              style={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                color: "#e2e8f0",
                minHeight: "200px",
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
              {loading ? "Sending..." : "Send POST Request"}
            </Button>
            <Button
              type="button"
              onClick={() => setData("")}
              style={{
                background: "linear-gradient(to right, #64748b, #475569)",
                color: "white",
              }}
            >
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={() =>
                handleTemplateClick(
                  JSON.stringify(
                    { username: "john_doe", password: "password123", role: "user" },
                    null,
                    2
                  )
                )
              }
              style={{
                background: "linear-gradient(to right, #10b981, #14b8a6)",
                color: "white",
              }}
            >
              User Template
            </Button>
            <Button
              type="button"
              onClick={() =>
                handleTemplateClick(
                  JSON.stringify(
                    { position_code: "MGR001", position_name: "Manager" },
                    null,
                    2
                  )
                )
              }
              style={{
                background: "linear-gradient(to right, #10b981, #14b8a6)",
                color: "white",
              }}
            >
              Position Template
            </Button>
          </div>
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

        {response && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "#1e293b", borderLeft: "4px solid #6366f1" }}>
            <h3 className="font-semibold mb-2" style={{ color: "#e0e7ff" }}>
              Response:
            </h3>
            <pre style={{ color: "#a1a5b0", overflowX: "auto" }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
