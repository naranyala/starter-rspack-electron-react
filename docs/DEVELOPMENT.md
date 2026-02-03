# Development Workflow

This project uses Bun for scripts and Electron + Rspack for runtime and bundling.

## Prerequisites

- Bun
- Node.js (required by Electron)
- Git

## Common Commands

- `bun install` install dependencies.
- `bun run dev` start dev server and Electron via `scripts/dev-runner.js`.
- `bun run build` run Rspack production build and copy main/preload artifacts.
- `bun run start` is defined in `package.json` but the referenced `scripts/start.js` is not present in this repo.
- `bun run dist` package the app with electron-builder.

## Dev Runner Behavior

- `scripts/dev-runner.js` starts the Rspack dev server with `npx @rspack/cli serve`.
- It writes `.dev-port.json` and sets `DEV_SERVER_PORT`.
- The main process reads the dev port from `DEV_SERVER_PORT` or `.dev-port.json`.

## Alternative Dev Scripts

- `scripts/start-dev.ts` and `scripts/start-dev-rspack.ts` are legacy or experimental launchers.
- The primary dev entry is `bun run dev` unless you have a reason to use the others.

## Debugging Tips

- Use Electron DevTools (toggle in `main.ts` if you want it to open by default).
- Renderer logging appears in the DevTools console.
- Main process logging appears in the terminal running Electron.

## TypeScript Outputs

- `tsc` writes to `dist-ts/`.
- The `postbuild` step copies `dist-ts/main.js` to `main.cjs` and `dist-ts/preload.js` to `preload.js`.
- Update generated JS when you change `main.ts`, `preload.ts`, or `scripts/*.ts`.
