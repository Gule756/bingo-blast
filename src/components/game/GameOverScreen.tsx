import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BingoCard, BINGO_LETTERS, getLetterColor, DUMMY_NAMES, WinPattern } from '@/types/game';

interface GameOverScreenProps {
  winner: string | null;
  winPattern: WinPattern;
  card: BingoCard | null;
  daubedNumbers: Set<number>;
  stats: { bet: number; players: number };
  balance: number;
  onReturn: () => void;
}

export function GameOverScreen({ winner, winPattern, card, daubedNumbers, stats, balance, onReturn }: GameOverScreenProps) {
  const [countdown, setCountdown] = useState(10);
  const prize = stats.bet * stats.players * 0.9;
  const isDummy = winner ? DUMMY_NAMES.includes(winner) : false;
  const isRealWinner = winner && !isDummy;

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); onReturn(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onReturn]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-background to-card p-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-2 text-6xl">
        {winner ? '🏆' : '😔'}
      </motion.div>
      <h1 className="mb-1 text-3xl font-black text-foreground">Game Over!</h1>

      {winner && (
        <>
          <p className="mb-1 text-lg font-bold text-accent">
            {isDummy ? `User ${winner} has won!` : `${winner} wins!`}
          </p>

          {/* Winning pattern badge - always shown in blue */}
          {winPattern && isRealWinner && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-3 rounded-full border-2 border-blue-500 bg-blue-500/15 px-5 py-1.5"
            >
              <span className="text-sm font-bold text-blue-500">{winPattern}</span>
            </motion.div>
          )}

          {!isDummy && (
            <div className="mb-4 rounded-xl border-2 border-accent bg-accent/10 px-6 py-3 text-center">
              <div className="text-sm text-muted-foreground">Prize Won</div>
              <div className="text-3xl font-black text-accent">{Math.floor(prize)} ETB</div>
            </div>
          )}
          {isDummy && (
            <p className="mb-4 text-sm text-muted-foreground">Better luck next round!</p>
          )}
        </>
      )}

      <div className="mb-4 rounded-xl bg-card px-6 py-3 text-center">
        <p className="text-xs text-muted-foreground">Your Balance</p>
        <p className="text-2xl font-black text-foreground">{balance} ETB</p>
      </div>

      {card && isRealWinner && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 w-full max-w-xs rounded-2xl border-4 border-bingo-g bg-bingo-g/5 p-4"
        >
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-sm font-bold text-foreground">{winner}</span>
            {winPattern && (
              <span className="rounded-full bg-blue-500/15 px-3 py-0.5 text-xs font-bold text-blue-500">
                {winPattern}
              </span>
            )}
          </div>
          <div className="mb-2 rounded bg-card px-3 py-1 text-center text-xs font-bold text-muted-foreground">
            Board #{card.id}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {BINGO_LETTERS.map(l => (
              <div key={l} className={`${getLetterColor(l)} flex h-7 items-center justify-center rounded text-xs font-bold`}>{l}</div>
            ))}
            {card.numbers.flatMap((row, r) =>
              row.map((num, c) => {
                const isFree = r === 2 && c === 2;
                const isDaubed = isFree || (num !== null && daubedNumbers.has(num));
                return (
                  <div key={`${r}-${c}`} className={`flex h-8 items-center justify-center rounded text-xs font-semibold ${isDaubed ? 'cell-daubed' : 'bg-card text-muted-foreground'}`}>
                    {isFree ? '★' : num}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      <div className="mt-auto text-center">
        <p className="text-sm text-muted-foreground">Auto-return to lobby in</p>
        <motion.div key={countdown} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="my-2 flex h-14 w-14 mx-auto items-center justify-center rounded-xl bg-primary text-2xl font-black text-primary-foreground">
          {countdown}
        </motion.div>
        <p className="text-xs text-muted-foreground">All players return together at the same time</p>
      </div>
    </div>
  );
}
