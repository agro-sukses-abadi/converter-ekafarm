import { Download, Package, Play, Trash2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import type { ImageItem } from '../types/image';

interface DownloadPanelProps {
  items: ImageItem[];
  isConverting: boolean;
  onConvertAll: () => void;
  onDownloadAll: () => void;
  onClear: () => void;
}

export const DownloadPanel = ({
  items,
  isConverting,
  onConvertAll,
  onDownloadAll,
  onClear,
}: DownloadPanelProps) => {
  const convertedCount = items.filter((item) => item.convertedBlob).length;
  const hasItems = items.length > 0;

  return (
    <Card title="Batch Actions" icon={<Package size={17} className="text-brand" aria-hidden />}>
      <div className="space-y-3">
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={!hasItems || isConverting}
          onClick={onConvertAll}
          icon={<Play size={17} aria-hidden />}
        >
          Convert All
        </Button>
        <Button
          type="button"
          className="w-full"
          disabled={convertedCount === 0}
          onClick={onDownloadAll}
          icon={<Download size={17} aria-hidden />}
        >
          {convertedCount > 1 ? 'Download ZIP' : 'Download Image'}
        </Button>
        <Button
          type="button"
          variant="danger"
          className="w-full"
          disabled={!hasItems || isConverting}
          onClick={onClear}
          icon={<Trash2 size={17} aria-hidden />}
        >
          Clear Queue
        </Button>
      </div>
      <div className="mt-5 rounded-2xl border border-line bg-canvas p-4 text-sm text-ink-muted">
        <p className="font-bold text-ink">{convertedCount} converted</p>
        <p className="mt-1">Multiple converted files download as a ZIP archive.</p>
      </div>
    </Card>
  );
};
