// frontend/src/api.ts

// 環境変数（Vite）から API のベース URL を取る
// Vercel 本番: VITE_API_BASE_URL="https://web-production-ca2f1.up.railway.app"
// ローカル開発: VITE_API_BASE_URL="http://localhost:8080" など
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

// ローカルストレージのトークン操作
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const clearToken = (): void => {
  localStorage.removeItem("token");
};

// パスからフル URL を作るヘルパー
const buildUrl = (path: string): string => {
  if (path.startsWith("http")) {
    return path;
  }
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};

// 認証付き共通 fetch
export const apiFetch = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res;
};

// ログイン専用 API
export const login = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const res = await fetch(buildUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    // 状態コードに応じてメッセージを変えたければここで分岐
    throw new Error(`Login failed: ${res.status}`);
  }

  // { "token": "xxxxx" } を想定
  return (await res.json()) as { token: string };
};