const raw = process.env.NEXT_PUBLIC_API_BASE || "https://ela-gqf5.onrender.com";
// Remove surrounding quotes if present and trim trailing slash
const unquoted = raw.replace(/^"|"$/g, "");
export const API_BASE = unquoted.replace(/\/$/, "");