"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getToken } from "@/lib/auth";
import { useTheme } from "@/lib/theme-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function DeletePage() {
  const { theme } = useTheme();
  const [entityType, setEntityType] = useState("users");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllItems();
  }, [entityType]);

  const fetchAllItems = async () => {
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

      const endpoint = entityType === "users" ? "/users" : "/positions";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        let fullError = "";
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || response.statusText;
          fullError = JSON.stringify(error, null, 2);
        } catch (e) {
          try {
            fullError = await response.text();
          } catch (e2) {
            fullError = "Could not read error details";
          }
        }
        console.log(`[Delete Page Fetch Error] Status: ${response.status}, Message: ${errorMsg}, Body:`, fullError);
        setMessage(`❌ Error ${response.status}: ${errorMsg}\n\nDetails:\n${fullError}`);
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setMessage(`Failed to fetch: ${error.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("⚠️ Are you sure you want to delete this permanently?")) return;

    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found.");
        setLoading(false);
        return;
      }

      const endpoint = entityType === "users" ? `/users/${id}` : `/positions/${id}`;
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        let fullError = "";
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || response.statusText;
          fullError = JSON.stringify(error, null, 2);
        } catch (e) {
          try {
            fullError = await response.text();
          } catch (e2) {
            fullError = "Could not read error details";
          }
        }
        console.log(`[Delete Item Error] Status: ${response.status}, Message: ${errorMsg}, Body:`, fullError);
        setMessage(`❌ Error ${response.status}: ${errorMsg}\n\nDetails:\n${fullError}`);
        setLoading(false);
        return;
      }

      setMessage("✅ Deleted successfully");
      await fetchAllItems();
    } catch (error: any) {
      setMessage(`Delete failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryKey = () => (entityType === "users" ? "id" : "position_id");

  return (
    <div className="p-8" style={{ color: theme === "light" ? "#111827" : "#f9fafb" }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--accent)" }}>
        Delete Entities
      </h1>

      <Card className="max-w-4xl mb-6" style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}>
        <CardContent className="p-6 space-y-4">
          {/* Entity Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Entity Type</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full p-2 rounded border"
              style={{
                backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                color: theme === "light" ? "#111827" : "#f9fafb",
              }}
            >
              <option value="users">Users</option>
              <option value="positions">Positions</option>
            </select>
          </div>

          <Button
            onClick={fetchAllItems}
            disabled={loading}
            className="w-full text-white rounded"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Refresh List
          </Button>

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
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <Card style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}>
            <CardContent className="p-6 text-center text-gray-500">
              No items to display
            </CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const primaryKey = getPrimaryKey();
            const id = item[primaryKey];

            return (
              <Card
                key={id}
                style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}
              >
                <CardContent className="p-4">
                  <div className="mb-4">
                    {entityType === "users" ? (
                      <>
                        <p className="font-semibold">{item.username}</p>
                        <p className="text-sm text-gray-500">ID: {item.id}</p>
                        <p className="text-sm">Role: {item.role}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">{item.position_name}</p>
                        <p className="text-sm text-gray-500">{item.position_code}</p>
                        <p className="text-sm">Position ID: {item.position_id}</p>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDelete(id)}
                    disabled={loading}
                    className="w-full text-white rounded"
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
