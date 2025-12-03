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
  imageUrl?: string;
  summary?: string;
  description?: string;
};

const App: React.FC = () => {
  const [items, setItems] = useState<SwipeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getToken());
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SwipeItem | null>(null);

  // ログアウト演出
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLoggedOutToast, setShowLoggedOutToast] = useState(false);

  const username = localStorage.getItem("username") ?? "ログイン中";

  // --------------------
  // 初回データ取得
  // --------------------
  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    apiFetch("/projects")
        .then((data: SwipeItem[]) => setItems(data))
        .catch((e) => console.error("API取得に失敗しました:", e))
        .finally(() => setLoading(false));
  }, [isLoggedIn]);

  // --------------------
  // ★ 改善案③：画像プリロード
  // --------------------
  useEffect(() => {
    items.forEach((item) => {
      if (item.imageUrl) {
        const img = new Image();
        img.src = item.imageUrl;
      }
    });
  }, [items]);

  // --------------------
  // ★ スワイプ処理（非同期 API）
  // --------------------
  const handleSwipe = (direction: string, id: number) => {
    console.log(`swiped ${direction}: id=${id}`);

    // ① UI 先に更新（高速）
    setItems((prev) => prev.filter((item) => item.id !== id));

    // ② API は裏で送信
    const verdict = direction === "right" ? "LIKE" : "DISLIKE";
    apiFetch("/project-likes", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: id,
        verdict,
        comment: "",
      }),
    }).catch((e) => console.error("保存失敗:", e));
  };

  const handleOpenDetail = (item: SwipeItem) => setSelectedItem(item);
  const handleCloseDetail = () => setSelectedItem(null);

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setItems([]);
      setCurrentIndex(0);
      setSelectedItem(null);
      setIsLoggedIn(false);
      setIsLoggingOut(false);

      setShowLoggedOutToast(true);
      setTimeout(() => setShowLoggedOutToast(false), 1800);
    }, 350);
  };

  // --------------------
  // 未ログイン
  // --------------------
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

  // --------------------
  // ローディング or データ無し
  // --------------------
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

  // --------------------
  // メイン UI
  // --------------------
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
          {/*（略：既存 UI 一式） */}

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "min(60vh, 460px)",
            }}
          >
            {/* ★ 改善案④：DOMの枚数を5以下に制限 */}
            {items.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 5 - idx, // 枚数に合わせて zIndex を調整
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
          {/* （略：あなたの既存詳細 UI） */}
        </div>
      )}

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