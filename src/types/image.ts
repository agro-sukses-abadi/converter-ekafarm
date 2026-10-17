export type ResizeMode = 'original' | 'width' | 'height';
export type BackgroundMode = 'transparent' | 'white' | 'black' | 'custom';
export type ConversionStatus = 'queued' | 'processing' | 'done' | 'error';

export interface ConverterSettings {
  quality: number;
  resizeMode: ResizeMode;
  customWidth: number;
  customHeight: number;
  maintainAspectRatio: boolean;
  backgroundMode: BackgroundMode;
  customBackground: string;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  extension: string;
  originalSize: number;
  width: number;
  height: number;
  status: ConversionStatus;
  progress: number;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  outputName?: string;
  error?: string;
}

export interface ConversionResult {
  blob: Blob;
  width: number;
  height: number;
}
