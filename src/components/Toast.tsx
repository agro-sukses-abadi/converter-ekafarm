import { Check, CircleAlert, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ToastMessage } from '../types/toast';

const icons = {
  success: Check,
  error: CircleAlert,
  info: Info,
};

export const ToastStack = ({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) => (
  <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3" aria-live="polite">
    <AnimatePresence>
      {toasts.map((toast) => {
        const Icon = icons[toast.tone];
        return (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            className="cyber-card flex items-start gap-3 rounded-2xl p-4"
          >
            <div className="mt-0.5 text-brand">
              <Icon size={18} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">{toast.title}</p>
              {toast.message && <p className="mt-1 text-sm text-slate-400">{toast.message}</p>}
            </div>
            <button
              type="button"
              className="focus-ring rounded-lg p-1 text-slate-500 hover:text-white"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} aria-hidden />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);
