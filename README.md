# RSPack Electron React Starter

A modern, minimal Electron + React.js boilerplate using [RSPack](https://www.rspack.dev/) as the bundler. RSPack is a fast Rust-based bundler that offers excellent performance for Electron applications.

## Features

- ⚡ **Fast Bundling**: Powered by RSPack, a high-performance Rust-based bundler
- 🚀 **Modern Stack**: React 17+, TypeScript, Styled Components
- 💥 **Hot Reload**: Automatic reloading during development
- 🔧 **TypeScript Support**: Full TypeScript configuration out of the box
- 🎨 **Styling**: CSS and Styled Components support
- 📦 **Production Ready**: Built-in packaging with electron-builder
- ✨ **Code Quality**: Biome.js for formatting and linting

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Bun](https://bun.sh/) (for faster package management and script execution)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd starter-rspack-electron-react
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

## Usage

### Development Mode

Run these commands to start the development server and Electron app:

```bash
# Start the development server with hot reload
bun run dev
# or
npm run dev
```

This will:
- Start the RSPack development server with hot module replacement
- Launch the Electron app connected to the dev server
- Enable developer tools for debugging

### Alternative Development Commands

If you prefer to run the processes separately:

```bash
# Terminal 1: Start RSPack dev server
bun run rspack-dev

# Terminal 2: Start Electron app in development mode
bun run electron-dev
```

### Production Build

To build the application for production:

```bash
# Bundle the application code
bun run build
# or
npm run build
```

### Packaging

To create distributable executables:

```bash
# Create packaged app for your platform
bun run dist
# or
npm run dist
```

For platform-specific builds:

```bash
# Create executables without building first
bun run electron-dist
# or
npm run electron-dist
```

## Project Structure

```
starter-rspack-electron-react/
├── main.cjs                 # Electron main process entry point
├── rspack.config.cjs        # RSPack configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── biome.json              # Biome.js configuration for linting/formatting
├── scripts/                # Development scripts
│   ├── start-dev.js        # Development server startup script
│   └── build-icons.js      # Icon building script
├── src/
│   ├── main/               # Electron main process code
│   │   └── config.js       # Application configuration
│   ├── renderer/           # Renderer process code (separated for organization)
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main React component
│   ├── index.tsx           # React entry point
│   ├── index.html          # HTML template
│   └── index.js            # Legacy JavaScript entry point
└── dist/                   # Build output directory
```

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server with auto-reload |
| `rspack-dev` | Start RSPack development server only |
| `electron-dev` | Start Electron app in development mode |
| `start` | Start Electron app in production mode |
| `build` | Build application for production |
| `rspack-build` | Run RSPack build only |
| `dist` | Build and package application for distribution |
| `electron-dist` | Package application without rebuilding |
| `type-check` | Check TypeScript types |
| `lint` | Lint and fix code with Biome.js |
| `lint-check` | Check code for linting issues |
| `format` | Format code with Biome.js |
| `format-check` | Check code formatting |

## Technologies Used

- **[Electron](https://www.electronjs.org/)**: Build cross-platform desktop apps with JavaScript, HTML, and CSS
- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces
- **[RSPack](https://www.rspack.dev/)**: A fast Rust-based bundler for web applications
- **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript
- **[Styled Components](https://styled-components.com/)**: Visual primitives for styling components
- **[Biome.js](https://biomejs.dev/)**: Formatter, linter, and more for JavaScript/TypeScript
- **[electron-builder](https://www.electron.build/)**: Solutions for packaging and building Electron apps

## Configuration

The application can be configured via `src/main/config.js`:

- Window dimensions and minimum sizes
- Web preferences for the renderer process
- Menu configurations
- Application metadata

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the RSPack team for creating a blazing-fast bundler
- Inspired by various Electron + React starter templates