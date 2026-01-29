# RSPack Electron React Starter

A modern, minimal Electron + React.js boilerplate using [RSPack](https://www.rspack.dev/) as the bundler. RSPack is a fast Rust-based bundler that offers excellent performance for Electron applications.

## Features

- **Fast Bundling**: Powered by RSPack, a high-performance Rust-based bundler
- **Modern Stack**: React 19+, TypeScript, Styled Components
- **Hot Reload**: Automatic reloading during development
- **TypeScript Support**: Full TypeScript configuration out of the box
- **Styling**: CSS and Styled Components support
- **Production Ready**: Built-in packaging with electron-builder
- **Code Quality**: Biome.js for formatting and linting

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
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
   ```

## Usage

### Development Mode

Start the development server and Electron app:

```bash
# Start the development server with hot reload
bun run dev
```

This command will:
- Start the RSPack development server with hot module replacement
- Launch the Electron app connected to the dev server
- Enable development features for debugging

### Production Build

Build the application for production:

```bash
# Bundle the application code
bun run build
```

### Packaging

Create distributable executables:

```bash
# Create packaged app for your platform
bun run dist
```

## Project Structure

```
starter-rspack-electron-react/
├── main.cjs                    # Electron main process entry point
├── preload.js                  # Preload script for Electron
├── rspack.config.cjs           # RSPack configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── biome.json                  # Biome.js configuration for linting/formatting
├── scripts/                    # Development and build scripts
│   ├── build.js                # Build script
│   ├── dev-runner.js           # Development server runner
│   ├── electron-launcher.js    # Electron launcher utility
│   └── build-icons.js          # Icon building script
├── src/
│   ├── main/                   # Electron main process code
│   │   └── config.js           # Application configuration
│   ├── renderer/               # React components and logic
│   │   ├── App.tsx             # Main React component
│   │   ├── index.tsx           # React entry point
│   │   └── components/         # React components
│   ├── assets/                 # Static assets
│   ├── index.html              # HTML template
│   └── reset.css               # CSS reset
└── dist/                       # Build output directory
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development environment with hot reload |
| `build` | Build application for production |
| `start` | Start Electron app in production mode |
| `dist` | Build and package application for distribution |

## Technologies Used

- **[Electron](https://www.electronjs.org/)**: Cross-platform desktop apps with JavaScript, HTML, and CSS
- **[React](https://reactjs.org/)**: JavaScript library for building user interfaces
- **[RSPack](https://www.rspack.dev/)**: Fast Rust-based bundler for web applications
- **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript
- **[Styled Components](https://styled-components.com/)**: Visual primitives for styling components
- **[Biome.js](https://biomejs.dev/)**: Formatter, linter, and more for JavaScript/TypeScript
- **[electron-builder](https://www.electron.build/)**: Solutions for packaging and building Electron apps

## Development Workflow

The development environment uses a client-server architecture:
1. RSPack serves the React application on `http://localhost:1234`
2. Electron connects to this development server
3. Changes to React components trigger hot reload in the Electron window

## Configuration

The application can be configured via `src/main/config.js`:

- Window dimensions and minimum sizes
- Web preferences for the renderer process
- Menu configurations
- Application metadata

## Troubleshooting

### Common Issues

- If you encounter issues with the development server, ensure that port 1234 is available
- For build issues, try cleaning the node_modules and reinstalling dependencies
- If Electron fails to start, verify that all required dependencies are installed

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

- RSPack team for creating a fast Rust-based bundler
- Electron team for the cross-platform desktop application framework
- React team for the component-based UI library