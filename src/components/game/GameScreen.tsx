import { GameState } from '@/types/game';
import { StatsBar } from './StatsBar';
import { NumberCaller } from './NumberCaller';
import { BingoBoard } from './BingoBoard';
import { SpectatorCard } from './SpectatorCard';
import { BoardSidebar } from './BoardSidebar';

interface GameScreenProps {
  state: GameState;
  onDaub: (num: number) => void;
  onClaim: () => void;
  onClose: () => void;
}

export function GameScreen({ state, onDaub, onClaim, onClose }: GameScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StatsBar stats={state.stats} onClose={onClose} />

      <div className="p-2 text-center text-sm font-semibold text-muted-foreground">Started</div>

      <div className="flex flex-1 gap-2 overflow-hidden px-2 pb-2">
        {/* Sidebar - called numbers board */}
        <div className="w-[38%] shrink-0 overflow-y-auto">
          <BoardSidebar calledNumbers={state.calledNumbers} />
        </div>

        {/* Main area */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          <NumberCaller calledNumbers={state.calledNumbers} />

          {state.playerMode === 'spectator' ? (
            <SpectatorCard />
          ) : state.bingoCard ? (
            <>
              <BingoBoard
                card={state.bingoCard}
                calledNumbers={state.calledNumbers}
                daubedNumbers={state.daubedNumbers}
                isEliminated={state.isEliminated}
                onDaub={onDaub}
              />
              {!state.isEliminated && (
                <button
                  onClick={onClaim}
                  className="gradient-winner rounded-xl px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-transform active:scale-95"
                >
                  🎯 BINGO!
                </button>
              )}
              {state.isEliminated && (
                <div className="rounded-xl bg-destructive/20 p-3 text-center text-sm font-semibold text-destructive">
                  ❌ False claim! You've been eliminated.
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
