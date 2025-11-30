import React, { useState } from "react";
import { apiFetch } from "../api";

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
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // 返却されるトークン名に合わせて必要ならここを変更
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

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
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #1e293b 0, #020617 40%, #000 100%)",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(15,23,42,0.9)",
          borderRadius: "16px",
          padding: "24px 24px 28px",
          boxShadow:
            "0 25px 50px -12px rgba(15,23,42,0.9), 0 0 0 1px rgba(148,163,184,0.2)",
          color: "#e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "4px",
            color: "#f9fafb",
          }}
        >
          SES Like にログイン
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            marginBottom: "20px",
          }}
        >
          テストユーザー（ユーザー名: <b>test</b>, パスワード:{" "}
          <b>password</b>）でログインできます。
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <div style={{ display: "grid", gap: "4px" }}>
            <label
              htmlFor="username"
              style={{ fontSize: "13px", fontWeight: 500, color: "#e5e7eb" }}
            >
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                color: "#f9fafb",
                fontSize: "14px",
              }}
              autoComplete="username"
            />
          </div>

          <div style={{ display: "grid", gap: "4px" }}>
            <label
              htmlFor="password"
              style={{ fontSize: "13px", fontWeight: 500, color: "#e5e7eb" }}
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                backgroundColor: "#020617",
                color: "#f9fafb",
                fontSize: "14px",
              }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: "12px",
                color: "#f97373",
                marginTop: "4px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "6px",
              padding: "12px 16px",
              width: "100%",
              borderRadius: "999px",
              border: "none",
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              backgroundImage: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
              boxShadow:
                "0 10px 25px -5px rgba(96,165,250,0.4), 0 0 0 1px rgba(167,139,250,0.3)",
              transition: "all 0.2s ease",
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