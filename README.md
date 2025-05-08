# Extract Text From PDF

A simple React + TypeScript + Vite application demonstrating how to extract text from PDF files directly in the browser using pdfjs-dist.

## Features

- Upload a PDF file via a file input
- Read the file as an ArrayBuffer
- Extract text content from all pages using `pdfjs-dist`
- Display extracted text in a scrollable area

## Project Structure

- `src/util/extract.ts` — Utility functions: `readFileAsArrayBuffer` and `extractTextFromPdf`
- `src/App.tsx` — Main React component for file upload and text display
- `public/` — Static assets
- `vite.config.ts` — Vite configuration with React support

## Getting Started

### Prerequisites

- Node.js >= 14
- pnpm or npm

## Installation

```bash
# Install dependencies
pnpm install
# or
npm install
```

## Development

```bash
pnpm dev
```

Visit `http://localhost:5173` in your browser.

## Build for Production

```bash
pnpm build
pnpm preview
```

I just want to test this project in production before using the code for real production code.
