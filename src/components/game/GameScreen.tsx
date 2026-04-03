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
  const allEliminated = state.bingoCards.every(c => state.eliminatedCardIds.has(c.id));

  const handleClaim = (cardId: number) => {
    hapticImpact('heavy');
    onClaim(cardId);
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      
      {/* Top Bar */}
      <div className="w-full shrink-0 relative z-[100] border-b border-border/10">
        <StatsBar stats={state.stats} balance={state.user.balance} onClose={onClose} />
      </div>

      <div className="flex flex-row flex-1 overflow-hidden">
        
        {/* SIDEBAR: Always visible, but narrower on small screens 
            - w-12: Small screens (icons only or thin view)
            - sm:w-24: Medium screens
            - md:w-48: Desktop
        */}
        <div className="w-16 sm:w-24 md:w-48 flex-shrink-0 border-r border-border/50 overflow-y-auto bg-card/30">
          <BoardSidebar calledNumbers={state.calledNumbers} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden p-1 sm:p-2 md:p-6">
          
          {/* Number Caller */}
          <div className="w-full max-w-4xl mx-auto shrink-0 mb-1 md:mb-2">
            <NumberCaller calledNumbers={state.calledNumbers} />
          </div>

          {/* CARD CONTAINER: Now shares width with the sidebar */}
          <div className="flex flex-row items-stretch justify-center gap-1 md:gap-4 w-full max-w-6xl mx-auto px-1 flex-1 min-h-0">
            {state.bingoCards.map(card => {
              const isEliminated = state.eliminatedCardIds.has(card.id);
              
              return (
                <div 
                  key={card.id} 
                  className="flex flex-1 flex-col justify-between gap-1 md:gap-3 min-w-0 max-w-[300px] h-full pb-1 md:pb-2"
                >
                  {/* The Board: Shrinks vertically to ensure the button is always visible */}
                  <div className="flex-1 min-h-0 w-full">
                    <BingoBoard
                      card={card}
                      daubedNumbers={state.daubedNumbers}
                      isEliminated={isEliminated}
                      onDaub={onDaub}
                      className="h-full w-full shadow-lg"
                    />
                  </div>
                  
                  {/* The Button: shrink-0 pins it to the bottom */}
                  {!isEliminated && !allEliminated && (
                    <button
                      onClick={() => handleClaim(card.id)}
                      disabled={daubedCount < 5}
                      className="gradient-winner shrink-0 w-full py-2 md:py-4 rounded-lg md:rounded-xl font-black text-white shadow-xl active:scale-95 disabled:opacity-30 transition-all uppercase tracking-tight md:tracking-widest text-[9px] sm:text-[10px] md:text-sm"
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