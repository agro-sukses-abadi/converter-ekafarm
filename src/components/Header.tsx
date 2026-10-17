import { ShieldCheck, Sparkles } from 'lucide-react';

export const Header = () => (
  <header className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 pb-6 pt-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-hover">
        <Sparkles size={14} aria-hidden />
        WebP Utility
      </div>
      <h1 className="font-heading text-3xl font-black leading-tight text-ink-strong sm:text-5xl">
        WebP Image Converter
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
        Convert, resize, and compress image batches locally with browser-native Canvas encoding.
      </p>
    </div>
    <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-line bg-surface/80 px-4 py-3 text-sm font-semibold text-ink">
      <ShieldCheck className="text-brand" size={18} aria-hidden />
      No images are uploaded.
    </div>
  </header>
);
