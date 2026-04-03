import { GameState } from '@/types/game';
import { StatsBar } from './StatsBar';
import { NumberCaller } from './NumberCaller';
import { BingoBoard } from './BingoBoard';
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
  const allEliminated = state.bingoCards.every(c => state.eliminatedCardIds.has(c.id));

  const handleClaim = (cardId: number) => {
    hapticImpact('heavy');
    onClaim(cardId);
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
      
      {/* 0. STATS BAR (Fixed Height) */}
      <div className="w-full shrink-0 z-[100] border-b border-white/5">
        <StatsBar stats={state.stats} balance={state.user.balance} onClose={onClose} />
      </div>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* 1. TOP PART: BINGO BOARD / SIDEBAR (Forced 30% of Viewport Height) */}
        <div className="w-full h-[30dvh] md:h-full md:w-48 shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 overflow-hidden">
          <BoardSidebar calledNumbers={state.calledNumbers} />
        </div>

        {/* 2. MIDDLE PART: NUMBER CALLER (Forced 20% of Viewport Height) */}
        <div className="w-full h-[20dvh] md:h-auto shrink-0 flex items-center justify-center p-2 overflow-hidden bg-black/10">
          <div className="w-full h-full max-w-2xl">
            <NumberCaller calledNumbers={state.calledNumbers} />
          </div>
        </div>

        {/* 3. BOTTOM PART: CARDS (Forced 50% of Viewport Height) */}
        <div className="w-full h-[50dvh] md:h-full flex flex-col overflow-hidden p-1">
          <div className="flex flex-row items-stretch justify-center gap-1 md:gap-4 w-full h-full min-h-0 px-1">
            {state.bingoCards.map(card => {
              const isEliminated = state.eliminatedCardIds.has(card.id);
              
              return (
                <div 
                  key={card.id} 
                  className="flex flex-1 flex-col justify-between gap-1 min-w-0 max-w-[350px] h-full"
                >
                  {/* BingoBoard fills its portion of the 50% height zone */}
                  <div className="flex-1 min-h-0 w-full">
                    <BingoBoard
                      card={card}
                      daubedNumbers={state.daubedNumbers}
                      isEliminated={isEliminated}
                      onDaub={onDaub}
                      className="h-full w-full"
                    />
                  </div>
                  
                  {/* Bingo Button - shrink-0 to stay at bottom */}
                  {!isEliminated && !allEliminated && (
                    <button
                      onClick={() => handleClaim(card.id)}
                      disabled={daubedCount < 5}
                      className="gradient-winner shrink-0 w-full py-2 rounded-lg font-black text-white shadow-lg active:scale-95 disabled:opacity-30 uppercase text-[10px] tracking-tighter"
                    >
                      Bingo! {daubedCount < 5 ? `(${daubedCount}/5)` : ''}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}