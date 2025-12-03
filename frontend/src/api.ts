// frontend/src/api.ts

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

// JWT Token Utilities
export const getToken = (): string | null => localStorage.getItem("token");
export const setToken = (token: string): void => localStorage.setItem("token", token);
export const clearToken = (): void => localStorage.removeItem("token");

// -----------------------------
// ◎ 共通 API 呼び出し
// -----------------------------
export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // OPTIONS のように Body が無いレスポンスも正常扱いする
  if (res.status === 204 || res.status === 200 && res.headers.get("Content-Length") === "0") {
    return null; // POST を阻害せず通過させる
  }

  if (res.status === 401 || res.status === 403) {
    clearToken();
    throw new Error(`Unauthorized: ${res.status}`);
  }

  if (!res.ok) {
    let text = "";
    try {
      text = await res.text();
    } catch (_) {
      text = "";
    }
    throw new Error(text || `API Error: ${res.status}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// -----------------------------
// ◎ Login
// -----------------------------
export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  return (await res.json()) as { token: string };
};