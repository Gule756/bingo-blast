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
      
      {/* 1. TOP STATS BAR (Fixed) */}
      <div className="w-full shrink-0 relative z-[100] border-b border-border/10">
        <StatsBar stats={state.stats} balance={state.user.balance} onClose={onClose} />
      </div>

      {/* 2. THE MAIN WRAPPER 
          Mobile: Vertical Stack (flex-col)
          Desktop: Sidebar on left (md:flex-row)
      */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* SIDEBAR: Horizontal scroll strip on mobile, vertical on desktop */}
        <div className="w-full md:w-48 h-14 md:h-full shrink-0 border-b md:border-b-0 md:border-r border-border/50 bg-card/20 overflow-x-auto md:overflow-y-auto no-scrollbar">
          <BoardSidebar calledNumbers={state.calledNumbers} />
        </div>

        {/* 3. GAME CONTENT AREA (Caller + Cards) */}
        <div className="flex flex-col flex-1 overflow-hidden p-1 md:p-4">
          
          {/* NUMBER CALLER: Pushed to the top */}
          <div className="w-full max-w-4xl mx-auto shrink-0 mb-2">
            <NumberCaller calledNumbers={state.calledNumbers} />
          </div>

          {/* CARDS CONTAINER: 
              - flex-1 and min-h-0: This forces the cards to take the remaining height 
                and shrink their internal boards if the screen is too short.
          */}
          <div className="flex flex-row items-stretch justify-center gap-1 md:gap-4 w-full max-w-6xl mx-auto flex-1 min-h-0 px-1">
            {state.bingoCards.map(card => {
              const isEliminated = state.eliminatedCardIds.has(card.id);
              
              return (
                <div 
                  key={card.id} 
                  className="flex flex-1 flex-col justify-between gap-1 md:gap-3 min-w-0 max-w-[350px] h-full pb-1"
                >
                  {/* The Board: Takes all available space, shrinking its grid to fit */}
                  <div className="flex-1 min-h-0 w-full">
                    <BingoBoard
                      card={card}
                      daubedNumbers={state.daubedNumbers}
                      isEliminated={isEliminated}
                      onDaub={onDaub}
                      className="h-full w-full"
                    />
                  </div>
                  
                  {/* The Button: shrink-0 pins it to the bottom of the visible area */}
                  {!isEliminated && !allEliminated && (
                    <button
                      onClick={() => handleClaim(card.id)}
                      disabled={daubedCount < 5}
                      className="gradient-winner shrink-0 w-full py-2 md:py-4 rounded-lg md:rounded-xl font-black text-white shadow-lg active:scale-95 disabled:opacity-30 transition-all uppercase text-[10px] md:text-sm tracking-tighter md:tracking-widest"
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