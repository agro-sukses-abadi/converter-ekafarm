import { AnimatePresence } from 'motion/react';
import { EmptyState } from './EmptyState';
import { ImageCard } from './ImageCard';
import type { ImageItem } from '../types/image';

interface PreviewGridProps {
  items: ImageItem[];
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  onCopy: (id: string) => void;
}

export const PreviewGrid = ({ items, onRemove, onDownload, onCopy }: PreviewGridProps) => {
  if (items.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      <AnimatePresence>
        {items.map((item) => (
          <ImageCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            onDownload={onDownload}
            onCopy={onCopy}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
