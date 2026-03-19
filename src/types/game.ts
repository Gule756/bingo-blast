export type GamePhase = 'welcome' | 'lobby' | 'warning' | 'game' | 'gameover';
export type PlayerMode = 'player' | 'spectator';

export interface BingoCard {
  id: number;
  numbers: (number | null)[][]; // 5x5, center is null (free)
}

export interface CalledNumber {
  number: number;
  letter: string;
  timestamp: number;
}

export interface GameState {
  phase: GamePhase;
  timer: number;
  playerMode: PlayerMode;
  selectedStack: number | null;
  occupiedStacks: Set<number>;
  bingoCard: BingoCard | null;
  calledNumbers: CalledNumber[];
  daubedNumbers: Set<number>;
  isEliminated: boolean;
  winner: string | null;
  stats: {
    derash: number;
    players: number;
    bet: number;
    callCount: number;
  };
}

export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'] as const;

export function getLetterForNumber(n: number): string {
  if (n <= 15) return 'B';
  if (n <= 30) return 'I';
  if (n <= 45) return 'N';
  if (n <= 60) return 'G';
  return 'O';
}

export function getLetterColor(letter: string): string {
  switch (letter) {
    case 'B': return 'bingo-header-b';
    case 'I': return 'bingo-header-i';
    case 'N': return 'bingo-header-n';
    case 'G': return 'bingo-header-g';
    case 'O': return 'bingo-header-o';
    default: return 'bg-muted';
  }
}
