import JSZip from 'jszip';
import type { ImageItem } from '../types/image';

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

export const downloadZip = async (items: ImageItem[]): Promise<void> => {
  const zip = new JSZip();
  const converted = items.filter(
    (item): item is ImageItem & { convertedBlob: Blob; outputName: string } =>
      Boolean(item.convertedBlob && item.outputName),
  );

  for (const item of converted) {
    zip.file(item.outputName, item.convertedBlob);
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  downloadBlob(blob, 'webp-images.zip');
};
