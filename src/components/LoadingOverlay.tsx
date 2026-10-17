import { motion } from 'motion/react';

export const LoadingOverlay = ({ active }: { active: boolean }) =>
  active ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 grid place-items-center bg-[#0a0e14]/55 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="cyber-card rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#243041] border-t-[#00ff66]" />
        <p className="font-bold text-white">Converting images</p>
        <p className="mt-1 text-sm text-slate-400">Rendering locally in your browser.</p>
      </div>
    </motion.div>
  ) : null;
