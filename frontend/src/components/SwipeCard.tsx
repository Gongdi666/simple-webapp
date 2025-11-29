import React from "react";
import TinderCard from "react-tinder-card";
import type { SwipeItem } from "../types";

type Props = {
  item: SwipeItem;
  onSwipe: (direction: string, id: number) => void;
  onOpenDetail?: (item: SwipeItem) => void;
};

const SwipeCard: React.FC<Props> = ({ item, onSwipe, onOpenDetail }) => {
  const handleSwipe = (dir: string) => {
    onSwipe(dir, item.id);
  };

  return (
    <TinderCard
      onSwipe={handleSwipe}
      preventSwipe={["up", "down"]}
      swipeRequirementType="position"
    >
      <div
        style={{
          height: "100%",              // ★ コンテナ高いっぱい
          boxSizing: "border-box",
          background:
            "radial-gradient(circle at top left, #1f2937 0, #020617 65%)",
          borderRadius: 24,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // 上：テキスト / 下：ボタン
          boxShadow: "0 24px 60px rgba(15,23,42,0.9)",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            {item.title}
          </h2>
          <p style={{ opacity: 0.8, marginBottom: 8 }}>
            クライアント：{item.client}
          </p>
          <p style={{ marginBottom: 6 }}>技術：{item.techStack}</p>
          <p style={{ marginBottom: 6 }}>
            単価：{item.unitPrice.toLocaleString()} 円
          </p>
          <p>働き方：{item.workStyle}</p>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail?.(item)}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 16px",
            borderRadius: 999,
            border: "none",
            background:
              "linear-gradient(135deg, rgba(96,165,250), rgba(244,114,182))",
            fontWeight: 700,
            color: "#020617",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          詳細を見る
        </button>
      </div>
    </TinderCard>
  );
};

export default SwipeCard;