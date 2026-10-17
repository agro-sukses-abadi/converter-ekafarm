import { ImagePlus } from 'lucide-react';
import { motion } from 'motion/react';

export const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="grid min-h-[430px] place-items-center rounded-2xl border border-dashed border-[#243041] bg-[#121820]/45 p-8 text-center"
  >
    <div className="max-w-md">
      <svg className="mx-auto mb-6 h-40 w-40" viewBox="0 0 180 180" role="img" aria-label="Image upload illustration">
        <rect x="24" y="34" width="132" height="104" rx="18" fill="#171f29" stroke="#243041" strokeWidth="3" />
        <path d="M42 118l28-34 23 24 15-18 30 32" fill="none" stroke="#4fdcff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="123" cy="64" r="10" fill="#00ff66" opacity=".9" />
        <path d="M90 28v38m0-38L76 42m14-14 14 14" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ff66]/10 text-[#00ff66]">
        <ImagePlus size={24} aria-hidden />
      </div>
      <h2 className="font-heading text-2xl font-black text-white">Drop images to begin</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Drag files or folders, browse from disk, or paste an image with Ctrl + V. PNG, JPEG, GIF, BMP, TIFF, and WebP are supported.
      </p>
    </div>
  </motion.div>
);
