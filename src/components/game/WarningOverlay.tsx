import { motion } from 'framer-motion';

interface WarningOverlayProps {
  timer: number;
}

export function WarningOverlay({ timer }: WarningOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="gradient-danger rounded-2xl p-8 text-center shadow-2xl"
      >
        <div className="mb-2 text-4xl">⏰</div>
        <h2 className="mb-1 text-xl font-bold text-primary-foreground">
          Game starting in {timer}s - Hurry!
        </h2>
        <p className="text-sm text-primary-foreground/80">You can still select your card!</p>
      </motion.div>
    </motion.div>
  );
}
