// frontend/src/pages/MenuPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MenuPage: React.FC = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") ?? "ユーザ";
  const role = localStorage.getItem("role") ?? "USER";

  const isEngineer = role === "ENGINEER" || role === "USER";
  const isSales = role === "SALES";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: 40,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        ようこそ、{username} さん
      </h1>

      <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32 }}>
        ロール: <span style={{ fontWeight: 600 }}>{role}</span>
      </p>

      {/* スワイプボタン（エンジニア） */}
      {isEngineer && (
        <button
          onClick={() => navigate("/swipe")}
          style={{
            margin: 12,
            padding: "14px 24px",
            borderRadius: 12,
            background: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            minWidth: 220,
          }}
        >
          🔥 案件スワイプへ
        </button>
      )}

      {/* 案件登録（営業） */}
      {isSales && (
        <button
          onClick={() => navigate("/project/create")}
          style={{
            display: "block",
            margin: "16px auto 0",
            padding: "14px 24px",
            borderRadius: 12,
            background: "#10b981",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            minWidth: 220,
          }}
        >
          ✏️ 案件登録へ
        </button>
      )}

      {/* 🔥 ログアウト（共通） */}
      <button
        onClick={handleLogout}
        style={{
          display: "block",
          margin: "40px auto 0",
          padding: "12px 22px",
          borderRadius: 12,
          background: "#ef4444",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          minWidth: 200,
        }}
      >
        🚪 ログアウト
      </button>
    </div>
  );
};

export default MenuPage;