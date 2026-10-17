import { memo } from 'react';
import { ArrowRight, Clipboard, Download, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './Button';
import type { ImageItem } from '../types/image';
import { formatBytes, formatPercent, getReduction, getSavings } from '../utils/format';

interface ImageCardProps {
  item: ImageItem;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  onCopy: (id: string) => void;
}

export const ImageCard = memo(({ item, onRemove, onDownload, onCopy }: ImageCardProps) => {
  const reduction = getReduction(item.originalSize, item.convertedSize);
  const saved = getSavings(item.originalSize, item.convertedSize);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      whileHover={{ y: -3 }}
      className="cyber-card overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[4/3] bg-[#0a0e14]">
        <img className="h-full w-full object-contain" src={item.previewUrl} alt="" loading="lazy" />
        <div className="absolute left-3 top-3 rounded-full border border-[#243041] bg-[#0a0e14]/85 px-2 py-1 text-xs font-bold uppercase text-[#4fdcff]">
          {item.extension}
        </div>
        {item.status === 'processing' && (
          <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-full bg-[#243041]">
            <div
              className="h-2 rounded-full bg-[#00ff66] transition-all"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-white" title={item.name}>
              {item.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {item.width} x {item.height}px
            </p>
          </div>
          <button
            type="button"
            className="focus-ring shrink-0 rounded-xl p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-200"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 size={17} aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl border border-[#243041] bg-[#0a0e14] p-3">
          <div>
            <p className="text-xs text-slate-500">Original</p>
            <p className="font-mono-stat text-sm text-white">{formatBytes(item.originalSize)}</p>
          </div>
          <ArrowRight size={16} className="text-[#00ff66]" aria-hidden />
          <div className="text-right">
            <p className="text-xs text-slate-500">WebP</p>
            <p className="font-mono-stat text-sm text-white">
              {item.convertedSize ? formatBytes(item.convertedSize) : '--'}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-[#121820] p-3">
            <p className="text-slate-500">Reduction</p>
            <p className="font-mono-stat mt-1 text-[#00ff66]">{formatPercent(reduction)}</p>
          </div>
          <div className="rounded-xl bg-[#121820] p-3">
            <p className="text-slate-500">Saved</p>
            <p className="font-mono-stat mt-1 text-[#4fdcff]">{formatBytes(saved)}</p>
          </div>
        </div>

        {item.error && <p className="mt-3 text-sm text-red-300">{item.error}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            className="min-h-10 rounded-xl px-3"
            disabled={!item.convertedBlob}
            onClick={() => onDownload(item.id)}
            icon={<Download size={16} aria-hidden />}
          >
            Save
          </Button>
          <Button
            type="button"
            className="min-h-10 rounded-xl px-3"
            disabled={!item.convertedBlob || !navigator.clipboard}
            onClick={() => onCopy(item.id)}
            icon={<Clipboard size={16} aria-hidden />}
          >
            Copy
          </Button>
        </div>
      </div>
    </motion.article>
  );
});

ImageCard.displayName = 'ImageCard';
