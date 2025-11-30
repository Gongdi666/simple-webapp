// frontend/src/api.ts

// バックエンドのベースURL
// ・Railway 本番: VITE_API_BASE_URL を環境変数で渡す
// ・ローカル: .env.development が無い場合でも 8080 にフォールバック
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ローカルストレージから JWT を取得
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// 共通 API 呼び出し関数
export const apiFetch = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  // 絶対URLが渡された場合はそのまま、それ以外は BASE_URL から組み立て
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const mergedHeaders: HeadersInit = {
    ...baseHeaders,
    ...(options.headers ?? {}),
  };

  if (token) {
    (mergedHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  if (!res.ok) {
    // 必要に応じてここでステータスごとのハンドリングを追加してもOK
    throw new Error(`API error: ${res.status}`);
  }

  return res;
};