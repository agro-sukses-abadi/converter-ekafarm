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

const makeUniqueName = (name: string, used: Set<string>): string => {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : '';

  let candidate = name;
  let counter = 1;
  while (used.has(candidate.toLowerCase())) {
    candidate = `${base}-${counter}${extension}`;
    counter += 1;
  }

  used.add(candidate.toLowerCase());
  return candidate;
};

export const downloadZip = async (items: ImageItem[]): Promise<void> => {
  const zip = new JSZip();
  const used = new Set<string>();
  const converted = items.filter(
    (item): item is ImageItem & { convertedBlob: Blob; outputName: string } =>
      Boolean(item.convertedBlob && item.outputName),
  );

  for (const item of converted) {
    zip.file(makeUniqueName(item.outputName, used), item.convertedBlob);
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  downloadBlob(blob, 'webp-images.zip');
};