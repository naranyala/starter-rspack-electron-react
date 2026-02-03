# Architecture

This app follows the standard Electron multi-process architecture with a React renderer and an explicit preload bridge.

## Process Layout

- Main process: `main.ts` creates the BrowserWindow and registers IPC handlers.
- Preload bridge: `preload.ts` exposes a limited `electronAPI` on `window`.
- Renderer: `src/index.tsx` and `src/App.tsx` render the UI and open WinBox windows.

## Main Process Responsibilities

- App lifecycle via `app.whenReady()` and `app.on('window-all-closed')`.
- Window creation with secure defaults (`contextIsolation: true`, `nodeIntegration: false`).
- IPC registration via `src/main/handlers/*`.

## Preload Bridge

- `preload.ts` is the runtime preload script referenced by `main.ts`.
- It currently exposes a minimal `electronAPI` surface; extend this file for additional IPC methods.

## Renderer Architecture

- `src/App.tsx` renders the shell, search, tabs, and feature cards.
- `src/shared/menu-data.ts` defines the card data and categories.
- `src/renderer/features/*` defines one window creator per feature.
- `src/renderer/utils/winbox-utils.ts` standardizes WinBox creation, sizing, and theme.
- `src/renderer/lib/window-manager.ts` tracks open windows, focus state, and minimize/restore logic.

## IPC Usage

- Handlers use `ipcMain.handle(channel, handler)` in `src/main/handlers/*`.
- The preload can expose `ipcRenderer.invoke` calls for those channels.
- Renderer code can call the preload API to request data.

## Data Flow At A Glance

- User clicks a card in `src/App.tsx`.
- A window creator in `src/renderer/features/*` is invoked.
- The WinBox window renders HTML content and registers with `windowManager`.
- Optional IPC calls can be added to fetch data from handlers.
