# WebP Image Converter Project Documentation

## 1. Overview

WebP Image Converter is a client-side web application for converting common image formats into WebP. It is designed as a polished desktop-style utility with a dark Obsidian Cyberpunk interface and a privacy-first processing model.

The application performs all image reading, rendering, conversion, compression, resizing, and downloads locally in the browser. No image data is sent to any server.

## 2. Goals

- Provide a fast and elegant image conversion workflow.
- Keep image processing private and fully local.
- Support batch conversion and ZIP export.
- Offer production-ready TypeScript architecture.
- Provide responsive layouts for desktop, tablet, and mobile.
- Use reusable components, hooks, utilities, and feature-focused modules.
- Support static deployment and PWA installation.

## 3. Core User Flow

1. User uploads images by drag and drop, file browse, folder drop, or clipboard paste.
2. The app validates supported image formats.
3. Preview cards are created with object URLs.
4. Browser-readable metadata is loaded locally.
5. User adjusts WebP quality, resize options, and background behavior.
6. User clicks **Convert All**.
7. Each image is rendered to Canvas and encoded as WebP.
8. Converted file size and reduction statistics are shown.
9. User downloads one file or all converted files as a ZIP archive.

## 4. Architecture

```text
src/
├── components/         Reusable UI components
├── hooks/              Reusable React hooks
├── lib/                Browser processing and download libraries
├── pages/              Page-level feature composition
├── styles/             Global Tailwind and design tokens
├── types/              Shared TypeScript types
├── utils/              Formatting and file helpers
├── App.tsx             Root component
└── main.tsx            React entry point and service worker registration
```

## 5. Important Files

| File | Purpose |
| --- | --- |
| `src/pages/ConverterPage.tsx` | Main application state, upload handling, conversion orchestration, downloads, toasts |
| `src/lib/imageProcessor.ts` | Local image metadata loading and Canvas WebP conversion |
| `src/lib/download.ts` | Blob download and JSZip archive generation |
| `src/utils/file.ts` | Supported image filtering and folder drag traversal |
| `src/utils/format.ts` | File size, percentage, extension, and filename formatting |
| `src/hooks/useLocalStorage.ts` | Persistent converter settings |
| `src/hooks/useToasts.ts` | Toast notification state |
| `src/styles/global.css` | Tailwind import, fonts, theme tokens, base styling |
| `public/sw.js` | Offline service worker |
| `public/manifest.webmanifest` | PWA manifest |

## 6. Components

### `Header`

Displays the product name, short description, and privacy badge.

### `Footer`

Shows the client-side privacy statement and technology stack.

### `UploadZone`

Handles drag and drop, file browsing, multiple files, and folder drop support where available.

### `SettingsPanel`

Composes conversion settings:

- WebP quality
- Resize mode
- Aspect ratio toggle
- Background mode
- Custom color picker

### `PreviewGrid`

Displays the empty state or a responsive grid of image preview cards.

### `ImageCard`

Displays individual image information:

- Thumbnail
- Filename
- Dimensions
- Original format
- Original size
- Converted size
- Reduction percentage
- Saved bytes
- Download and clipboard actions

### `StatsCard`

Shows animated global metrics:

- Original size
- Converted size
- Saved bytes
- Reduction
- Total images

### `DownloadPanel`

Provides batch actions:

- Convert all
- Download image or ZIP
- Clear queue

### `ToastStack`

Displays success, error, and informational notifications.

### `LoadingOverlay`

Shows conversion progress feedback while batch conversion is running.

## 7. Image Processing

Image conversion is implemented in `src/lib/imageProcessor.ts`.

The conversion pipeline:

1. Load the source image with `createImageBitmap`.
2. Fall back to `HTMLImageElement` if needed.
3. Calculate target dimensions from resize settings.
4. Create an in-memory `<canvas>`.
5. Fill the background when required.
6. Draw the source image onto the canvas.
7. Export the canvas as WebP using `canvas.toBlob`.
8. Clear canvas dimensions to release memory.
9. Close `ImageBitmap` instances when used.

The application revokes object URLs when items are removed, cleared, or replaced.

## 8. Supported Formats

The app accepts:

- `image/png`
- `image/jpeg`
- `image/jpg`
- `image/gif`
- `image/bmp`
- `image/tiff`
- `image/webp`

It also checks common file extensions for browsers that provide incomplete MIME types.

TIFF support depends on the browser’s native image decoding capability.

## 9. Conversion Settings

### Quality

Range: `0` to `100`

Default: `85`

The value is passed to `canvas.toBlob` as a decimal between `0` and `1`.

### Resize

Modes:

- Keep original
- Custom width
- Custom height

When maintain aspect ratio is enabled, the missing dimension is calculated from the original image ratio.

### Background

Modes:

- Transparent
- White
- Black
- Custom color

Background fill is useful for transparent PNG files when the target WebP should not preserve transparency.

## 10. Downloads

Single-file download uses an object URL and a temporary anchor element.

Multiple converted files are packaged with JSZip and downloaded as:

```text
webp-images.zip
```

Generated object URLs are revoked after use.

## 11. State Management

The app uses local React state and focused hooks:

- `items`: uploaded image queue and conversion results
- `settings`: persisted converter options
- `isConverting`: batch conversion state
- `toasts`: notification list

No external state management library is used.

## 12. Accessibility

The interface includes:

- Semantic landmarks
- Keyboard-accessible buttons
- Focus rings
- ARIA labels where needed
- Screen-reader-friendly notification region
- High contrast dark interface
- Touch-friendly control sizes

## 13. Performance

Implemented performance practices:

- Browser-native Canvas rendering
- `createImageBitmap` when available
- Object URL cleanup
- `ImageBitmap.close`
- Memoized preview cards
- `useMemo` and `useCallback` for derived UI and handlers
- Lazy image loading
- Sequential batch conversion to avoid memory spikes
- Canvas memory release after conversion

## 14. PWA

The app includes:

- `public/manifest.webmanifest`
- `public/sw.js`
- Theme color
- SVG icon
- Offline app shell cache

The service worker is registered only in production mode.

## 15. SEO

SEO metadata is configured in `index.html`:

- Title
- Meta description
- Canonical URL
- Robots
- Open Graph tags
- Twitter card tags
- Theme color
- Favicon

## 16. Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build production assets:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 17. Deployment

Build output is generated in:

```text
dist/
```

Deploy `dist/` to any static host.

Recommended static hosting options:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- S3-compatible object storage

## 18. Browser Compatibility

The app depends on modern browser APIs:

- Canvas API
- `canvas.toBlob`
- `createImageBitmap`
- Object URLs
- Clipboard API for optional copy support
- File and DataTransfer APIs

Some optional features such as folder drag and image clipboard writing depend on browser support.

## 19. Known Limitations

- GIF conversion uses the first decoded frame only.
- TIFF depends on native browser decoding support.
- Clipboard image writing may be blocked by browser permissions or unsupported environments.
- Canvas export quality behavior can vary slightly by browser.

## 20. Quality Checklist

- TypeScript strict mode enabled.
- ESLint configured.
- Prettier configured.
- Production build verified.
- PWA files included.
- Static hosting compatible.
- Local-only image processing.
- Responsive layout implemented.

