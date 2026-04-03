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
    <div className={`relative rounded-xl bg-card flex flex-col w-full h-full min-h-0 ${isSmall ? 'p-1' : 'p-2 md:p-3'} ${isEliminated ? 'eliminated-board' : ''} ${className || ''}`}>
      
      {/* Elimination Overlay */}
      {isEliminated && (
        <div className="absolute inset-0 rounded-xl bg-destructive/30 backdrop-blur-[2px] z-10 flex items-center justify-center text-center">
          <span className="text-[10px] sm:text-lg font-black text-destructive-foreground drop-shadow-lg uppercase p-1">
            Eliminated
          </span>
        </div>
      )}

      {/* Board Header */}
      {!extraCompact && (
        <div className="mb-1 text-[8px] md:text-xs text-center text-muted-foreground shrink-0">
          Board #{card.id}
        </div>
      )}

      <div className="flex flex-col flex-1 gap-0.5 min-h-0">
        {/* Bingo Letters Row (B-I-N-G-O) */}
        <div className="grid grid-cols-5 gap-0.5 shrink-0 h-6 md:h-8">
          {BINGO_LETTERS.map(l => (
            <div 
              key={l} 
              className={`${getLetterColor(l)} flex items-center justify-center rounded-sm md:rounded-md font-bold text-[10px] md:text-sm h-full`}
            >
              {l}
            </div>
          ))}
        </div>

        {/* 5x5 Grid Numbers - flex-1 and min-h-0 allow vertical scaling */}
        <div className="grid grid-cols-5 grid-rows-5 gap-0.5 flex-1 min-h-0">
          {card.numbers.flatMap((row, r) =>
            row.map((num, c) => {
              const isFree = r === 2 && c === 2;
              const isDaubed = isFree || (num !== null && daubedNumbers.has(num));
              const cellClass = isDaubed ? 'cell-daubed' : 'cell-default';

              return (
                <motion.button
                  key={`${r}-${c}`}
                  whileTap={!isEliminated && !isFree ? { scale: 0.95 } : {}}
                  onClick={() => num !== null && !isFree && !isEliminated && onDaub(num)}
                  /* Dynamic Text: text-[3vw] on tiny screens, scaling up to md:text-base 
                     Using flex-1 and h-full to fill grid slots perfectly.
                  */
                  className={`${cellClass} flex items-center justify-center rounded-sm md:rounded-lg font-bold transition-all h-full w-full text-[10px] sm:text-xs md:text-base border-none outline-none`}
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