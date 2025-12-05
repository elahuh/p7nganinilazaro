"use client";

import { useState } from "react";
import { getToken } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/lib/theme-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";

export default function TestPage() {
  const { theme } = useTheme();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testToken = () => {
    const token = getToken();
    if (!token) {
      setResult("❌ No token found in localStorage");
    } else {
      // Try to decode JWT (without verification)
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const decoded = JSON.parse(atob(parts[1]));
          setResult(`✅ Token found:\n\nHeader: ${token.substring(0, 30)}...\n\nPayload:\n${JSON.stringify(decoded, null, 2)}\n\nToken length: ${token.length}`);
        } catch (e) {
          setResult(`✅ Token found but couldn't decode:\n${token.substring(0, 50)}...\n\nToken length: ${token.length}`);
        }
      } else {
        setResult(`✅ Token found (invalid format):\n${token.substring(0, 50)}...\n\nToken length: ${token.length}`);
      }
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "testuser", password: "testpass" }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(`✅ Login Success!\n\nStatus: ${response.status}\n\nResponse:\n${JSON.stringify(data, null, 2)}\n\nAccess Token:\n${data.accessToken?.substring(0, 50)}...`);
      } else {
        setResult(`❌ Login Failed\n\nStatus: ${response.status}\n\nResponse:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testUsersEndpoint = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setResult("❌ No token found. Please login first.");
        setLoading(false);
        return;
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log("Sending request with headers:", headers);

      const response = await fetch(`${API_BASE}/users`, {
        method: "GET",
        headers,
      });

      console.log("Response status:", response.status);

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }

      setResult(`Status: ${response.status}\n\nHeaders sent:\n${JSON.stringify(headers, null, 2)}\n\nResponse:\n${typeof data === "string" ? data : JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8" style={{ color: theme === "light" ? "#111827" : "#f9fafb" }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--accent)" }}>
        API Test Page
      </h1>

      <Card className="max-w-2xl mb-6" style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f2937" }}>
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm font-mono mb-2">API Base URL:</p>
            <p className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded break-all">{API_BASE}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={testToken} disabled={loading} style={{ backgroundColor: "var(--accent)" }} className="text-white">
              Check Token
            </Button>
            <Button onClick={testLogin} disabled={loading} style={{ backgroundColor: "var(--accent)" }} className="text-white">
              Test Login
            </Button>
            <Button onClick={testUsersEndpoint} disabled={loading} style={{ backgroundColor: "var(--accent)" }} className="text-white">
              Test /users Endpoint
            </Button>
            <Button onClick={async () => {
                setLoading(true);
                try {
                  const resp = await fetchWithAuth('/users', { method: 'GET' });
                  const text = await resp.text();
                  let data;
                  try { data = JSON.parse(text); } catch { data = text; }
                  setResult(`fetchWithAuth Status: ${resp.status}\n\nResponse:\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
                } catch (err: any) {
                  setResult(`❌ Error: ${err.message}`);
                } finally { setLoading(false); }
              }} disabled={loading} style={{ backgroundColor: "#2563eb" }} className="text-white">
              Test /users with fetchWithAuth
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-4 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono whitespace-pre-wrap break-words max-h-96 overflow-auto">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
