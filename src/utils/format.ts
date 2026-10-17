export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
};

export const formatPercent = (value: number): string => `${Math.round(value)}%`;

export const getReduction = (originalSize: number, convertedSize?: number): number => {
  if (!convertedSize || originalSize === 0) return 0;
  return Math.max(0, ((originalSize - convertedSize) / originalSize) * 100);
};

export const getSavings = (originalSize: number, convertedSize?: number): number => {
  if (!convertedSize) return 0;
  return Math.max(0, originalSize - convertedSize);
};

export const getExtension = (file: File): string => {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName) return fromName === 'jpg' ? 'jpeg' : fromName;
  return file.type.split('/').pop() ?? 'unknown';
};

export const toWebpName = (name: string): string => {
  const base = name.replace(/\.[^/.]+$/, '');
  return `${base || 'converted'}.webp`;
};
