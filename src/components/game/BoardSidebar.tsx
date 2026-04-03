import { CalledNumber, BINGO_LETTERS, getLetterColor } from '@/types/game';

interface BoardSidebarProps {
  calledNumbers: CalledNumber[];
  boardSize?: number;
  compact?: boolean;
}

export function BoardSidebar({ calledNumbers, boardSize = 75, compact }: BoardSidebarProps) {
  const calledSet = new Set(calledNumbers.map(c => c.number));
  const currentNumber = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1].number : null;
  const ranges: [number, number][] = [[1,15],[16,30],[31,45],[46,60],[61,75]];

  const cellH = compact ? 'h-6' : 'h-6';
  const fontSize = compact ? 'text-xs' : 'text-xs';

  return (
    <div className="rounded-xl bg-card p-2 text-sm h-full flex flex-col">
      <div className="mb-2 text-center text-muted-foreground text-sm font-medium">Called Numbers</div>
      {/* Header */}
      <div className="mb-2 grid grid-cols-5 gap-1">
        {BINGO_LETTERS.map(l => (
          <div key={l} className={`${getLetterColor(l)} flex ${cellH} items-center justify-center rounded-xl ${fontSize} font-bold`}>
            {l}
          </div>
        ))}
      </div>
      {/* Numbers grid */}
      <div className="flex-1 grid grid-cols-5 gap-0.5">
        {Array.from({ length: 15 }, (_, row) =>
          ranges.map(([min], col) => {
            const num = min + row;
            if (num > 75) return <div key={`${row}-${col}`} />;
            const isCurrent = num === currentNumber;
            const isCalled = calledSet.has(num) && !isCurrent;
            return (
              <div
                key={num}
                className={`flex ${cellH} items-center justify-center rounded-xl ${fontSize} font-medium transition-colors ${
                  isCurrent
                    ? 'cell-current-call'
                    : isCalled
                      ? 'cell-called-prev'
                      : 'cell-default'
                }`}
              >
                {num}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
