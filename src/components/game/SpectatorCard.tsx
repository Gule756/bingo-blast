import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export function SpectatorCard() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="spectator-card"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Eye className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-1 text-xl font-bold text-card">Spectator Mode</h3>
      <p className="font-semibold text-card">You are watching this game</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Wait for this game to finish, then you can join the next round from the lobby!
      </p>
    </motion.div>
  );
}
