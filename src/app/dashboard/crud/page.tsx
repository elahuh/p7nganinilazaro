"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/lib/theme-context";
import { fetchWithAuth } from "@/lib/api";

export default function CreatePage() {
  const { theme } = useTheme();
  const [entityType, setEntityType] = useState("users");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchAllItems();
  }, [entityType]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let endpoint = entityType === "users" ? "/users" : "/positions";
      const payload = entityType === "users"
        ? { username, password, role }
        : { position_code: positionCode, position_name: positionName };

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let body: any;
        try { body = await response.json(); } catch { body = await response.text(); }
        setMessage(`Error: ${body?.error || body?.message || response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessage(entityType === "users" ? "User created successfully!" : "Position created successfully!");
      setCreated(data);
      // reset form
      setUsername("");
      setPassword("");
      setRole("user");
      setPositionCode("");
      setPositionName("");
      await fetchAllItems();
    } catch (error: any) {
      setMessage(`Failed to create: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    setLoading(true);
    setMessage("");

    try {
      const endpoint = entityType === "users" ? "/users" : "/positions";
      const resp = await fetchWithAuth(endpoint, { method: "GET" });
      if (!resp.ok) {
        let body: any;
        try { body = await resp.json(); } catch { body = await resp.text(); }
        setMessage(`❌ Error ${resp.status}: ${body?.message || body}`);
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await resp.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setMessage(`Failed to fetch: ${err.message}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string | number) => {
    setLoading(true);
    setMessage("");

    try {
      const endpoint = entityType === "users" ? `/users/${id}` : `/positions/${id}`;
      const resp = await fetchWithAuth(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!resp.ok) {
        let body: any;
        try { body = await resp.json(); } catch { body = await resp.text(); }
        setMessage(`❌ Error ${resp.status}: ${body?.message || body}`);
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
      const endpoint = entityType === "users" ? `/users/${id}` : `/positions/${id}`;
      const resp = await fetchWithAuth(endpoint, { method: "DELETE" });
      if (!resp.ok) {
        let body: any;
        try { body = await resp.json(); } catch { body = await resp.text(); }
        setMessage(`❌ Error ${resp.status}: ${body?.message || body}`);
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
    <div className="min-h-screen p-6" style={{ backgroundColor: theme === "light" ? "#f9fafb" : "#0f172a" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4" style={{ color: theme === "light" ? "#111827" : "#e0e7ff" }}>
          Create / Manage
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Entity Type</label>
          <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="p-2 rounded border">
            <option value="users">Users</option>
            <option value="positions">Positions</option>
          </select>
        </div>

        <form onSubmit={handleCreate} className="space-y-6 mb-6">
          {entityType === "users" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 rounded border">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Position Code</label>
                <Input value={positionCode} onChange={(e) => setPositionCode(e.target.value)} placeholder="Position code" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position Name</label>
                <Input value={positionName} onChange={(e) => setPositionName(e.target.value)} placeholder="Position name" />
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : `Create ${entityType === "users" ? "User" : "Position"}`}
          </Button>
        </form>

        {message && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: message.includes("Error") ? "#fee2e2" : "#dcfce7" }}>
            {message}
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-3">All {entityType === "users" ? "Users" : "Positions"}</h2>

        <div className="space-y-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="text-center text-sm text-gray-500">No items to display</CardContent>
            </Card>
          ) : (
            items.map((item) => {
              const id = item[getPrimaryKey()];
              return (
                <Card key={id}>
                  <CardContent>
                    {editingId === id ? (
                      <div className="space-y-3">
                        {entityType === "users" ? (
                          <>
                            <Input value={editData.username || item.username || ""} onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
                            <Input type="password" placeholder="New password (leave empty to keep)" onChange={(e) => setEditData({ ...editData, password: e.target.value })} />
                            <select value={editData.role || item.role || "user"} onChange={(e) => setEditData({ ...editData, role: e.target.value })} className="p-2 rounded border">
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <Input value={editData.position_code || item.position_code || ""} onChange={(e) => setEditData({ ...editData, position_code: e.target.value })} />
                            <Input value={editData.position_name || item.position_name || ""} onChange={(e) => setEditData({ ...editData, position_name: e.target.value })} />
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdate(id)} disabled={loading} className="flex-1 text-white rounded" style={{ backgroundColor: "#10b981" }}>Save</Button>
                          <Button onClick={() => setEditingId(null)} disabled={loading} className="flex-1" style={{ backgroundColor: "#6b7280", color: "white" }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-3">
                          {entityType === "users" ? (
                            <>
                              <p><strong>ID:</strong> {item.id}</p>
                              <p><strong>Username:</strong> {item.username}</p>
                              <p><strong>Role:</strong> {item.role}</p>
                            </>
                          ) : (
                            <>
                              <p><strong>Position ID:</strong> {item.position_id}</p>
                              <p><strong>Code:</strong> {item.position_code}</p>
                              <p><strong>Name:</strong> {item.position_name}</p>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => { setEditingId(id); setEditData(item); }} disabled={loading} className="flex-1 text-white" style={{ backgroundColor: "var(--accent)" }}>Edit</Button>
                          <Button onClick={() => handleDelete(id)} disabled={loading} className="flex-1 text-white" style={{ backgroundColor: "#ef4444" }}>Delete</Button>
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
  );
}
