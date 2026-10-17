import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DownloadPanel } from '../components/DownloadPanel';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { PreviewGrid } from '../components/PreviewGrid';
import { SettingsPanel } from '../components/SettingsPanel';
import { StatsCard } from '../components/StatsCard';
import { ToastStack } from '../components/Toast';
import { UploadZone } from '../components/UploadZone';
import { downloadBlob, downloadZip } from '../lib/download';
import { convertToWebp, loadImageMetadata } from '../lib/imageProcessor';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToasts } from '../hooks/useToasts';
import type { ConverterSettings, ImageItem } from '../types/image';
import { filterSupportedImages } from '../utils/file';
import { getExtension, toWebpName } from '../utils/format';

const DEFAULT_SETTINGS: ConverterSettings = {
  quality: 85,
  resizeMode: 'original',
  customWidth: 1920,
  customHeight: 1080,
  maintainAspectRatio: true,
  backgroundMode: 'transparent',
  customBackground: '#00ff66',
};

export const ConverterPage = () => {
  const [settings, setSettings] = useLocalStorage('webp-converter-settings', DEFAULT_SETTINGS);
  const [items, setItems] = useState<ImageItem[]>([]);
  const itemsRef = useRef<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const { toasts, pushToast, dismissToast } = useToasts();

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      }
    },
    [],
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      const { accepted, rejected } = filterSupportedImages(files);
      if (rejected.length > 0) {
        pushToast('error', 'Unsupported files skipped', `${rejected.length} file(s) are not image formats.`);
      }

      if (accepted.length === 0) return;

      const placeholders: ImageItem[] = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        extension: getExtension(file),
        originalSize: file.size,
        width: 0,
        height: 0,
        status: 'queued',
        progress: 0,
      }));

      setItems((current) => [...placeholders, ...current]);
      pushToast('info', 'Images added', `${accepted.length} image(s) queued for conversion.`);

      await Promise.all(
        placeholders.map(async (placeholder) => {
          try {
            const metadata = await loadImageMetadata(placeholder.file);
            setItems((current) =>
              current.map((item) => (item.id === placeholder.id ? { ...item, ...metadata } : item)),
            );
          } catch (error) {
            setItems((current) =>
              current.map((item) =>
                item.id === placeholder.id
                  ? { ...item, status: 'error', error: error instanceof Error ? error.message : 'Could not read image.' }
                  : item,
              ),
            );
          }
        }),
      );
    },
    [pushToast],
  );

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []);
      if (files.length > 0) void addFiles(files);
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addFiles]);

  const removeItem = useCallback((id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const clearQueue = useCallback(() => {
    setItems((current) => {
      for (const item of current) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      }
      return [];
    });
  }, []);

  const convertAll = useCallback(async () => {
    const candidates = items.filter((item) => item.status !== 'error');
    if (candidates.length === 0) return;

    setIsConverting(true);

    for (const candidate of candidates) {
      setItems((current) =>
        current.map((item) => (item.id === candidate.id ? { ...item, status: 'processing', progress: 14 } : item)),
      );

      await new Promise((resolve) => window.setTimeout(resolve, 140));

      try {
        const result = await convertToWebp(candidate.file, settings);
        const convertedUrl = URL.createObjectURL(result.blob);
        const outputName = toWebpName(candidate.name);

        setItems((current) =>
          current.map((item) => {
            if (item.id !== candidate.id) return item;
            if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
            return {
              ...item,
              width: result.width,
              height: result.height,
              convertedBlob: result.blob,
              convertedUrl,
              convertedSize: result.blob.size,
              outputName,
              status: 'done',
              progress: 100,
              error: undefined,
            };
          }),
        );
      } catch (error) {
        setItems((current) =>
          current.map((item) =>
            item.id === candidate.id
              ? {
                  ...item,
                  status: 'error',
                  progress: 100,
                  error: error instanceof Error ? error.message : 'Conversion failed.',
                }
              : item,
          ),
        );
      }
    }

    setIsConverting(false);
    pushToast('success', 'Conversion finished', `${candidates.length} image(s) processed locally.`);
  }, [items, pushToast, settings]);

  const downloadItem = useCallback(
    (id: string) => {
      const item = items.find((current) => current.id === id);
      if (!item?.convertedBlob || !item.outputName) return;
      downloadBlob(item.convertedBlob, item.outputName);
      pushToast('success', 'Download complete', item.outputName);
    },
    [items, pushToast],
  );

  const downloadAll = useCallback(async () => {
    const converted = items.filter((item) => item.convertedBlob);
    if (converted.length === 0) return;

    if (converted.length === 1) {
      downloadItem(converted[0]!.id);
      return;
    }

    await downloadZip(converted);
    pushToast('success', 'Download complete', 'ZIP archive generated in your browser.');
  }, [downloadItem, items, pushToast]);

  const copyItem = useCallback(
    async (id: string) => {
      const item = items.find((current) => current.id === id);
      if (!item?.convertedBlob || !navigator.clipboard?.write) return;

      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/webp': item.convertedBlob })]);
        pushToast('success', 'Copied to clipboard', item.outputName ?? 'Converted image');
      } catch {
        pushToast('error', 'Copy failed', 'Your browser blocked image clipboard access.');
      }
    },
    [items, pushToast],
  );

  const leftPanel = useMemo(
    () => (
      <div className="space-y-4">
        <UploadZone onFiles={(files) => void addFiles(files)} />
        <SettingsPanel settings={settings} onChange={setSettings} />
      </div>
    ),
    [addFiles, setSettings, settings],
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <aside className="lg:sticky lg:top-4 lg:self-start">{leftPanel}</aside>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid-surface min-h-[520px] rounded-2xl border border-line bg-surface/35 p-3 sm:p-4"
          aria-label="Image previews"
        >
          <PreviewGrid items={items} onRemove={removeItem} onDownload={downloadItem} onCopy={copyItem} />
        </motion.section>

        <aside className="grid gap-4 md:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:sticky xl:top-4 xl:grid-cols-1 xl:self-start">
          <StatsCard items={items} />
          <DownloadPanel
            items={items}
            isConverting={isConverting}
            onConvertAll={() => void convertAll()}
            onDownloadAll={() => void downloadAll()}
            onClear={clearQueue}
          />
        </aside>
      </main>
      <Footer />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <AnimatePresence>
        <LoadingOverlay active={isConverting} />
      </AnimatePresence>
    </div>
  );
};
