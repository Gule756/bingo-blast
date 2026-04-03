import { motion } from 'framer-motion';
import { BingoCard, BINGO_LETTERS, getLetterColor } from '@/types/game';

interface BingoBoardProps {
  card: BingoCard;
  daubedNumbers: Set<number>;
  isEliminated: boolean;
  onDaub: (num: number) => void;
  compact?: boolean;
  extraCompact?: boolean;
  className?: string;
}

export function BingoBoard({ 
  card, 
  daubedNumbers, 
  isEliminated, 
  onDaub, 
  compact, 
  extraCompact, 
  className 
}: BingoBoardProps) {
  const isSmall = compact || extraCompact;

  return (
    /* Key Changes:
       - shrink-0: Prevents the card from squishing when parent flex containers get tight.
       - w-60: Enforces the 15rem (240px) width you requested.
       - flex-none: Additional insurance to keep the size rigid.
    */
    <div className={`relative rounded-xl bg-card ${isSmall ? 'p-1' : 'p-3'} ${isEliminated ? 'eliminated-board' : ''} flex flex-col h-80 w-60 shrink-0 flex-none ${className || ''}`}>
      
      {/* Elimination Overlay */}
      {isEliminated && (
        <div className="absolute inset-0 rounded-xl bg-destructive/30 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <span className={`${isSmall ? 'text-xs' : 'text-lg'} font-black text-destructive-foreground drop-shadow-lg`}>
            ❌ ELIMINATED
          </span>
        </div>
      )}

      {/* Board Header */}
      {!extraCompact && (
        <div className={`${isSmall ? 'mb-0.5 text-[9px]' : 'mb-1 text-xs'} text-center text-muted-foreground`}>
          Board #{card.id}
        </div>
      )}

      <div className="flex flex-col flex-1 gap-0.5">
        {/* Bingo Letters Row (B-I-N-G-O) */}
        <div className="grid grid-cols-5 gap-0.5 h-8">
          {BINGO_LETTERS.map(l => (
            <div 
              key={l} 
              className={`${getLetterColor(l)} flex items-center justify-center rounded-md font-bold text-sm h-full`}
            >
              {l}
            </div>
          ))}
        </div>

        {/* 5x5 Grid Numbers */}
        <div className="grid grid-cols-5 grid-rows-5 gap-0.5 flex-1">
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
                  /* h-full and w-full ensure the buttons expand to fill the grid cells */
                  className={`${cellClass} flex items-center justify-center rounded-lg font-semibold transition-colors h-full w-full text-base`}
                >
                  {isFree ? '★' : num}
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}