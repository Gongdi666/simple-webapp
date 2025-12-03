import React from "react";
import TinderCard from "react-tinder-card";
import type { SwipeItem } from "../App";
import "./SwipeCard.css";

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
      preventSwipe={["up", "down"]}
      onSwipe={handleSwipe}
      flickOnSwipe={true}
      swipeRequirementType="position"
      className="swipe-card"
    >
      <div className="card-container">
        {/* 画像部分 */}
        {item.imageUrl && (
          <img src={item.imageUrl} className="card-image" alt={item.title} />
        )}

        {/* テキスト部分 */}
        <div className="card-info">
          <h2 className="card-title">{item.title}</h2>
          {item.summary && <p className="card-summary">{item.summary}</p>}

          <p>クライアント：{item.client}</p>
          <p>技術：{item.techStack}</p>
          <p>単価：{item.unitPrice.toLocaleString()} 円</p>
          <p>働き方：{item.workStyle}</p>

          <button
            type="button"
            className="detail-button"
            onClick={() => onOpenDetail?.(item)}
          >
            詳細を見る
          </button>
        </div>
      </div>
    </TinderCard>
  );
};

export default SwipeCard;