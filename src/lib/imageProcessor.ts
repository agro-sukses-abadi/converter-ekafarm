import type { ConversionResult, ConverterSettings } from '../types/image';

const getBackgroundColor = (settings: ConverterSettings): string | undefined => {
  if (settings.backgroundMode === 'transparent') return undefined;
  if (settings.backgroundMode === 'white') return '#ffffff';
  if (settings.backgroundMode === 'black') return '#000000';
  return settings.customBackground;
};

const calculateTargetSize = (
  width: number,
  height: number,
  settings: ConverterSettings,
): { width: number; height: number } => {
  if (settings.resizeMode === 'original') return { width, height };

  if (settings.resizeMode === 'width') {
    const targetWidth = Math.max(1, Math.round(settings.customWidth || width));
    return {
      width: targetWidth,
      height: settings.maintainAspectRatio ? Math.round((targetWidth / width) * height) : height,
    };
  }

  const targetHeight = Math.max(1, Math.round(settings.customHeight || height));
  return {
    width: settings.maintainAspectRatio ? Math.round((targetHeight / height) * width) : width,
    height: targetHeight,
  };
};

export const loadImageMetadata = async (file: File): Promise<{ width: number; height: number }> => {
  const url = URL.createObjectURL(file);
  try {
    const bitmap = await createImageBitmap(file);
    const metadata = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return metadata;
  } catch {
    const image = await loadHtmlImage(url);
    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const convertToWebp = async (
  file: File,
  settings: ConverterSettings,
): Promise<ConversionResult> => {
  const source = await createSource(file);
  const target = calculateTargetSize(source.width, source.height, settings);
  const canvas = document.createElement('canvas');
  canvas.width = target.width;
  canvas.height = target.height;

  const context = canvas.getContext('2d', { alpha: settings.backgroundMode === 'transparent' });
  if (!context) {
    source.close?.();
    throw new Error('Canvas rendering is not available in this browser.');
  }

  const background = getBackgroundColor(settings);
  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, target.width, target.height);
  } else {
    context.clearRect(0, 0, target.width, target.height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source.image, 0, 0, target.width, target.height);
  source.close?.();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) reject(new Error('WebP encoding failed.'));
        else resolve(result);
      },
      'image/webp',
      settings.quality / 100,
    );
  });

  canvas.width = 0;
  canvas.height = 0;
  return { blob, width: target.width, height: target.height };
};

const createSource = async (
  file: File,
): Promise<{ image: ImageBitmap | HTMLImageElement; width: number; height: number; close?: () => void }> => {
  try {
    const bitmap = await createImageBitmap(file);
    return {
      image: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = await loadHtmlImage(url);
      return { image, width: image.naturalWidth, height: image.naturalHeight };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
};

const loadHtmlImage = async (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The image format is not supported by this browser.'));
    image.src = url;
  });
