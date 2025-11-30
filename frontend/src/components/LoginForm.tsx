// frontend/src/LoginForm.tsx
import React, { useState } from "react";
import { login, setToken } from "../api";

type Props = {
  onLoggedIn: () => void;
};

const LoginForm: React.FC<Props> = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("test");      // 初期値はお好みで
  const [password, setPassword] = useState("password");  // 初期値はお好みで
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token } = await login(username, password);

      // トークン保存
      setToken(token);

      // 親に「ログインできたよ」と伝える
      onLoggedIn();
    } catch (err) {
      console.error(err);
      setError("ログインに失敗しました。ユーザー名とパスワードを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #e0f2fe 0, #eff6ff 40%, #f9fafb 100%)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 24,
          boxShadow:
            "0 20px 45px rgba(15,23,42,0.12), 0 0 0 1px rgba(148,163,184,0.3)",
          padding: 24,
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 8,
            color: "#0f172a",
          }}
        >
          案件スワイプにログイン
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            marginBottom: 20,
          }}
        >
          テストユーザーでログインして、案件カードをスワイプしてみよう。
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#475569",
                marginBottom: 6,
              }}
            >
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid #cbd5f5",
                outline: "none",
                fontSize: 14,
              }}
              placeholder="test"
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#475569",
                marginBottom: 6,
              }}
            >
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid #cbd5f5",
                outline: "none",
                fontSize: 14,
              }}
              placeholder="password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: 8,
                marginBottom: 8,
                padding: "8px 12px",
                borderRadius: 12,
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              // 🔵 元の「詳細を見る」ボタン系に近い青〜紫グラデ
              background:
                "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
              color: "#f9fafb",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow:
                "0 10px 25px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.25)",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(1px)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;