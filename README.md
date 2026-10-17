# WebP Image Converter

A production-ready, privacy-first WebP image converter built with React, TypeScript, Vite, Tailwind CSS, Motion, Lucide React, and JSZip.

The app converts common image formats into WebP entirely inside the browser using the HTML5 Canvas API. Images are never uploaded to a server.

## Features

- Drag and drop image upload
- Click to browse files
- Multiple image upload
- Clipboard paste support
- Folder drag support where the browser supports it
- Local WebP conversion through Canvas
- Quality slider from 0 to 100
- Resize by custom width or height
- Maintain aspect ratio option
- Transparent, white, black, or custom background
- Image preview cards with dimensions, format, original size, converted size, reduction, and saved bytes
- Batch conversion
- Individual image download
- ZIP download for multiple converted files
- Copy converted WebP image to clipboard where supported
- Animated statistics
- Toast notifications
- Responsive desktop, tablet, and mobile layouts
- Installable PWA manifest and offline service worker
- SEO metadata and favicon

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- Lucide React
- JSZip

## Privacy

All processing happens locally in the browser:

- No backend
- No database
- No analytics
- No image upload
- No third-party image processing service

The app uses `createImageBitmap`, `HTMLImageElement`, `canvas.drawImage`, and `canvas.toBlob('image/webp')` for conversion.

## Supported Input Formats

- PNG
- JPG
- JPEG
- GIF, first frame only
- BMP
- TIFF, if supported by the browser
- WebP, for recompression

Output format is always WebP.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
├── components/
├── hooks/
├── lib/
├── pages/
├── styles/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## Main Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs TypeScript build checks and creates production output |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Serves the production build locally |
| `npm run format` | Formats the project with Prettier |

## Production Notes

The project is static-hosting compatible. Deploy the generated `dist/` folder to any static host such as Netlify, Vercel, Cloudflare Pages, GitHub Pages, or S3-compatible hosting.

The PWA service worker is registered only in production builds.

