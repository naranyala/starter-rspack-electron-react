# RSPack Electron React Starter

Enterprise-grade Electron + React boilerplate with RSPack bundler for superior performance and developer experience.

## Key Features

- **High-Performance Bundling**: RSPack powered (Rust-based) for lightning-fast builds
- **Modern Tech Stack**: React 19+, TypeScript, Bun runtime
- **Developer Experience**: Hot module replacement and instant feedback
- **Cross-Platform**: Single codebase for Windows, macOS, and Linux
- **Production Ready**: Built-in packaging and distribution pipeline
- **Modular Architecture**: Clean separation of concerns with use-cases pattern

## Quick Start

Install dependencies:
```bash
bun install
```

Launch development environment:
```bash
bun run dev
```

Build for production:
```bash
bun run build
```

Package for distribution:
```bash
bun run dist
```

## Technology Stack

- **Electron**: Cross-platform desktop applications
- **React 19+**: Component-based UI development
- **RSPack**: High-performance Rust-based bundler
- **TypeScript**: Type-safe development
- **Bun**: Fast JavaScript runtime and package manager
- **electron-builder**: Professional application packaging

## Architecture Overview

The starter implements a modular architecture with:
- Frontend use-cases in `src/renderer/use-cases`
- Backend use-cases in `main/use-cases`
- Clean separation between main and renderer processes
- WinBox.js window management system
- Fuzzy search functionality

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `bun run dev` | Development server with HMR |
| `bun run build` | Production build |
| `bun run start` | Production launch |
| `bun run dist` | Package for distribution |

## Why This Starter?

This boilerplate eliminates setup overhead with preconfigured tooling, optimal performance settings, and proven architecture patterns. Perfect for MVPs, enterprise applications, or any cross-platform desktop solution requiring modern web technologies.

## Requirements

- Bun v1.0+
- Node.js v18+ (fallback for certain Electron operations)

## License

MIT License - see LICENSE file for details.