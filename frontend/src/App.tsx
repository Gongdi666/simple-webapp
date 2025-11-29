import React, { useEffect, useState } from "react";
import SwipeCard from "./components/SwipeCard";
import LoginForm from "./components/LoginForm";
import { apiFetch, getToken } from "./api";

export type SwipeItem = {
  id: number;
  title: string;
  client: string;
  techStack: string;
  unitPrice: number;
  workStyle: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<SwipeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getToken());
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SwipeItem | null>(null);

  // ログアウト時のアニメ＆トースト用
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLoggedOutToast, setShowLoggedOutToast] = useState(false);

  const username = localStorage.getItem("username") ?? "ログイン中";

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    apiFetch("/api/projects")
      .then((res) => res.json())
      .then((data: SwipeItem[]) => setItems(data))
      .catch((e) => {
        console.error("API取得に失敗しました", e);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const handleSwipe = (direction: string, id: number) => {
    console.log(`swiped ${direction}: id=${id}`);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleOpenDetail = (item: SwipeItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleLogout = () => {
    if (isLoggingOut) return; // 連打防止

    setIsLoggingOut(true);

    // フェードアウトさせてからログアウト処理
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setItems([]);
      setCurrentIndex(0);
      setSelectedItem(null);
      setIsLoggedIn(false);
      setIsLoggingOut(false);

      // 「ログアウトしました」トースト表示
      setShowLoggedOutToast(true);
      setTimeout(() => setShowLoggedOutToast(false), 1800);
    }, 350); // アニメ時間と合わせる
  };

  // 未ログイン時：ログインフォーム + トースト
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoggedIn={() => setIsLoggedIn(true)} />
        {showLoggedOutToast && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 18px",
              borderRadius: 999,
              background:
                "linear-gradient(135deg, rgba(96,165,250,0.95), rgba(244,114,182,0.95))",
              color: "#020617",
              fontSize: "0.85rem",
              fontWeight: 600,
              boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
              zIndex: 99999,
              whiteSpace: "nowrap",
            }}
          >
            ログアウトしました
          </div>
        )}
      </>
    );
  }

  // ローディング or データ無し
  if (loading || items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
        }}
      >
        案件を読み込み中...
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          display: "flex",
          justifyContent: "center",
          padding: "16px 12px",
          boxSizing: "border-box",
        }}
      >
        {/* ログアウト中は全体をふわっとフェード＋ちょい縮小 */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            opacity: isLoggingOut ? 0 : 1,
            transform: isLoggingOut ? "scale(0.97)" : "scale(1)",
            filter: isLoggingOut ? "blur(1px)" : "none",
            transition:
              "opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease",
          }}
        >
          {/* --- ヘッダー行（タイトル + ユーザーチップ） --- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
              flexWrap: "wrap", // 画面が狭いときは折り返す
            }}
          >
            <h1
              style={{
                // 画面幅に応じて自動でサイズ調整（ハイテクっぽい感じ）
                fontSize: "clamp(1.5rem, 4.8vw, 2.1rem)",
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.3,
                letterSpacing: "0.03em",
                flex: "1 1 180px",
                // グラデーション文字
                background: "linear-gradient(135deg,#e5e7eb,#a5b4fc)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              募集中SES案件
            </h1>

            {/* ハイテクっぽいログアウトチップ */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: "none",
                padding: 0,
                cursor: isLoggingOut ? "default" : "pointer",
                background: "transparent",
                flexShrink: 0, // タイトルに押しつぶされないよう固定
              }}
              aria-label="ログアウト"
              title="クリックでログアウト"
            >
              <div
                style={{
                  padding: 1,
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, rgba(96,165,250,0.9), rgba(244,114,182,0.9))",
                  boxShadow:
                    "0 0 25px rgba(96,165,250,0.45), 0 0 40px rgba(244,114,182,0.35)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 14px",
                    borderRadius: 999,
                    background:
                      "radial-gradient(circle at top left,#020617,#020617 55%,#020617 100%)",
                    color: "#e5e7eb",
                    fontSize: "0.78rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "999px",
                      background:
                        "radial-gradient(circle at 30% 0, #38bdf8, #6366f1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    ⚡
                  </span>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.2,
                    }}
                  >
                    <span style={{ opacity: 0.75 }}>ログイン済み</span>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      {username}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        opacity: 0.8,
                        marginTop: 2,
                      }}
                    >
                      クリックでログアウト
                    </span>
                  </div>

                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: "0.95rem",
                      opacity: 0.9,
                    }}
                  >
                    ⏻
                  </span>
                </div>
              </div>
            </button>
          </div>

          <p
            style={{
              marginTop: 4,
              marginBottom: 18,
              opacity: 0.8,
              fontSize: "0.92rem",
            }}
          >
            ログインユーザー向けに、案件を Tinder 風 UI で表示
          </p>

          {/* カードエリア */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "min(60vh, 460px)",
            }}
          >
            {items.slice(currentIndex).map((item, idx) => (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: items.length - idx,
                }}
              >
                <SwipeCard
                  item={item}
                  onSwipe={handleSwipe}
                  onOpenDetail={handleOpenDetail}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15,23,42,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={handleCloseDetail}
        >
          <div
            style={{
              backgroundColor: "#020617",
              padding: 24,
              borderRadius: 16,
              width: "90%",
              maxWidth: 500,
              boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
              border: "1px solid rgba(148,163,184,0.4)",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {selectedItem.title}
              </h2>
              <button
                onClick={handleCloseDetail}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
              <p>
                <strong>クライアント：</strong>
                {selectedItem.client}
              </p>
              <p>
                <strong>技術スタック：</strong>
                {selectedItem.techStack}
              </p>
              <p>
                <strong>単価：</strong>
                {selectedItem.unitPrice.toLocaleString()} 円
              </p>
              <p>
                <strong>働き方：</strong>
                {selectedItem.workStyle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ログアウトトースト（ログイン中にも一応出せるようにしておく） */}
      {showLoggedOutToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 18px",
            borderRadius: 999,
            background:
              "linear-gradient(135deg, rgba(96,165,250,0.95), rgba(244,114,182,0.95))",
            color: "#020617",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
            zIndex: 99999,
            whiteSpace: "nowrap",
          }}
        >
          ログアウトしました
        </div>
      )}
    </>
  );
};

export default App;