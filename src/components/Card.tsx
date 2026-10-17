import type { PropsWithChildren, ReactNode } from 'react';

interface CardProps extends PropsWithChildren {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const Card = ({ title, icon, action, className = '', children }: CardProps) => (
  <section className={`cyber-card rounded-2xl p-5 ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          {title && <h2 className="truncate text-sm font-bold uppercase tracking-[0.16em] text-slate-200">{title}</h2>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);
