// frontend/src/pages/SwipePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SwipeCard from "../components/SwipeCard";
import { apiFetch } from "../api";

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

const SwipePage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<SwipeItem[]>([]);
  const [loading, setLoading] = useState(true); // ← 初期を true に変更
  const [selectedItem, setSelectedItem] = useState<SwipeItem | null>(null);

  // --------------------
  // 案件取得（ページ初期表示時のみ）
  // --------------------
  useEffect(() => {
    apiFetch("/swipe/projects")
      .then((data: SwipeItem[]) => setItems(data))
      .catch((e) => console.error("API取得に失敗しました:", e))
      .finally(() => setLoading(false));
  }, []);

  // --------------------
  // 画像プリロード
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
  // スワイプ処理
  // --------------------
  const handleSwipe = (direction: string, id: number) => {
    console.log(`swiped ${direction}: id=${id}`);

    // UI から削除
    setItems((prev) => prev.filter((item) => item.id !== id));

    const verdict = direction === "right" ? "LIKE" : "DISLIKE";

    apiFetch("/swipe/project-likes", {
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

  // --------------------------------------
  // ローディング中
  // --------------------------------------
  if (loading) {
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

  // --------------------------------------
  // 案件が無い場合（ロード完了後のみ）
  // --------------------------------------
  if (!loading && items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          padding: 20,
        }}
      >
        <div style={{ marginBottom: 16 }}>すべての案件を確認しました 🎉</div>

        <button
          onClick={() => navigate("/menu")}
          style={{
            marginTop: 20,
            padding: "10px 18px",
            background: "#3b82f6",
            border: "none",
            borderRadius: 12,
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            minWidth: 200,
          }}
        >
          ← メニューへ戻る
        </button>
      </div>
    );
  }

  // --------------------------------------
  // メイン UI
  // --------------------------------------
  return (
    <>
      {/* ← メニューへ戻るボタン */}
      <button
        onClick={() => navigate("/menu")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          padding: "10px 16px",
          borderRadius: 999,
          background: "#1e293b",
          color: "white",
          border: "1px solid rgba(255,255,255,0.15)",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        ← メニューへ
      </button>

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
          }}
        >
          {/* カードエリア */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "min(60vh, 460px)",
            }}
          >
            {items.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 5 - idx,
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
        ></div>
      )}
    </>
  );
};

export default SwipePage;