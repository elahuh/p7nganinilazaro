"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getToken } from "@/lib/auth";
import { useTheme } from "@/lib/theme-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function GetPage() {
  const { theme } = useTheme();
  const [entityType, setEntityType] = useState("users");
  const [items, setItems] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllItems();
  }, [entityType]);

  const fetchAllItems = async () => {
    setLoading(true);
    setMessage("");
    setSearchId("");
    setEditingId(null);

    try {
      const token = getToken();
      if (!token) {
        setMessage("❌ Error: No authentication token found. Please log in again.");
        setItems([]);
        setLoading(false);
        return;
      }

      console.log("Token:", token.substring(0, 20) + "..."); // Log first 20 chars
      const endpoint = entityType === "users" ? "/users" : "/positions";
      const url = `${API_BASE}${endpoint}`;
      console.log("Fetching from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        let errorMsg = response.statusText;
        let fullError = "";
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || response.statusText;
          fullError = JSON.stringify(error, null, 2);
          console.log("Error response:", error);
        } catch (e) {
          // Response wasn't JSON, try to get text
          try {
            fullError = await response.text();
          } catch (e2) {
            fullError = "Could not read error details";
          }
        }
        setMessage(`❌ Error ${response.status}: ${errorMsg}\n\nDetails:\n${fullError}`);
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
      setMessage(`✅ Loaded ${Array.isArray(data) ? data.length : 0} items`);
    } catch (error: any) {
      setMessage(`Failed to fetch: ${error.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setLoading(true);
    setMessage("");

    try {
      const token = getToken();
      if (!token) {
        setMessage("Error: No authentication token found.");
        setLoading(false);
        return;
      }

      const endpoint = entityType === "users" ? `/users/${searchId}` : `/positions/${searchId}`;
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
        console.log(`[Search API Error] Status: ${response.status}, Message: ${errorMsg}, Body:`, fullError);
        setMessage(`❌ Error ${response.status}: ${errorMsg}\n\nDetails:\n${fullError}`);
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setItems([data]);
      setMessage(`✅ Found ${entityType === "users" ? "user" : "position"}`);
    } catch (error: any) {
      setMessage(`Search failed: ${error.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string | number) => {
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
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
        console.log(`[Update API Error] Status: ${response.status}, Message: ${errorMsg}, Body:`, fullError);
        setMessage(`❌ Error ${response.status}: ${errorMsg}\n\nDetails:\n${fullError}`);
        setLoading(false);
        return;
      }

      setMessage("✅ Updated successfully");
      setEditingId(null);
      setEditData({});
      await fetchAllItems();
    } catch (error: any) {
      setMessage(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this?")) return;

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
        console.log(`[Delete API Error] Status: ${response.status}, Message: ${errorMsg}, Body:`, fullError);
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
  const getDisplayName = () => (entityType === "users" ? "username" : "position_name");

  return (
    <div className="p-8" style={{ color: theme === "light" ? "#111827" : "#f9fafb" }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--accent)" }}>
        Get, Update & Delete
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1">
          <Card style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}>
            <CardContent className="p-6 space-y-4">
              {/* Entity Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Entity Type</label>
                <select
                  value={entityType}
                  onChange={(e) => {
                    setEntityType(e.target.value);
                    setEditingId(null);
                    setSearchId("");
                  }}
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

              {/* Search by ID */}
              <form onSubmit={handleSearchById} className="space-y-2">
                <label className="block text-sm font-medium">Search by ID</label>
                <Input
                  type="text"
                  placeholder={`Enter ${entityType === "users" ? "user" : "position"} ID`}
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  style={{
                    backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                    borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                    color: theme === "light" ? "#111827" : "#f9fafb",
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white rounded"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Search
                </Button>
              </form>

              <Button
                onClick={fetchAllItems}
                disabled={loading}
                className="w-full text-white rounded"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Load All
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
        </div>

        {/* Items Display */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.length === 0 ? (
              <Card style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}>
                <CardContent className="p-6 text-center text-gray-500">
                  No items to display
                </CardContent>
              </Card>
            ) : (
              items.map((item, idx) => {
                const primaryKey = getPrimaryKey();
                const id = item[primaryKey];
                const displayName = getDisplayName();

                // Ensure a stable, unique key: prefer real id, otherwise fall back to entity+index
                const reactKey = id !== undefined && id !== null ? `${entityType}-${id}` : `${entityType}-idx-${idx}`;

                return (
                  <Card
                    key={reactKey}
                    style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}
                  >
                    <CardContent className="p-6">
                      {editingId === id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          {entityType === "users" ? (
                            <>
                              <div>
                                <label className="text-sm font-medium">Username</label>
                                <Input
                                  value={editData.username || item.username || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, username: e.target.value })
                                  }
                                  style={{
                                    backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                                    borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                                    color: theme === "light" ? "#111827" : "#f9fafb",
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Password (leave empty to keep)</label>
                                <Input
                                  type="password"
                                  placeholder="New password"
                                  onChange={(e) =>
                                    setEditData({ ...editData, password: e.target.value })
                                  }
                                  style={{
                                    backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                                    borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                                    color: theme === "light" ? "#111827" : "#f9fafb",
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Role</label>
                                <select
                                  value={editData.role || item.role || "user"}
                                  onChange={(e) =>
                                    setEditData({ ...editData, role: e.target.value })
                                  }
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
                          ) : (
                            <>
                              <div>
                                <label className="text-sm font-medium">Position Code</label>
                                <Input
                                  value={editData.position_code || item.position_code || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, position_code: e.target.value })
                                  }
                                  style={{
                                    backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                                    borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                                    color: theme === "light" ? "#111827" : "#f9fafb",
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Position Name</label>
                                <Input
                                  value={editData.position_name || item.position_name || ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, position_name: e.target.value })
                                  }
                                  style={{
                                    backgroundColor: theme === "light" ? "#f3f4f6" : "#111827",
                                    borderColor: theme === "light" ? "#d1d5db" : "#4b5563",
                                    color: theme === "light" ? "#111827" : "#f9fafb",
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdate(id)}
                              disabled={loading}
                              className="flex-1 text-white rounded"
                              style={{ backgroundColor: "#10b981" }}
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingId(null)}
                              disabled={loading}
                              className="flex-1 text-white rounded"
                              style={{ backgroundColor: "#6b7280" }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="mb-4">
                            {entityType === "users" ? (
                              <>
                                <p>
                                  <strong>ID:</strong> {item.id}
                                </p>
                                <p>
                                  <strong>Username:</strong> {item.username}
                                </p>
                                <p>
                                  <strong>Role:</strong> {item.role}
                                </p>
                                {item.created_at && (
                                  <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(item.created_at).toLocaleDateString()}
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                <p>
                                  <strong>Position ID:</strong> {item.position_id}
                                </p>
                                <p>
                                  <strong>Code:</strong> {item.position_code}
                                </p>
                                <p>
                                  <strong>Name:</strong> {item.position_name}
                                </p>
                                <p>
                                  <strong>User ID:</strong> {item.user_id || item.id}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setEditingId(id);
                                setEditData(item);
                              }}
                              disabled={loading}
                              className="flex-1 text-white rounded"
                              style={{ backgroundColor: "var(--accent)" }}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(id)}
                              disabled={loading}
                              className="flex-1 text-white rounded"
                              style={{ backgroundColor: "#ef4444" }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
