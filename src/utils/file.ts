const ACCEPTED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
]);

const ACCEPTED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tif', 'tiff', 'webp']);

export const isSupportedImage = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return ACCEPTED_TYPES.has(file.type) || ACCEPTED_EXTENSIONS.has(extension);
};

export const filterSupportedImages = (files: File[]): { accepted: File[]; rejected: File[] } => {
  const accepted: File[] = [];
  const rejected: File[] = [];

  for (const file of files) {
    if (isSupportedImage(file)) accepted.push(file);
    else rejected.push(file);
  }

  return { accepted, rejected };
};

export const readFilesFromDataTransfer = async (dataTransfer: DataTransfer): Promise<File[]> => {
  const entries = Array.from(dataTransfer.items)
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry));

  if (entries.length === 0) return Array.from(dataTransfer.files);

  const files = await Promise.all(entries.map(readEntry));
  return files.flat();
};

const readEntry = async (entry: FileSystemEntry): Promise<File[]> => {
  if (entry.isFile) {
    return new Promise((resolve) => {
      (entry as FileSystemFileEntry).file((file) => resolve([file]), () => resolve([]));
    });
  }

  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    const batches: FileSystemEntry[][] = [];
    let batch: FileSystemEntry[] = [];

    do {
      batch = await new Promise<FileSystemEntry[]>((resolve) => {
        reader.readEntries(resolve, () => resolve([]));
      });
      batches.push(batch);
    } while (batch.length > 0);

    const nested = await Promise.all(batches.flat().map(readEntry));
    return nested.flat();
  }

  return [];
};
