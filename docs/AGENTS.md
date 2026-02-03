# Agent Onboarding Guide

This document provides essential information for AI agents working with this Electron + Rspack + React project. Read this first before making any changes.

## Project Overview

**Rspack Electron React Starter** is a Electron application modern, production-ready template featuring:

| Technology | Version | Purpose |
|------------|---------|---------|
| Electron | 40.x | Cross-platform desktop runtime |
| React | 19.x | UI component library |
| Rspack | 1.x | High-performance bundler |
| TypeScript | 5.x | Type-safe JavaScript |
| WinBox | 0.2.x | Multi-window UI manager |
| Goober | 2.x | CSS-in-JS styling |
| Bun | Latest | Package manager and scripts |
| electron-builder | 26.x | Application packaging |

## Core Philosophy

This starter follows these design principles:

1. **Security-First Architecture** - Context isolation, no node integration in renderer, validated IPC
2. **Type Safety** - TypeScript across main, preload, renderer, and build scripts
3. **Modern Bundling** - Rspack for 10x faster builds vs webpack
4. **Clean Separation** - Main process, preload bridge, and renderer process have clear boundaries
5. **Extensible Patterns** - Feature modules, IPC handlers, and window creators are pluggable

## Key Constraints

### Security Requirements (NON-NEGOTIABLE)

```
┌─────────────────────────────────────────────────────────────────┐
│  SECURITY VIOLATIONS WILL NOT BE ACCEPTED                      │
├─────────────────────────────────────────────────────────────────┤
│  1. contextIsolation MUST remain true                          │
│  2. nodeIntegration MUST remain false in renderer              │
│  3. ALL IPC input MUST be validated before use                 │
│  4. ALL user content MUST be sanitized before rendering        │
│  5. NO Node.js APIs accessible from renderer without IPC       │
│  6. preload bridge MUST use contextBridge, NOT node globals    │
└─────────────────────────────────────────────────────────────────┘
```

**Violations will be rejected regardless of user request.**

### Code Style Rules

1. **NO comments unless explicitly requested** - Code must be self-documenting
2. **TypeScript STRICT mode** - No `any` types, full type inference required
3. **Follow existing patterns** - Match surrounding code style
4. **NO external CDN links** - All dependencies via npm/bun
5. **Prefer named exports** - Cleaner refactoring, tree shaking
6. **React class components** - This project uses class components, not hooks

### File Management Rules

| Source File | Generated File | Keep Synchronized |
|-------------|---------------|-------------------|
| `main.ts` | `main.cjs`, `main.js` | YES |
| `preload.ts` | `preload.js` | YES |
| `scripts/*.ts` | `scripts/*.js` | YES |
| `src/main/handlers/*.ts` | `src/main/handlers/*.js` | YES |

**Never edit generated files directly. Edit sources and rebuild.**

### Git Workflow

1. **Never commit without explicit user request**
2. **Never use git commands with -i flag** (interactive mode not supported)
3. **Never force push** unless user explicitly requests
4. **Never amend pushed commits**
5. **Always check git status** before any git operation

## Development Workflow

### First-Time Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

The dev workflow:
1. Rspack dev server starts on port from `.dev-port.json`
2. Electron launches loading the dev server URL
3. HMR enabled - changes hot-reload without restart
4. Window state preserved across reloads

### Build Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server + Electron |
| `bun run build` | Production Rspack build |
| `bun run tsc` | TypeScript compilation |
| `bun run dist` | Package with electron-builder |
| `bun run clean` | Remove build artifacts |

### Port Management

Dev server port is managed automatically:
- Environment: `DEV_SERVER_PORT`
- Fallback: `.dev-port.json` (auto-generated)
- Default: 3000

Both `main.ts` and `rspack.config.ts` read from the same source.

## Common Tasks Reference

### Adding a New Feature Window

Complete 4-step process:

**Step 1:** Create window creator
```typescript
// src/renderer/features/my-feature-window.tsx
import { createWinBoxWindow } from '../utils/winbox-utils';

export const createMyFeatureWindow = async ({ title }: { title: string }) => {
  return await createWinBoxWindow({
    title,
    content: `<p>My feature content here</p>`,
    maximize: true,
  });
};
```

**Step 2:** Add menu item
```typescript
// src/shared/menu-data.ts
{
  id: 'my-feature',
  title: 'My Feature',
  content: '<p>Description...</p>',
  category: 'category-name',
  tags: ['tag1', 'tag2'],
}
```

**Step 3:** (Optional) Add IPC handler
```typescript
// src/main/handlers/my-feature-handler.ts
import { ipcMain } from 'electron';

export const registerMyFeatureHandlers = (): void => {
  ipcMain.handle('get-my-feature-data', async () => {
    return { /* data */ };
  });
};
```

**Step 4:** Wire in App.tsx
```typescript
// src/App.tsx
import { createMyFeatureWindow } from './renderer/features';

const windowCreators: { [key: string]: any } = {
  'My Feature': createMyFeatureWindow,
};
```

### Adding IPC Handler

**Step 1:** Create handler in `src/main/handlers/<name>-handler.ts`
```typescript
import { ipcMain } from 'electron';

export const register<Name>Handlers = (): void => {
  ipcMain.handle('channel-name', async (event, params) => {
    // Validate params
    // Execute main-process logic
    return result;
  });
};
```

**Step 2:** Register in `src/main/handlers/index.ts`
```typescript
export * from './<name>-handler';
// Call register<Name>Handlers() in main.ts
```

**Step 3:** Expose via preload
```typescript
// preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  myMethod: (params) => ipcRenderer.invoke('channel-name', params),
});
```

**Step 4:** Call from renderer
```typescript
// In React component
const result = await window.electronAPI.myMethod(params);
```

### Modifying Rspack Config

Edit `rspack.config.ts` for:
- Dev server: `devServer` section
- Plugins: `plugins` array
- Loaders: `module.rules`
- Optimization: `optimization` section
- Output: `output` section

### Adding New Dependencies

```bash
# Add runtime dependency
bun add <package>

# Add dev dependency
bun add -D <package>

# Update package.json manually for electron-builder deps
```

## Directory Quick Reference

```
📁 src/
├── 📁 main/              # Main process (Node.js)
│   ├── 📁 handlers/      # IPC handlers
│   └── 📁 lib/          # Main process libraries
├── 📁 renderer/          # Renderer process (Browser)
│   ├── 📁 components/   # React components
│   ├── 📁 features/     # WinBox window creators
│   ├── 📁 lib/          # Renderer libraries
│   └── 📁 utils/        # Renderer utilities
├── 📁 shared/           # Shared between processes
└── 📁 types/            # TypeScript declarations

📁 scripts/              # Build scripts (TypeScript)
📁 docs/                 # Documentation
📁 dist/                 # Build output
└── 📁 dist-ts/          # TypeScript output
```

## Communication Protocol

### IPC Patterns

**Request-Response (async):**
```
Renderer: window.electronAPI.method(params)
    │
    │ ipcRenderer.invoke('channel')
    ▼
Preload: ipcRenderer.invoke('channel')
    │
    │ ipcMain.handle('channel')
    ▼
Main: handler(event, params) → result
    │
    │ resolve(result)
    ▼
Renderer: receives result
```

**Push Notifications:**
```
Main: webContents.send('channel', data)
    │
    │ ipcRenderer.on('channel')
    ▼
Renderer: callback(data)
```

### API Surface (preload.ts)

Current exposed APIs:
- `getVersions()` - Get Electron/Node versions
- `openDialog(options)` - Native file dialogs
- Methods from handlers

**To add new API:**
1. Add method to preload.ts via contextBridge
2. Register handler in main process
3. Call from renderer using `window.electronAPI.methodName()`

## Error Handling Standards

### IPC Handlers
```typescript
ipcMain.handle('channel', async (event, params) => {
  try {
    validate(params);
    const result = await mainProcessOperation(params);
    return result;
  } catch (error) {
    console.error('Channel error:', error);
    throw error; // Will reject the promise
  }
});
```

### React Components
```typescript
// Class component error handling
async handleAction(params) {
  try {
    const result = await window.electronAPI.method(params);
    this.setState({ result });
  } catch (error) {
    console.error('Action failed:', error);
    // Optionally show user notification
  }
}
```

## Performance Guidelines

### IPC Optimization
- Batch multiple requests when possible
- Use structured cloning for large data
- Avoid frequent small IPC calls

### Rendering Optimization
- WinBox windows are created on-demand
- Search input is debounced
- Large lists should consider virtualization

### Build Optimization
- Rspack handles minification automatically
- Code splitting by entry point
- Tree shaking removes unused code

## Testing Strategy

Currently this project uses **manual testing**:
1. Run `bun run dev`
2. Test feature windows open/close
3. Verify IPC calls work
4. Check console for errors

**Before committing:**
1. Build passes: `bun run build`
2. TypeScript compiles: `bun run tsc`
3. No new lint errors

## Common Pitfalls

### 1. Forgetting to Rebuild
**Problem:** Changes to `.ts` files not reflected
**Solution:** Run `bun run tsc` then `bun run postbuild`

### 2. Wrong Preload
**Problem:** Using `src/main/preload.ts` instead of root `preload.ts`
**Solution:** Root `preload.ts` is the runtime one

### 3. Missing .js counterparts
**Problem:** Handlers missing `.js` files
**Solution:** Build generates them via `postbuild`

### 4. Context Isolation Disabled
**Problem:** Security vulnerability
**Solution:** NEVER disable contextIsolation

## Getting Help

1. **Architecture** - See `docs/ARCHITECTURE.md`
2. **File Locations** - See `docs/PROJECT_MAP.md`
3. **Development** - See `docs/DEVELOPMENT.md`
4. **Building** - See `docs/BUILD_AND_RELEASE.md`
5. **Code** - Read similar existing implementations

## Quick Checklist Before Submitting Changes

- [ ] TypeScript compiles without errors
- [ ] Build completes successfully
- [ ] Security settings unchanged
- [ ] Source/generated files synchronized
- [ ] No comments added (unless requested)
- [ ] Pattern follows existing code
- [ ] Git status checked
