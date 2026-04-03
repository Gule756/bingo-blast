import { motion } from 'framer-motion';
import { BingoCard, BINGO_LETTERS, getLetterColor } from '@/types/game';

interface BingoBoardProps {
  card: BingoCard;
  daubedNumbers: Set<number>;
  isEliminated: boolean;
  onDaub: (num: number) => void;
  className?: string;
}

export function BingoBoard({ card, daubedNumbers, isEliminated, onDaub, className }: BingoBoardProps) {
  return (
    <div className={`relative rounded-xl bg-card p-1 md:p-3 flex flex-col w-full h-full min-h-0 border border-white/5 ${isEliminated ? 'opacity-40' : ''} ${className}`}>
      
      {/* Board ID */}
      <div className="mb-0.5 text-[8px] md:text-xs text-center text-muted-foreground shrink-0 uppercase font-medium">
        Board #{card.id}
      </div>

      <div className="flex flex-col flex-1 gap-0.5 min-h-0">
        {/* Header Letters (B-I-N-G-O) */}
        <div className="grid grid-cols-5 gap-0.5 h-6 md:h-8 shrink-0">
          {BINGO_LETTERS.map(l => (
            <div 
              key={l} 
              className={`${getLetterColor(l)} flex items-center justify-center rounded-sm font-black text-[10px] md:text-sm h-full shadow-inner`}
            >
              {l}
            </div>
          ))}
        </div>

        {/* 5x5 Grid Numbers: 
            - flex-1 + min-h-0: Allows the grid to scale its height down on short mobile screens.
        */}
        <div className="grid grid-cols-5 grid-rows-5 gap-0.5 flex-1 min-h-0">
          {card.numbers.flatMap((row, r) =>
            row.map((num, c) => {
              const isFree = r === 2 && c === 2;
              const isDaubed = isFree || (num !== null && daubedNumbers.has(num));
              
              return (
                <motion.button
                  key={`${r}-${c}`}
                  whileTap={!isEliminated && !isFree ? { scale: 0.92 } : {}}
                  onClick={() => num !== null && !isFree && !isEliminated && onDaub(num)}
                  /* h-full and w-full are mandatory here to fill the grid-rows properly */
                  className={`
                    flex items-center justify-center rounded-sm md:rounded-lg 
                    transition-all h-full w-full font-bold
                    text-[10px] sm:text-sm md:text-base border-none
                    ${isDaubed ? 'bg-green-500 text-white shadow-inner scale-[0.98]' : 'bg-slate-800/40 text-white/80 hover:bg-slate-700/60'}
                  `}
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