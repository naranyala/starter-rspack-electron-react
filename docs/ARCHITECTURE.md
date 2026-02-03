# Architecture Documentation

In-depth explanation of the Electron process model, security architecture, IPC patterns, and data flow.

## Process Architecture

### Electron Process Model

Electron runs two distinct process types working together:

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Main Process                               │
│  • Node.js runtime full access                                      │
│  • Controls application lifecycle                                    │
│  • Creates and manages BrowserWindows                               │
│  • Handles native OS operations                                      │
│  • Runs in single instance                                          │
├─────────────────────────────────────────────────────────────────────┤
│                              │                                       │
│                    IPC (Inter-Process Communication)                 │
│                              │                                       │
├─────────────────────────────────────────────────────────────────────┤
│                          Renderer 1                                 │
│  • Chromium rendering engine                                        │
│  • React UI rendering                                               │
│  • No direct Node.js access                                         │
│  • Each window is separate renderer process                        │
├─────────────────────────────────────────────────────────────────────┤
│                          Renderer N                                 │
│  • Independent renderer processes                                   │
│  • Isolated from each other                                        │
│  • Communicate via main process                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Main Process Responsibilities

| Responsibility | Implementation |
|---------------|----------------|
| App lifecycle | `app.whenReady()`, `app.on('window-all-closed')` |
| Window creation | `new BrowserWindow()` in `main.ts` |
| IPC registration | `ipcMain.handle()` in `src/main/handlers/` |
| Native menus | `new Menu()` and `Menu.setApplicationMenu()` |
| Dialogs | `dialog.showOpenDialog()`, `dialog.showMessageBox()` |
| File operations | `fs` module via handlers |
| Network | `net`, `https` modules |
| Notifications | `new Notification()` |

### Renderer Process Responsibilities

| Responsibility | Implementation |
|---------------|----------------|
| React rendering | `src/index.tsx` → `src/App.tsx` |
| UI components | `src/renderer/components/` |
| Window management | WinBox via `src/renderer/utils/winbox-utils.ts` |
| IPC calls | `ipcRenderer.invoke()` through preload |
| State management | React component state + window manager |
| Event handling | React event system |

## Security Architecture

### Context Isolation Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Main Process                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Node.js Runtime                                             │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  IPC Handlers (ipcMain.handle)                      │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
│                         ▲                                            │
│                         │ IPC Channel                               │
│                         ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Preload Script (isolated context)                         │    │
│  │  contextBridge.exposeInMainWorld('electronAPI', {...})    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
│                         ▲                                            │
│                         │ Safe API (no Node access)                 │
│                         ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Renderer Process (Chromium sandbox)                        │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  React Application (window.electronAPI.method())   │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Security Configuration

```typescript
// main.ts - BrowserWindow configuration
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    // SECURITY: Prevents renderer from accessing Node.js
    nodeIntegration: false,
    // SECURITY: Isolates preload from renderer
    contextIsolation: true,
    // SECURITY: Enables Chromium sandbox
    sandbox: true,
    // Preload script path
    preload: path.join(__dirname, 'preload.js'),
    // Enable web security (same-origin policy)
    webSecurity: true,
  },
});
```

### Preload Bridge Implementation

```typescript
// preload.ts - Secure API exposure
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Read operations
  getVersions: () => ipcRenderer.invoke('get-versions'),
  
  // Dialog operations
  openDialog: (options: DialogOptions) => 
    ipcRenderer.invoke('open-dialog', options),
  
  // Event subscriptions
  onNotification: (callback: (data: NotificationData) => void) => {
    ipcRenderer.on('notification', (_, data) => callback(data));
    return () => ipcRenderer.removeListener('notification', callback);
  },
  
  // Cleanup
  removeAllListeners: () => ipcRenderer.removeAllListeners(),
});
```

### Security Best Practices Enforced

| Practice | Implementation |
|----------|---------------|
| No nodeIntegration | Renderer cannot require Node modules |
| Context isolation | preload and renderer have separate contexts |
| Input validation | All IPC handlers validate parameters |
| Content sanitization | HTML content sanitized before rendering |
| CSP headers | Configured in build/dev server |
| Secure dialogs | Native dialogs via IPC only |

## IPC Communication Patterns

### Pattern 1: Request-Response (Async)

Used for queries and actions that return results:

```
Renderer                                    Main
   │                                          │
   │── window.electronAPI.getData(id) ──────>│
   │                                          │
   │                                          │─> Validate input
   │                                          │─> Access file system
   │                                          │─> Process data
   │                                          │
   │<── { data: {...} } ─────────────────────│
   │   or
   │<── throw new Error() ───────────────────│
```

**Implementation:**

```typescript
// Main process handler
ipcMain.handle('get-data', async (event, id: string) => {
  // Validate
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID');
  }
  
  // Process
  const data = await fetchData(id);
  return data;
});

// Renderer call
const data = await window.electronAPI.getData('item-123');
```

### Pattern 2: Push Notifications

Used for events from main process to renderer:

```
Renderer                                    Main
   │                                          │
   │── ipcRenderer.on('event', cb) ──────────>│ Register
   │                                          │
   │                              ┌───────────┘
   │                              │
   │<─── webContents.send('event', data) ───│ Push
   │                                          │
   │── callback(data) ──────────────────────>│
   │                                          │
   │── ipcRenderer.removeListener(...) ─────>│ Cleanup
```

**Implementation:**

```typescript
// Main process - send from anywhere
import { webContents } from 'electron';

const sendNotification = (data: NotificationData) => {
  webContents.getAllWindows().forEach(win => {
    win.webContents.send('notification', data);
  });
};

// Renderer process - subscribe
const cleanup = window.electronAPI.onNotification((data) => {
  console.log('Received:', data);
});

// Cleanup when done
cleanup();
```

### Pattern 3: File Operations

Large data transfers using structured cloning:

```
Renderer                                    Main
   │                                          │
   │── ipcRenderer.invoke('read-file', ...) ─>│
   │                                          │
   │                                          │─> fs.readFile
   │                                          │
   │<── ArrayBuffer ──────────────────────────│
```

## Window Management Architecture

### WinBox Integration

WinBox provides window management within the main BrowserWindow:

```
┌─────────────────────────────────────────────────────────────────┐
│  Main BrowserWindow (1920x1080 example)                         │
│  ┌─────────────┬─────────────────────────────────────────────┐ │
│  │             │                                             │ │
│  │  Sidebar   │     WinBox Container Area                   │ │
│  │  (220px)   │     ┌─────────────────────────────────┐     │ │
│  │             │     │  WinBox Window                  │     │ │
│  │  • Home    │     │  ┌───────────────────────────┐  │     │ │
│  │  • Search  │     │  │  Window Header (drag)    │  │     │ │
│  │  • Help    │     │  ├───────────────────────────┤  │     │ │
│  │             │     │  │                         │  │     │ │
│  │             │     │  │    Window Content        │  │     │ │
│  │             │     │  │                         │  │     │ │
│  │             │     │  └───────────────────────────┘  │     │ │
│  │             │     └─────────────────────────────────┘     │ │
│  │             │                                             │ │
│  └─────────────┴─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Window Creator Pattern

```typescript
// src/renderer/features/feature-window.tsx
import { createWinBoxWindow } from '../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createFeatureWindow = async ({ 
  title, 
  content 
}: WindowOptions) => {
  return await createWinBoxWindow({
    title,
    content: `
      <h3>${title}</h3>
      <p>${content || 'Description here'}</p>
    `,
    maximize: true,  // Respects sidebar width
  });
};
```

### Window Manager

The window manager tracks all open windows:

```typescript
// src/renderer/lib/window-manager.ts
interface WindowEntry {
  id: string;
  title: string;
  instance: WinBox;
  state: 'open' | 'minimized' | 'closed';
}

class WindowManager {
  private windows: Map<string, WindowEntry> = new Map();
  
  register(id: string, title: string, instance: WinBox): void {
    this.windows.set(id, { id, title, instance, state: 'open' });
  }
  
  unregister(id: string): void {
    this.windows.delete(id);
  }
  
  getAll(): WindowEntry[] {
    return Array.from(this.windows.values());
  }
  
  minimizeAll(): void {
    this.windows.forEach(win => win.instance.minimize());
  }
}

export const windowManager = new WindowManager();
```

## Data Flow Diagrams

### Feature Card → Window Flow

```
1. User clicks card in App.tsx
   │
   ▼
2. App.handleCardClick(card) called
   │
   ▼
3. windowCreators[card.title]({ title, content })
   │
   ▼
4. Feature window creator invoked
   │
   ▼
5. createWinBoxWindow({ title, content, maximize: true })
   │
   ├── Calculate position (respect sidebar)
   ├── Apply dark theme
   ├── Set HTML content
   ├── Register with windowManager
   └── Return WinBox instance
```

### IPC Data Flow

```
User Action
    │
    ▼
React Component
    │
    ▼
window.electronAPI.method(params)
    │
    ▼
Preload Bridge (contextBridge)
    │
    ▼
ipcRenderer.invoke('channel', params)
    │
    ▼
IPC Main Handler (ipcMain.handle)
    │
    ├── Validate params
    ├── Execute main-process logic
    ├── Return result or throw
    │
    ▼
Renderer Promise resolves/rejects
    │
    ▼
React Component updates state
```

## Component Hierarchy

```
App (Root Component)
│
├── LeftSidebar
│   ├── Logo
│   └── Nav Items (from menu categories)
│
├── Header
│   ├── Sidebar Toggle
│   ├── Title
│   └── Subtitle
│
├── SearchContainer
│   └── SearchInput (debounced)
│
├── TabFilter
│   └── TabButton[] (All, Framework, Architecture, etc.)
│
├── CardsList
│   └── Card[] (filtered by search + tab)
│       ├── CardTitle
│       ├── CardTag
│       └── CardArrow
│
└── Footer
    └── Edit This File Link
```

## State Management

### Application State (App.tsx)

```typescript
interface AppState {
  searchTerm: string;      // Fuzzy search input
  activeTab: string;       // Category filter ('all', 'framework', etc.)
  sidebarOpen: boolean;   // Sidebar visibility
}
```

### Menu Configuration (menu-data.ts)

```typescript
interface MenuItem {
  id: string;              // Unique identifier
  title: string;           // Display title
  content: string;         // HTML content for window
  category: string;        // For tab filtering
  tags: string[];         // For fuzzy search
}

const menuData: MenuItem[] = [
  {
    id: 'electron-intro',
    title: 'What is Electron?',
    content: '<p>Electron description...</p>',
    category: 'framework',
    tags: ['electron', 'desktop', 'cross-platform'],
  },
  // ... more items
];
```

### Window State (window-manager.ts)

```typescript
interface WindowRegistry {
  [windowId: string]: {
    title: string;
    instance: WinBox;
    state: 'open' | 'minimized' | 'closed';
  };
}
```

## Bundling Architecture

### Development Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  Development Mode                                               │
│                                                                 │
│  bun run dev                                                    │
│       │                                                        │
│       ▼                                                        │
│  ┌─────────────────────────┐                                    │
│  │  Rspack Dev Server      │                                    │
│  │  • Hot Module Reload    │                                    │
│  │  • Source maps          │                                    │
│  │  • localhost:3000       │                                    │
│  └─────────────────────────┘                                    │
│       │                                                        │
│       │  WebSocket HMR                                         │
│       ▼                                                        │
│  ┌─────────────────────────┐                                    │
│  │  Electron BrowserWindow│                                    │
│  │  (file:// with HMR)    │                                    │
│  └─────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Production Build

```
┌─────────────────────────────────────────────────────────────────┐
│  Production Build                                               │
│                                                                 │
│  bun run build                                                  │
│       │                                                        │
│       ├──┐                                                     │
│       │  ▼                                                     │
│       │  ┌─────────────────────────┐                           │
│       │  │  Rspack Build          │                           │
│       │  │  • Minification        │                           │
│       │  │  • Code splitting      │                           │
│       │  │  • Tree shaking        │                           │
│       │  │  • Output: dist/       │                           │
│       │  └─────────────────────────┘                           │
│       │                                                        │
│       ├──┐                                                     │
│       │  ▼                                                     │
│       │  ┌─────────────────────────┐                           │
│       │  │  TypeScript Compile   │                           │
│       │  │  • Output: dist-ts/   │                           │
│       │  └─────────────────────────┘                           │
│       │                                                        │
│       ├──┐                                                     │
│       │  ▼                                                     │
│       │  ┌─────────────────────────┐                           │
│       │  │  Artifact Copy         │                           │
│       │  │  • main.ts → main.cjs  │                           │
│       │  │  • preload.ts → preload.js                        │
│       │  │  • handlers/*.ts → handlers/*.js                   │
│       │  └─────────────────────────┘                           │
│       │                                                        │
│       ▼                                                        │
│  ┌─────────────────────────┐                                    │
│  │  Ready for Packaging   │                                    │
│  │  • main.cjs            │                                    │
│  │  • dist/ folder        │                                    │
│  │  • package.json        │                                    │
│  └─────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Rspack Configuration

```typescript
// rspack.config.ts - Key configurations
export default (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: { main: './src/index.tsx' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    },
    target: isProduction ? 'electron-renderer' : 'web',
    devServer: {
      port: getDevPort(),
      hot: true,
    },
    plugins: [
      new HtmlRspackPlugin({ template: './src/index.html' }),
      ...(isProduction ? [new MiniCssExtractPlugin()] : []),
    ],
  };
};
```

## Module Resolution

### Path Aliases

```typescript
// rspack.config.ts - Module resolution
resolve: {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
}
```

### Usage

```typescript
// Instead of relative paths
import { something } from '@/renderer/lib/api';

// Can use
import { something } from '../../renderer/lib/api';
```

## Styling Architecture

### Goober CSS-in-JS

```typescript
// src/renderer/styles/goober.ts
import { css } from 'goober';

// Define styles
export const card = css`
  background: #1a1a2e;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

// Use in components
const MyComponent = () => <div className={card}>Content</div>;
```

### Theme Variables

```css
:root {
  --sidebar-width: 220px;
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --border: #334155;
}
```

## Error Handling Architecture

### IPC Error Handling

```typescript
// Safe IPC handler wrapper
ipcMain.handle('channel', async (event, params) => {
  try {
    validateInput(params);
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    throw new Error('Operation failed');
  }
});
```

### React Error Boundary

```typescript
class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Render error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

## Performance Optimizations

### Build-Time

| Optimization | Tool/Method |
|--------------|-------------|
| Fast bundling | Rspack (Rust-based) |
| Minification | SWC/Terser |
| Code splitting | Entry-based chunks |
| Tree shaking | ES modules |
| Asset optimization | Rspack asset modules |

### Runtime

| Optimization | Implementation |
|--------------|----------------|
| HMR | Rspack dev server |
| Debounced search | 300ms debounce |
| Lazy windows | Create on-demand |
| Efficient IPC | Batch when possible |
