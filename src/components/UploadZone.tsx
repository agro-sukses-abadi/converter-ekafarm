import { useCallback, useRef, useState, type DragEvent } from 'react';
import { FolderOpen, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { readFilesFromDataTransfer } from '../utils/file';

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
}

export const UploadZone = ({ onFiles }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      onFiles(await readFilesFromDataTransfer(event.dataTransfer));
    },
    [onFiles],
  );

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-2xl border border-dashed p-5 text-center transition ${
        isDragging
          ? 'border-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_40px_rgba(0,255,102,.14)]'
          : 'border-[#243041] bg-[#121820]/55'
      }`}
    >
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/gif,image/bmp,image/tiff,image/webp"
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#00ff66]/10 text-[#00ff66]">
        <Upload size={26} aria-hidden />
      </div>
      <h2 className="font-heading text-xl font-black text-white">Upload Images</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
        Drop files or folders here. Paste images from clipboard with Ctrl + V.
      </p>
      <Button
        type="button"
        variant="primary"
        className="mt-5 w-full"
        icon={<FolderOpen size={17} aria-hidden />}
        onClick={() => inputRef.current?.click()}
      >
        Browse Files
      </Button>
    </motion.div>
  );
};
