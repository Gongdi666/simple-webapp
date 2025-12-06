import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  role: string; // ENGINEER / SALES / ADMIN
  username: string;
};

const MenuPage: React.FC<Props> = ({ role, username }) => {
  const navigate = useNavigate();

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    marginBottom: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg, #60a5fa, #a855f7, #ec4899)",
    color: "white",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#020617",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: 24, fontSize: "1.3rem" }}>
        ようこそ、{username} さん
      </h2>

      {/* ENGINEER メニュー */}
      {(role === "ENGINEER" || role === "ADMIN") && (
        <>
          <h3 style={{ alignSelf: "flex-start", marginBottom: 10 }}>
            エンジニア向け
          </h3>

          <button style={buttonStyle} onClick={() => navigate("/swipe")}>
            🔥 案件スワイプ
          </button>
        </>
      )}

      {/* SALES メニュー */}
      {(role === "SALES" || role === "ADMIN") && (
        <>
          <h3 style={{ alignSelf: "flex-start", marginTop: 24, marginBottom: 10 }}>
            営業向け
          </h3>

          <button style={buttonStyle} onClick={() => navigate("/project/new")}>
            📄 案件登録
          </button>

          <button style={buttonStyle} onClick={() => navigate("/projects")}>
            📚 登録済み案件一覧
          </button>
        </>
      )}

      {/* 管理者向けメニュー（今は最低限） */}
      {role === "ADMIN" && (
        <>
          <h3 style={{ alignSelf: "flex-start", marginTop: 24, marginBottom: 10 }}>
            管理者向け
          </h3>

          <button style={buttonStyle} onClick={() => navigate("/admin")}>
            🛠 管理者ページ（今後実装）
          </button>
        </>
      )}
    </div>
  );
};

export default MenuPage;