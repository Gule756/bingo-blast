import { useState } from 'react';
import { GameState } from '@/types/game';
import { StatsBar } from './StatsBar';
import { NumberCaller } from './NumberCaller';
import { BingoBoard } from './BingoBoard';
import { SpectatorCard } from './SpectatorCard';
import { BoardSidebar } from './BoardSidebar';
import { hapticImpact } from '@/lib/haptic';

interface GameScreenProps {
  state: GameState;
  daubedCount: number;
  onDaub: (num: number) => void;
  onClaim: (cardId: number) => void;
  onClose: () => void;
}

export function GameScreen({ state, daubedCount, onDaub, onClaim, onClose }: GameScreenProps) {
  const handleClaim = (cardId: number) => {
    hapticImpact('heavy');
    onClaim(cardId);
  };

  const hasCards = state.bingoCards.length > 0;
  const cardCount = state.bingoCards.length;
  const allEliminated = state.bingoCards.every(c => state.eliminatedCardIds.has(c.id));

  return (
    <div className="flex min-h-screen flex-col">
      <StatsBar stats={state.stats} balance={state.user.balance} onClose={onClose} />

      <div className="p-1 text-center text-xs font-semibold text-muted-foreground">
        {allEliminated ? '❌ All cards eliminated — Watching' :
         state.playerMode === 'spectator' ? '👁️ Spectator Mode' :
         hasCards ? `Playing ${cardCount} card${cardCount > 1 ? 's' : ''}` : 'Started'}
      </div>

      {/* Single card layout */}
      {cardCount <= 1 && (
        <div className="flex flex-1 gap-2 overflow-hidden px-2 pb-2">
          <div className="w-[38%] shrink-0 overflow-y-auto">
            <BoardSidebar calledNumbers={state.calledNumbers} />
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
            <NumberCaller calledNumbers={state.calledNumbers} />
            {state.playerMode === 'spectator' ? (
              <SpectatorCard />
            ) : state.bingoCards[0] ? (
              <>
                <BingoBoard
                  card={state.bingoCards[0]}
                  daubedNumbers={state.daubedNumbers}
                  isEliminated={state.eliminatedCardIds.has(state.bingoCards[0].id)}
                  onDaub={onDaub}
                />
                {!state.eliminatedCardIds.has(state.bingoCards[0].id) && !allEliminated && (
                  <button
                    onClick={() => handleClaim(state.bingoCards[0].id)}
                    disabled={daubedCount < 5}
                    className="gradient-winner rounded-xl px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100"
                  >
                    🎯 BINGO! {daubedCount < 5 && `(${daubedCount}/5)`}
                  </button>
                )}
                {state.eliminatedCardIds.has(state.bingoCards[0].id) && (
                  <div className="rounded-xl bg-destructive/20 p-2 text-center text-xs font-semibold text-accent">
                    ❌ This card was eliminated. Watching as spectator...
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Two cards layout: stacked vertically, smaller */}
      {cardCount === 2 && (
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
          <div className="flex gap-2">
            <div className="w-[30%] shrink-0">
              <BoardSidebar calledNumbers={state.calledNumbers} />
            </div>
            <div className="flex-1">
              <NumberCaller calledNumbers={state.calledNumbers} />
            </div>
          </div>
          {state.playerMode === 'spectator' ? (
            <SpectatorCard />
          ) : (
            <div className="flex flex-col gap-2">
              {state.bingoCards.map(card => {
                const isCardEliminated = state.eliminatedCardIds.has(card.id);
                return (
                  <div key={card.id} className="flex flex-col gap-1">
                    <BingoBoard
                      card={card}
                      daubedNumbers={state.daubedNumbers}
                      isEliminated={isCardEliminated}
                      onDaub={onDaub}
                      compact
                    />
                    {!isCardEliminated && !allEliminated && (
                      <button
                        onClick={() => handleClaim(card.id)}
                        disabled={daubedCount < 5}
                        className="gradient-winner rounded-lg px-4 py-1.5 text-sm font-black text-primary-foreground shadow transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100"
                      >
                        🎯 BINGO Card #{card.id}
                      </button>
                    )}
                    {isCardEliminated && (
                      <div className="rounded-lg bg-destructive/20 p-1.5 text-center text-xs font-semibold text-accent">
                        ❌ Card #{card.id} eliminated
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Three cards layout: number board top, 3 cards side by side bottom */}
      {cardCount === 3 && (
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
          <div className="flex gap-2">
            <div className="w-[30%] shrink-0">
              <BoardSidebar calledNumbers={state.calledNumbers} />
            </div>
            <div className="flex-1">
              <NumberCaller calledNumbers={state.calledNumbers} />
            </div>
          </div>
          {state.playerMode === 'spectator' ? (
            <SpectatorCard />
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {state.bingoCards.map(card => {
                const isCardEliminated = state.eliminatedCardIds.has(card.id);
                return (
                  <div key={card.id} className="flex flex-col gap-1">
                    <BingoBoard
                      card={card}
                      daubedNumbers={state.daubedNumbers}
                      isEliminated={isCardEliminated}
                      onDaub={onDaub}
                      compact
                    />
                    {!isCardEliminated && !allEliminated && (
                      <button
                        onClick={() => handleClaim(card.id)}
                        disabled={daubedCount < 5}
                        className="gradient-winner rounded-lg px-1 py-1 text-[10px] font-black text-primary-foreground shadow transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100"
                      >
                        🎯 #{card.id}
                      </button>
                    )}
                    {isCardEliminated && (
                      <div className="rounded-lg bg-destructive/20 p-1 text-center text-[10px] font-semibold text-accent">
                        ❌ #{card.id}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
