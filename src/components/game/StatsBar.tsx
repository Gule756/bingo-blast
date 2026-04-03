interface StatsBarProps {
  stats: { players: number; bet: number; callCount: number };
  balance: number;
  onClose: () => void;
}

export function StatsBar({ stats, balance, onClose }: StatsBarProps) {
  const sections = [
    { label: 'Balance', value: `${balance}` },
    { label: 'Players', value: stats.players },
    { label: 'Bet', value: stats.bet },
    { label: 'Call', value: stats.callCount },
  ];

  return (
    <div className="flex w-full justify-between items-center rounded-xl bg-slate-900 px-4 py-2 text-white">
      <button
        onClick={onClose}
        className="flex items-center gap-1 rounded-lg bg-blue-800 px-3 py-1.5 text-sm font-bold"
      >
        ✕ Close
      </button>
      <div className="grid flex-1 grid-cols-4 gap-2 px-4">
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Balance</div>
          <div className="text-base font-bold">44</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Players</div>
          <div className="text-base font-bold">{stats.players}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Bet</div>
          <div className="text-base font-bold">{stats.bet}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Call</div>
          <div className="text-base font-bold">{stats.callCount}</div>
        </div>
      </div>
    </div>
  );
}
