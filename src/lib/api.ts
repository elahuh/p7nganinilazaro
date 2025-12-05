import { API_BASE } from "./config";
import { getToken, getRefreshToken, saveToken, logoutUser } from "./auth";

async function safeJson(resp: Response) {
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export async function fetchWithAuth(endpoint: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> || {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${API_BASE}${endpoint}`;
  console.log("[fetchWithAuth] Sending request to", url, "with headers:", headers);

  const response = await fetch(url, { ...opts, headers });

  if (response.status !== 401) {
    if (!response.ok) {
      const body = await safeJson(response);
      console.log("[fetchWithAuth] Non-OK response:", response.status, body);
    }
    return response;
  }

  // Received 401 -> try refresh token
  console.warn("[fetchWithAuth] Received 401, attempting refresh");
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn("[fetchWithAuth] No refresh token available, logging out");
    logoutUser();
    return response;
  }

  try {
    const refreshResp = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResp.ok) {
      console.warn("[fetchWithAuth] Refresh failed", refreshResp.status);
      logoutUser();
      return response;
    }

    const refreshData = await safeJson(refreshResp) as any;
    const newAccess = refreshData.accessToken || refreshData.access_token || refreshData.token;
    const newRefresh = refreshData.refreshToken || refreshData.refresh_token;

    if (!newAccess) {
      console.warn("[fetchWithAuth] Refresh response missing new access token", refreshData);
      logoutUser();
      return response;
    }

    // Save new tokens
    saveToken(newAccess, newRefresh);

    // Retry original request with new token
    const retryHeaders = {
      ...(opts.headers as Record<string, string> || {}),
      Authorization: `Bearer ${newAccess}`,
    };

    console.log("[fetchWithAuth] Retrying original request with new access token");
    const retryResp = await fetch(url, { ...opts, headers: retryHeaders });
    if (!retryResp.ok) {
      const body = await safeJson(retryResp);
      console.log("[fetchWithAuth] Retry returned non-OK:", retryResp.status, body);
    }
    return retryResp;
  } catch (err) {
    console.error("[fetchWithAuth] Error during refresh attempt:", err);
    logoutUser();
    return response;
  }
}
