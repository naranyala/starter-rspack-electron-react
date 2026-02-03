# Project Map

Complete reference of directory structure, key files, and their purposes.

## Root Files

| File | Type | Purpose |
|------|------|---------|
| `main.ts` | Source | Main process entry point |
| `main.cjs` | Generated | Runtime entry for electron-builder |
| `preload.ts` | Source | Preload bridge script |
| `preload.js` | Generated | Runtime preload |
| `package.json` | Config | Dependencies, scripts, build config |
| `tsconfig.json` | Config | TypeScript configuration |
| `rspack.config.ts` | Config | Rspack bundler configuration |
| `biome.json` | Config | Code formatting/linting |
| `.dev-port.json` | Generated | Dev server port storage |

## Source Directory Structure

```
src/
├── assets/                         # Static assets
│   ├── favicon.ico
│   ├── icon.ico
│   ├── icon.png
│   └── icon.svg
├── backend/                        # Electron main process
│   ├── lib/                       # Backend libraries
│   │   ├── config/               # Configuration
│   │   ├── filesystem/           # File operations
│   │   ├── ipc/                 # IPC utilities
│   │   ├── network/             # Network utilities
│   │   ├── security/            # Security helpers
│   │   ├── system/             # System info
│   │   ├── common/             # Shared types
│   │   └── index.ts
│   └── use-cases/               # Feature use-cases (IPC handlers)
│       ├── index.ts
│       ├── electron-architecture/
│       │   └── handler.ts
│       ├── electron-development/
│       │   └── handler.ts
│       ├── electron-intro/
│       │   └── handler.ts
│       ├── electron-native-apis/
│       │   └── handler.ts
│       ├── electron-packaging/
│       │   └── handler.ts
│       ├── electron-performance/
│       │   └── handler.ts
│       ├── electron-security/
│       │   └── handler.ts
│       └── electron-versions/
│           └── handler.ts
├── frontend/                      # Renderer process (React)
│   ├── components/               # React UI components
│   │   ├── index.ts
│   │   ├── ElectronDemoPreview.tsx
│   │   └── LeftSidebar.tsx
│   ├── lib/                     # Frontend libraries
│   │   ├── api/                # API client
│   │   ├── common/             # Shared types
│   │   ├── helpers/           # Utilities
│   │   ├── react-hooks/       # Custom hooks
│   │   ├── storage/           # Storage
│   │   ├── ui/                # UI helpers
│   │   ├── validation/        # Validation
│   │   ├── window-manager.ts   # Window tracking
│   │   └── index.ts
│   ├── styles/                 # Styling
│   │   └── goober.ts          # CSS-in-JS
│   ├── use-cases/             # Feature use-cases (windows)
│   │   ├── index.ts
│   │   ├── electron-architecture/
│   │   │   └── window.tsx
│   │   ├── electron-development/
│   │   │   └── window.tsx
│   │   ├── electron-intro/
│   │   │   └── window.tsx
│   │   ├── electron-native-apis/
│   │   │   └── window.tsx
│   │   ├── electron-packaging/
│   │   │   └── window.tsx
│   │   ├── electron-performance/
│   │   │   └── window.tsx
│   │   ├── electron-security/
│   │   │   └── window.tsx
│   │   └── electron-versions/
│   │       └── window.tsx
│   └── utils/                  # Frontend utilities
│       └── winbox-utils.ts     # WinBox creation
├── shared/                      # Shared between processes
│   ├── api.ts
│   ├── menu-data.ts
│   ├── react-utils.tsx
│   ├── utils.ts
│   └── window-generator.ts
├── types/                       # TypeScript declarations
│   └── winbox.d.ts
├── App.css
├── App.tsx                      # Root React component
├── global.d.ts
├── index.css
├── index.html
├── index.tsx                    # React entry
├── logo.svg
└── reset.css
```

## Architecture Summary

```
src/
├── backend/                    # Electron Main Process (Node.js)
│   ├── lib/                   # Shared utilities
│   └── use-cases/            # Feature handlers (IPC)
├── frontend/                  # Electron Renderer (Browser)
│   ├── components/           # UI components
│   ├── lib/                  # Shared utilities
│   ├── styles/              # CSS-in-JS
│   ├── use-cases/           # Feature windows
│   └── utils/                # Utilities
├── shared/                   # Cross-process shared code
└── types/                   # TypeScript declarations
```

## Path Aliases

```json
{
  "@/*": ["src/*"],
  "@/backend/*": ["src/backend/*"],
  "@/frontend/*": ["src/frontend/*"]
}
```

## Key Files Reference

| Path | Purpose |
|------|---------|
| `main.ts` | App lifecycle, BrowserWindow creation |
| `preload.ts` | Secure IPC bridge |
| `src/index.tsx` | React entry point |
| `src/App.tsx` | Main shell with sidebar/cards |
| `src/backend/use-cases/*/handler.ts` | IPC handlers |
| `src/frontend/use-cases/*/window.tsx` | WinBox windows |
| `src/frontend/lib/window-manager.ts` | Window state |
| `src/shared/menu-data.ts` | Feature definitions |

## Build Output

```
dist/                     # Production bundles
├── index.html
├── [name].[hash].js
├── [name].[hash].css
└── assets/

dist-ts/                  # TypeScript compilation
├── main.js
├── preload.js
└── src/backend/use-cases/*/handler.js
```

## Common Tasks

| Task | Location |
|------|----------|
| Add IPC handler | `src/backend/use-cases/<feature>/handler.ts` |
| Add window | `src/frontend/use-cases/<feature>/window.tsx` |
| Add UI component | `src/frontend/components/<name>.tsx` |
| Add utility | `src/backend/lib/<category>/` or `src/frontend/lib/<category>/` |
| Configure bundling | `rspack.config.ts` |
| Configure packaging | `package.json` (build section) |
