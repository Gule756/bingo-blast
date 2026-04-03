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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      
      {/* 1. TOP STATS BAR */}
      <div className="w-full shrink-0 relative z-[100] border-b border-white/5">
        <StatsBar stats={state.stats} balance={state.user.balance} onClose={onClose} />
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* 2. CALLED NUMBERS STRIP 
            FORCED: h-12 on mobile ensures it stays a thin strip at the top.
        */}
        <div className="w-full md:w-48 h-12 md:h-full shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 overflow-x-auto md:overflow-y-auto no-scrollbar">
          <BoardSidebar calledNumbers={state.calledNumbers} />
        </div>

        {/* 3. MAIN GAME CONTENT */}
        <div className="flex flex-col flex-1 overflow-hidden p-1 md:p-4">
          
          {/* 4. NUMBER CALLER 
              FORCED: max-h-[18vh] prevents this box from pushing the boards off-screen.
          */}
          <div className="w-full max-w-2xl mx-auto shrink-0 mb-1 md:mb-4 max-h-[18vh] md:max-h-none overflow-hidden">
            <NumberCaller calledNumbers={state.calledNumbers} />
          </div>

          {/* 5. CARDS CONTAINER 
              flex-1 + min-h-0: This tells the boards "take every pixel that is left."
          */}
          <div className="flex flex-row items-stretch justify-center gap-1 md:gap-4 w-full max-w-6xl mx-auto flex-1 min-h-0 px-1">
            {state.bingoCards.map(card => {
              const isEliminated = state.eliminatedCardIds.has(card.id);
              
              return (
                <div 
                  key={card.id} 
                  className="flex flex-1 flex-col justify-between gap-1 md:gap-3 min-w-0 max-w-[350px] h-full pb-1"
                >
                  <div className="flex-1 min-h-0 w-full">
                    <BingoBoard
                      card={card}
                      daubedNumbers={state.daubedNumbers}
                      isEliminated={isEliminated}
                      onDaub={onDaub}
                      className="h-full w-full shadow-2xl"
                    />
                  </div>
                  
                  {!isEliminated && !allEliminated && (
                    <button
                      onClick={() => handleClaim(card.id)}
                      disabled={daubedCount < 5}
                      className="gradient-winner shrink-0 w-full py-2 md:py-4 rounded-lg md:rounded-xl font-black text-white shadow-xl active:scale-95 disabled:opacity-30 transition-all uppercase text-[10px] md:text-sm tracking-tighter"
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