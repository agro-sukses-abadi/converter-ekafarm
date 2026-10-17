interface DataTransferItem {
  webkitGetAsEntry?: () => FileSystemEntry | null;
}

interface FileSystemEntry {
  readonly isFile: boolean;
  readonly isDirectory: boolean;
}

interface FileSystemFileEntry extends FileSystemEntry {
  file(successCallback: (file: File) => void, errorCallback?: () => void): void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader(): FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries(successCallback: (entries: FileSystemEntry[]) => void, errorCallback?: () => void): void;
}
