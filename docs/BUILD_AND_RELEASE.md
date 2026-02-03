# Build and Release

This project builds the renderer with Rspack and packages the app with electron-builder.

## Build Pipeline

- `bun run build` runs `scripts/build.js`.
- The build script runs `npx @rspack/cli build` to produce `dist/index.html` and assets.
- It copies assets from `src/assets/` to `dist/`.
- It copies `main.cjs` into `dist/` and generates a minimal `dist/package.json` with production deps.

## TypeScript Compilation

- `bun run tsc` outputs compiled JS to `dist-ts/`.
- `postbuild` copies `dist-ts/main.js` to `main.cjs` and `dist-ts/preload.js` to `preload.js`.
- `postbuild` also copies `dist-ts/src/main/handlers` into `src/main/handlers`.

## Packaging

- `bun run dist` runs `scripts/package.js`, which calls `ts-node` on `scripts/build.ts` and then electron-builder.
- electron-builder config lives in `package.json` under `build`.
- Targets include:
- Windows `msi` with `dist/icon.ico`.
- Linux `AppImage` and `deb` with `dist/icon.ico`.
- macOS DMG layout is configured under `build.dmg`.

## Output

- Build output: `dist/`.
- Packaged artifacts: `dist/` (electron-builder writes into `dist/` by default).
