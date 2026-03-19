import { motion } from 'framer-motion';
import { BingoCard, BINGO_LETTERS, getLetterColor } from '@/types/game';

interface BingoBoardProps {
  card: BingoCard;
  daubedNumbers: Set<number>;
  isEliminated: boolean;
  onDaub: (num: number) => void;
}

export function BingoBoard({ card, daubedNumbers, isEliminated, onDaub }: BingoBoardProps) {
  return (
    <div className={`rounded-xl bg-card p-3 relative ${isEliminated ? 'eliminated-board' : ''}`}>
      {isEliminated && (
        <div className="absolute inset-0 rounded-xl bg-destructive/30 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <span className="text-lg font-black text-destructive-foreground drop-shadow-lg">❌ ELIMINATED</span>
        </div>
      )}
      <div className="mb-1 text-center text-xs text-muted-foreground">Board #{card.id}</div>

      {/* Header */}
      <div className="mb-1 grid grid-cols-5 gap-1">
        {BINGO_LETTERS.map(l => (
          <div key={l} className={`${getLetterColor(l)} flex h-9 items-center justify-center rounded-md text-sm font-bold`}>
            {l}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-1">
        {card.numbers.flatMap((row, r) =>
          row.map((num, c) => {
            const isFree = r === 2 && c === 2;
            const isDaubed = isFree || (num !== null && daubedNumbers.has(num));

            const cellClass = isDaubed ? 'cell-daubed' : 'cell-default';

            return (
              <motion.button
                key={`${r}-${c}`}
                whileTap={!isEliminated && !isFree ? { scale: 0.9 } : {}}
                onClick={() => num !== null && !isFree && !isEliminated && onDaub(num)}
                className={`${cellClass} flex h-12 items-center justify-center rounded-md text-sm font-semibold transition-colors`}
              >
                {isFree ? '★' : num}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
