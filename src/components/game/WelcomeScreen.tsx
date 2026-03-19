import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onAuthenticate: () => void;
}

export function WelcomeScreen({ onAuthenticate }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-bingo-g bg-card">
          <span className="font-mono text-4xl font-black tracking-tighter text-foreground">HB</span>
        </div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">Habesha Bingo</h1>
        <p className="text-muted-foreground">Multiplayer Bingo via Telegram</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-xs space-y-4"
      >
        <button
          onClick={onAuthenticate}
          className="gradient-hero w-full rounded-xl px-6 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-transform active:scale-95"
        >
          🎯 Verify Identity
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Share your contact to verify and start playing
        </p>
      </motion.div>
    </div>
  );
}
