# Rspack Electron React Starter

A modern, Bun-first Electron starter with a React renderer, Rspack bundling, and a multi-window WinBox UI. It ships with a clean main/renderer split, IPC-ready handlers, and a fast dev workflow that is easy to extend into a real product.

## Highlights

- Rspack dev server and production bundling with `rspack.config.ts`.
- Electron main process with secure defaults (`contextIsolation: true`, `nodeIntegration: false`).
- WinBox-powered multi-window UI with a sidebar, search, and window manager.
- Demo feature cards and content generators to jump-start UI and IPC flows.
- TypeScript across main, preload, renderer, and tooling.
- Bun-first scripts for dev, build, and packaging.

## What You Get Out Of The Box

- A sidebar-driven UI with searchable feature cards.
- A WinBox window manager that tracks open windows, focus, minimize, and restore.
- A feature module pattern in `src/renderer/features/` for creating new windows.
- IPC handler modules in `src/main/handlers/` with demo data and channel structure.
- A port-managed dev server that writes `.dev-port.json` for consistent startup.
- A packaging config for Windows and Linux targets via electron-builder.

## Tech Stack

- Electron 40
- React 19
- Rspack 1.x
- TypeScript 5.x
- WinBox
- Goober (CSS-in-JS)
- electron-builder

## Quick Start

```bash
bun install
bun run dev
```

## Packaging Targets

- Windows `msi` with `dist/icon.ico`.
- Linux `AppImage` and `deb` with `dist/icon.ico`.
- macOS DMG layout configured under `build.dmg` in `package.json`.

## Core Scripts

- `bun run dev` start the dev server and Electron (uses `scripts/dev-runner.js`).
- `bun run build` build renderer assets and copy runtime artifacts.
- `bun run dist` package the app with electron-builder.
- `bun run tsc` compile TypeScript to `dist-ts/`.
- `bun run clean` remove build outputs.
- `bun run icons` generate or copy icons.
- `bun run install:electron` attempt a local Electron install.

## Architecture Overview

```
.
├── main.ts                      # Main process entry (source)
├── preload.ts                   # Preload entry used at runtime (source)
├── src/
│   ├── App.tsx                  # App shell and feature cards
│   ├── index.tsx                # React entry
│   ├── renderer/
│   │   ├── components/          # Sidebar and UI widgets
│   │   ├── features/            # WinBox window creators
│   │   ├── lib/                 # Frontend helpers and window manager
│   │   └── utils/               # WinBox utilities
│   ├── main/
│   │   ├── handlers/            # IPC handlers
│   │   └── lib/                 # Main-process helpers
│   └── shared/                  # Shared menu data and helpers
├── scripts/                     # Build/dev scripts (.ts + compiled .js)
├── rspack.config.ts             # Renderer bundler config
└── package.json                 # Scripts, deps, electron-builder config
```

## Documentation

- `docs/AGENTS.md` agent onboarding and safe editing notes.
- `docs/PROJECT_MAP.md` directory map and key file pointers.
- `docs/ARCHITECTURE.md` process layout and data flow.
- `docs/DEVELOPMENT.md` dev workflow and script behavior.
- `docs/BUILD_AND_RELEASE.md` build pipeline and packaging notes.

## Notes

- `main.cjs`, `preload.js`, and `scripts/*.js` are runtime artifacts. Keep them in sync with their TypeScript sources.
- `bun run start` is defined in `package.json`, but `scripts/start.js` is not present in this repo.
- There are two preload sources. Runtime uses `preload.ts` in the repo root.

## Extending The App

1. Add a new card in `src/shared/menu-data.ts`.
2. Create a new window creator in `src/renderer/features/`.
3. Wire the window creator in `src/App.tsx`.
4. If you need main-process data, add a handler in `src/main/handlers/` and expose it via `preload.ts`.

## License

MIT. See `LICENSE`.
