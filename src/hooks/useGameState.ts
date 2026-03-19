import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GamePhase, BingoCard, CalledNumber, getLetterForNumber } from '@/types/game';

function generateBingoCard(stackId: number): BingoCard {
  const ranges = [[1,15],[16,30],[31,45],[46,60],[61,75]];
  const numbers: (number|null)[][] = [];
  for (let col = 0; col < 5; col++) {
    const [min, max] = ranges[col];
    const pool = Array.from({length: max-min+1}, (_,i) => i+min);
    const picked: (number|null)[] = [];
    for (let r = 0; r < 5; r++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    numbers.push(picked);
  }
  // Transpose to row-major, set center free
  const grid: (number|null)[][] = [];
  for (let r = 0; r < 5; r++) {
    const row: (number|null)[] = [];
    for (let c = 0; c < 5; c++) {
      row.push(r === 2 && c === 2 ? null : numbers[c][r]);
    }
    grid.push(row);
  }
  return { id: stackId, numbers: grid };
}

function generateOccupied(): Set<number> {
  const s = new Set<number>();
  const count = Math.floor(Math.random() * 15) + 5;
  while (s.size < count) s.add(Math.floor(Math.random() * 200) + 1);
  return s;
}

const LOBBY_TIME = 30;
const WARNING_TIME = 5;
const CALL_INTERVAL = 3000;

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: 'welcome',
    timer: LOBBY_TIME,
    playerMode: 'spectator',
    selectedStack: null,
    occupiedStacks: generateOccupied(),
    bingoCard: null,
    calledNumbers: [],
    daubedNumbers: new Set([0]), // 0 = free space marker
    isEliminated: false,
    winner: null,
    stats: { derash: 72, players: 9, bet: 10, callCount: 0 },
  });

  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const callRef = useRef<ReturnType<typeof setInterval>>();
  const usedNumbers = useRef<Set<number>>(new Set());

  const setPhase = useCallback((phase: GamePhase) => {
    setState(s => ({ ...s, phase }));
  }, []);

  const authenticate = useCallback(() => setPhase('lobby'), [setPhase]);

  const selectStack = useCallback((id: number) => {
    setState(s => {
      if (s.occupiedStacks.has(id)) return s;
      return { ...s, selectedStack: s.selectedStack === id ? null : id };
    });
  }, []);

  // Lobby timer
  useEffect(() => {
    if (state.phase !== 'lobby') return;
    setState(s => ({ ...s, timer: LOBBY_TIME, selectedStack: null, occupiedStacks: generateOccupied() }));
    timerRef.current = setInterval(() => {
      setState(s => {
        const next = s.timer - 1;
        if (next <= WARNING_TIME && s.phase === 'lobby') {
          return { ...s, timer: next, phase: 'warning' };
        }
        if (next <= 0) return s; // handled by warning phase
        return { ...s, timer: next };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [state.phase === 'lobby']);

  // Warning timer → game
  useEffect(() => {
    if (state.phase !== 'warning') return;
    timerRef.current = setInterval(() => {
      setState(s => {
        const next = s.timer - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          const mode = s.selectedStack ? 'player' : 'spectator';
          const card = s.selectedStack ? generateBingoCard(s.selectedStack) : null;
          return {
            ...s,
            timer: 0,
            phase: 'game',
            playerMode: mode,
            bingoCard: card,
            calledNumbers: [],
            daubedNumbers: new Set([0]),
            isEliminated: false,
            winner: null,
            stats: { ...s.stats, callCount: 0 },
          };
        }
        return { ...s, timer: next };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [state.phase === 'warning']);

  // Game: call numbers
  useEffect(() => {
    if (state.phase !== 'game') return;
    usedNumbers.current = new Set();

    const callNumber = () => {
      setState(s => {
        if (usedNumbers.current.size >= 75) {
          // Game over, no winner
          clearInterval(callRef.current);
          return { ...s, phase: 'gameover', winner: null };
        }
        let num: number;
        do { num = Math.floor(Math.random() * 75) + 1; } while (usedNumbers.current.has(num));
        usedNumbers.current.add(num);
        const called: CalledNumber = { number: num, letter: getLetterForNumber(num), timestamp: Date.now() };
        return {
          ...s,
          calledNumbers: [...s.calledNumbers, called],
          stats: { ...s.stats, callCount: s.calledNumbers.length + 1 },
        };
      });
    };

    // First call immediately
    callNumber();
    callRef.current = setInterval(callNumber, CALL_INTERVAL);
    return () => clearInterval(callRef.current);
  }, [state.phase === 'game']);

  const daubNumber = useCallback((num: number) => {
    setState(s => {
      if (s.isEliminated || s.playerMode !== 'player') return s;
      if (!s.calledNumbers.some(c => c.number === num)) return s;
      const next = new Set(s.daubedNumbers);
      next.add(num);
      return { ...s, daubedNumbers: next };
    });
  }, []);

  const checkBingo = useCallback((): boolean => {
    const s = state;
    if (!s.bingoCard) return false;
    const grid = s.bingoCard.numbers;
    const isDaubed = (r: number, c: number) =>
      (r === 2 && c === 2) || (grid[r][c] !== null && s.daubedNumbers.has(grid[r][c]!));

    // Rows
    for (let r = 0; r < 5; r++) if ([0,1,2,3,4].every(c => isDaubed(r, c))) return true;
    // Cols
    for (let c = 0; c < 5; c++) if ([0,1,2,3,4].every(r => isDaubed(r, c))) return true;
    // Diags
    if ([0,1,2,3,4].every(i => isDaubed(i, i))) return true;
    if ([0,1,2,3,4].every(i => isDaubed(i, 4-i))) return true;
    // 4 corners
    if (isDaubed(0,0) && isDaubed(0,4) && isDaubed(4,0) && isDaubed(4,4)) return true;
    return false;
  }, [state]);

  const claimBingo = useCallback(() => {
    if (checkBingo()) {
      clearInterval(callRef.current);
      setState(s => ({ ...s, phase: 'gameover', winner: 'You' }));
    } else {
      setState(s => ({ ...s, isEliminated: true }));
    }
  }, [checkBingo]);

  const returnToLobby = useCallback(() => {
    setState(s => ({
      ...s,
      phase: 'lobby',
      timer: LOBBY_TIME,
      selectedStack: null,
      bingoCard: null,
      calledNumbers: [],
      daubedNumbers: new Set([0]),
      isEliminated: false,
      winner: null,
      stats: { ...s.stats, callCount: 0 },
    }));
  }, []);

  return { state, authenticate, selectStack, daubNumber, claimBingo, returnToLobby, setPhase };
}
