import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  children?: ReactNode;
}

const variants = {
  primary:
    'border-brand/70 bg-brand text-on-brand shadow-glow-md hover:bg-brand-hover',
  secondary: 'border-line bg-surface text-slate-100 hover:border-brand/50 hover:text-white',
  ghost: 'border-transparent bg-transparent text-slate-300 hover:bg-surface hover:text-white',
  danger: 'border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20',
};

export const Button = ({ variant = 'secondary', icon, className = '', children, ...props }: ButtonProps) => (
  <motion.button
    whileHover={{ y: props.disabled ? 0 : -1 }}
    whileTap={{ scale: props.disabled ? 1 : 0.98 }}
    className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold transition disabled:opacity-45 ${variants[variant]} ${className}`}
    {...props}
  >
    {icon}
    {children}
  </motion.button>
);
