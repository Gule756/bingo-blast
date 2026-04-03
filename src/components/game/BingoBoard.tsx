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
    <div className={`
      relative rounded-xl bg-card flex flex-col 
      w-full h-full min-h-0 
      ${isSmall ? 'p-1' : 'p-2 md:p-3'} 
      ${isEliminated ? 'opacity-40' : ''} 
      ${className || ''}
    `}>
      
      {isEliminated && (
        <div className="absolute inset-0 rounded-xl bg-destructive/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="text-[10px] font-black text-white uppercase border-2 border-white p-1 rotate-12">
            Eliminated
          </span>
        </div>
      )}

      {!extraCompact && (
        <div className="mb-1 text-[8px] md:text-xs text-center text-muted-foreground shrink-0 font-bold opacity-60">
          BOARD #{card.id}
        </div>
      )}

      <div className="flex flex-col flex-1 gap-1 min-h-0">
        {/* B-I-N-G-O Row */}
        <div className="grid grid-cols-5 gap-0.5 shrink-0 h-5 md:h-8">
          {BINGO_LETTERS.map(l => (
            <div 
              key={l} 
              className={`${getLetterColor(l)} flex items-center justify-center rounded-t-sm font-black text-[9px] md:text-sm h-full text-white`}
            >
              {l}
            </div>
          ))}
        </div>

        {/* 5x5 Grid Numbers */}
        <div className="grid grid-cols-5 grid-rows-5 gap-1 flex-1 min-h-0 bg-slate-900/20 p-0.5 rounded-b-sm">
          {card.numbers.flatMap((row, r) =>
            row.map((num, c) => {
              const isFree = r === 2 && c === 2;
              const isDaubed = isFree || (num !== null && daubedNumbers.has(num));
              
              return (
                <motion.button
                  key={`${r}-${c}`}
                  whileTap={!isEliminated && !isFree ? { scale: 0.9 } : {}}
                  onClick={() => num !== null && !isFree && !isEliminated && onDaub(num)}
                  /* Changed rounded-lg to rounded-md or rounded-full 
                     Added aspect-square to keep numbers circular 
                  */
                  className={`
                    flex items-center justify-center rounded-sm md:rounded-md 
                    transition-all h-full w-full font-bold
                    text-[10px] sm:text-xs md:text-base
                    ${isDaubed ? 'bg-green-500 text-white' : 'bg-slate-700/40 text-white/90'}
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