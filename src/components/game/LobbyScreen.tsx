import { motion } from 'framer-motion';
import { LobbyGrid } from './LobbyGrid';

interface LobbyScreenProps {
  timer: number;
  selectedStack: number | null;
  occupiedStacks: Set<number>;
  stats: { derash: number; players: number; bet: number; callCount: number };
  onSelect: (id: number) => void;
}

export function LobbyScreen({ timer, selectedStack, occupiedStacks, stats, onSelect }: LobbyScreenProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-1 bg-card p-2">
        {[
          { label: 'CARD', value: selectedStack ?? '-' },
          { label: 'WALLET', value: stats.derash },
          { label: 'STAKE', value: stats.bet },
          { label: 'STARTING', value: `${timer}s`, highlight: timer <= 10 },
        ].map(s => (
          <div key={s.label} className={`stat-card flex-1 ${s.highlight ? 'gradient-danger' : ''}`}>
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
            <span className={`text-sm font-bold ${s.highlight ? 'text-primary-foreground' : 'text-foreground'}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Insufficient balance mock */}
      <div className="mx-2 mt-2 rounded-lg border-l-4 border-destructive bg-destructive/10 p-3">
        <p className="text-sm font-bold text-foreground">Insufficient balance!</p>
        <p className="text-xs text-muted-foreground">You need {stats.bet} ETB to play. Your balance: 2 ETB.</p>
      </div>

      {timer <= 10 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mx-2 mt-2 flex items-center gap-3 rounded-lg gradient-danger p-3"
        >
          <span className="text-2xl">⏰</span>
          <div>
            <p className="text-sm font-bold text-primary-foreground">Game starting in {timer}s - Hurry!</p>
            <p className="text-xs text-primary-foreground/80">You can still select your card!</p>
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        <LobbyGrid selectedStack={selectedStack} occupiedStacks={occupiedStacks} onSelect={onSelect} />
      </div>
    </div>
  );
}
