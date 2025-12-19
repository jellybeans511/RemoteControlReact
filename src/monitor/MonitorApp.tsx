import React, { useState } from "react";
import { MonitorCard } from "./components/MonitorCard";
import { MonitorCardState, createMonitorCardState } from "./types/monitor";

/**
 * モニターアプリケーションのルートコンポーネント
 * 複数のMonitorCardを管理
 */
export const MonitorApp: React.FC = () => {
  const [cards, setCards] = useState<MonitorCardState[]>(() => [createMonitorCardState()]);

  const addCard = () =>
    setCards((prev) => {
      const nextIndex = prev.length + 1;
      const card = createMonitorCardState();
      card.offerPeerId = `offer-${nextIndex}`;
      card.targetPeerId = `robot-${nextIndex}`;
      return [...prev, card];
    });

  const removeCard = (id: string) => setCards((prev) => prev.filter((c) => c.id !== id));

  const updateCard = (id: string, updater: (prev: MonitorCardState) => MonitorCardState) =>
    setCards((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));

  return (
    <div style={{ padding: 16 }}>
      <h1>WebRTC Remote Monitor</h1>
      <button onClick={addCard}>+ Add Monitor</button>

      {cards.map((card) => (
        <MonitorCard
          key={card.id}
          card={card}
          onChange={(updater) => updateCard(card.id, updater)}
          onRemove={cards.length > 1 ? () => removeCard(card.id) : undefined}
        />
      ))}
    </div>
  );
};

export default MonitorApp;
