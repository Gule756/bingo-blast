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
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <div className="w-full shrink-0 block relative z-[100]">
        <StatsBar stats={state.stats} balance={state.user.balance} onClose={onClose} />
      </div>

      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Sidebar - Visible only on larger screens */}
        <div className="w-48 flex-shrink-0 border-r border-border/50 hidden md:block">
          <BoardSidebar calledNumbers={state.calledNumbers} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          <NumberCaller calledNumbers={state.calledNumbers} />

          {/* CARD WRAPPER: 
              - overflow-x-auto: Allows swiping left/right if cards are too wide.
              - justify-start: Ensures cards start from the left when scrolling is needed.
          */}
          <div className="flex flex-row items-start justify-start md:justify-center gap-6 mt-6 overflow-x-auto pb-8 px-2">
            {state.bingoCards.map(card => {
              const isEliminated = state.eliminatedCardIds.has(card.id);
              
              return (
                /* THE KEY FIX: 
                   We use 'style' to force 240px (w-60). 
                   flexShrink: 0 prevents the browser from squishing the card.
                */
                <div 
                  key={card.id} 
                  style={{ width: '240px', minWidth: '240px', flexShrink: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <BingoBoard
                    card={card}
                    daubedNumbers={state.daubedNumbers}
                    isEliminated={isEliminated}
                    onDaub={onDaub}
                    /* Removed w-full max-w-[90%] to stop layout fighting */
                    className="shadow-xl"
                  />
                  
                  {!isEliminated && !allEliminated && (
                    <button
                      onClick={() => handleClaim(card.id)}
                      disabled={daubedCount < 5}
                      className="gradient-winner w-full py-4 rounded-xl font-black text-white shadow-xl active:scale-95 disabled:opacity-30 transition-all uppercase tracking-widest text-sm"
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