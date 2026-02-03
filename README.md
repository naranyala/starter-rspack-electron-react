# RSPack Electron React Starter

A production-ready boilerplate for building high-performance cross-platform desktop applications with modern web technologies. Engineered for enterprise teams and indie developers who demand speed, reliability, and maintainability.

---

## Overview

This starter template combines the best-in-class tools for desktop application development: **Electron** for native capabilities, **React 19** for reactive UI, **RSPack** for blazing-fast builds, and **TypeScript** for type safety. Whether you're building internal tools, SaaS applications, or consumer software, this foundation accelerates your path from concept to production.

---

## Why Choose This Starter

### Performance First
RSPack's Rust-based architecture delivers build times up to 10x faster than webpack, with near-instant hot module replacement that keeps developers in flow state.

### Production Ready
Pre-configured with electron-builder for automated packaging, code signing, and auto-updater integration. Deploy to Windows, macOS, and Linux from a single codebase.

### Clean Architecture
Modular use-case pattern separates business logic from presentation, making the codebase scalable and testable as your application grows.

### Developer Experience
Type-safe APIs between main and renderer processes, comprehensive error handling, and debugging configurations that work out of the box.

---

## Key Features

**Build Performance**
- RSPack bundler with Rust-based compilation
- Instant hot module replacement
- Optimized production builds with tree shaking

**Modern Stack**
- React 19 with concurrent features
- TypeScript 5.9 with strict type checking
- Electron 40 with latest security patches

**Desktop Capabilities**
- Native window management with WinBox.js
- System tray integration ready
- Auto-updater infrastructure
- Native API access (file system, notifications, etc.)

**Code Quality**
- Modular architecture with clean separation
- Fuzzy search functionality built-in
- Comprehensive IPC type safety
- Pre-configured linting and formatting

**Distribution**
- One-command packaging for all platforms
- Code signing configuration
- Installer generation (DMG, MSI, AppImage, DEB)
- Auto-update server integration hooks

---

## Quick Start

### Prerequisites

- Bun v1.0 or higher
- Node.js v18+ (for Electron compatibility)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/starter-rspack-electron-react.git
cd starter-rspack-electron-react

# Install dependencies
bun install
```

### Development

```bash
# Start development server with hot reload
bun run dev
```

The application will launch with development tools enabled and hot module replacement active.

### Building

```bash
# Create production build
bun run build

# Test production build locally
bun run start
```

### Distribution

```bash
# Package for current platform
bun run dist

# Package for all platforms (requires proper signing certificates)
bun run dist -- --mac --win --linux
```

---

## Architecture

```
starter-rspack-electron-react/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── handlers/           # IPC handlers
│   │   └── use-cases/          # Backend business logic
│   ├── renderer/               # React application
│   │   ├── components/         # UI components
│   │   ├── features/           # Feature modules
│   │   ├── use-cases/          # Frontend business logic
│   │   └── utils/              # Utilities (WinBox, etc.)
│   └── types/                  # Shared TypeScript definitions
├── scripts/                    # Build and dev scripts
├── rspack.config.ts           # Bundler configuration
└── package.json               # Dependencies and scripts
```

### Process Communication

Type-safe IPC between main and renderer processes ensures reliable communication without runtime errors.

### Window Management

Integrated WinBox.js provides floating, resizable windows for multi-window applications with professional styling.

---

## Technology Stack

| Component          | Technology                  | Purpose                           |
|-------------------|---------------------------|-----------------------------------|
| Framework         | Electron 40               | Cross-platform desktop runtime    |
| UI Library        | React 19                  | Component-based user interfaces   |
| Bundler           | RSPack 1.7                | High-performance asset bundling   |
| Language          | TypeScript 5.9            | Type-safe development             |
| Runtime           | Bun                       | Fast package management and execution |
| Styling           | CSS Modules / Styled Components | Component-scoped styling    |
| Packaging         | electron-builder          | Distribution and installer creation |
| Window Management | WinBox.js                 | Floating window system            |

---

## Use Cases

This starter is ideal for:

- **Enterprise Applications**: Internal tools, dashboards, and admin panels
- **Developer Tools**: IDEs, code editors, and debugging utilities
- **SaaS Desktop Clients**: Companion applications for web services
- **Data Visualization**: Analytics tools and reporting dashboards
- **Productivity Software**: Note-taking, project management, and workflow tools
- **Media Applications**: Audio/video players and editing tools

---

## Customization

### Adding New Features

1. Create feature components in `src/renderer/features/`
2. Add IPC handlers in `src/main/handlers/`
3. Update window creators in `src/renderer/utils/winbox-utils.ts`

### Modifying the Build

Edit `rspack.config.ts` to customize:
- Entry points and output
- Loader configurations
- Plugin settings
- Development server options

### Theming

Customize the appearance by editing:
- `src/App.css` for global styles
- Component-level CSS for scoped styling
- WinBox configuration in `winbox-utils.ts` for window themes

---

## Performance Benchmarks

Based on typical applications:

- **Development startup**: < 2 seconds
- **Hot reload**: < 100ms
- **Production build**: 5-10 seconds (vs 30-60s with webpack)
- **Bundle size**: Optimized with tree shaking and code splitting

---

## Requirements

- **Bun**: v1.0.0 or higher
- **Node.js**: v18.0.0 or higher (for Electron compatibility)
- **Operating Systems**:
  - macOS 10.14+ (for Mac builds)
  - Windows 10+ (for Windows builds)
  - Ubuntu 18.04+ / Fedora 30+ (for Linux builds)

---

## Contributing

Contributions are welcome. Please ensure:

1. TypeScript compiles without errors (`bun run tsc`)
2. Code follows existing patterns and conventions
3. Changes are tested across platforms when applicable
4. Documentation is updated for significant changes

---

## Support

For issues, questions, or feature requests:

- Open an issue on GitHub
- Review existing documentation and examples
- Check the Electron and RSPack documentation for underlying technology questions

---

## License

MIT License. See [LICENSE](LICENSE) file for full details.

---

## Acknowledgments

Built with:
- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [RSPack](https://www.rspack.dev/)
- [WinBox.js](https://nextapps-de.github.io/winbox/)
