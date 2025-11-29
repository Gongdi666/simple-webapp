import React, { useState } from "react";

type Props = {
  onLoggedIn: () => void;
};

const LoginForm: React.FC<Props> = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("ログインに失敗しました");
      }

      const data = await res.json();

      // ★ JWT と一緒にユーザー名も保存
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      onLoggedIn();
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 24,
          background:
            "radial-gradient(circle at top left, #1f2937 0, #020617 70%)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
          border: "1px solid rgba(148,163,184,0.4)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          募集中SES案件
        </h1>
        <p style={{ opacity: 0.8, marginBottom: 16, fontSize: "0.9rem" }}>
          ログインして案件をスワイプしながらチェック
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: "0.85rem" }}>
            ユーザー名
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                backgroundColor: "rgba(15,23,42,0.85)",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </label>

          <label style={{ fontSize: "0.85rem" }}>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                backgroundColor: "rgba(15,23,42,0.85)",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                marginTop: 4,
                fontSize: "0.8rem",
                color: "#fca5a5",
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
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg, rgba(96,165,250), rgba(244,114,182))",
              fontWeight: 700,
              color: "#020617",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
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