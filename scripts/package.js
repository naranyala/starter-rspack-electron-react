const { spawnSync } = require('child_process');
const path = require('path');

/**
 * Enhanced packaging script with better error handling
 */
class Packager {
  constructor() {
    this.config = {
      buildScript: './scripts/build.js',
      electronBuilderCmd: 'electron-builder',
    };
  }

  log(level, message) {
    const timestamp = new Date().toISOString().substring(11, 19);
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (level === 'error') {
      console.error(`${prefix} ${message}`);
    } else if (level === 'warn') {
      console.warn(`${prefix} ${message}`);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Executes command with proper error handling
   */
  executeCommand(command, args, options = {}) {
    this.log('info', `Running: ${command} ${args.join(' ')}`);

    const result = spawnSync(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options,
    });

    if (result.status !== 0) {
      throw new Error(`Command failed with exit code ${result.status}`);
    }

    return result;
  }

  /**
   * Checks if required tools are available
   */
  checkDependencies() {
    try {
      // Check if electron-builder is available
      this.executeCommand('bunx', ['electron-builder', '--version'], { stdio: 'pipe' });
      this.log('info', '✅ electron-builder is available');
    } catch (error) {
      throw new Error(
        'electron-builder is not installed. Please install it with: bun install --dev electron-builder'
      );
    }
  }

  /**
   * Gets package information
   */
  getPackageInfo() {
    const fs = require('fs');
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return {
        name: packageJson.name || 'electron-app',
        version: packageJson.version || '1.0.0',
        description: packageJson.description || '',
      };
    } catch (error) {
      throw new Error('Could not read package.json');
    }
  }

  /**
   * Main packaging process
   */
  async package() {
    this.log('info', '📦 Starting application packaging...');

    try {
      // Check dependencies
      this.checkDependencies();

      // Get package info
      const packageInfo = this.getPackageInfo();
      this.log('info', `Packaging: ${packageInfo.name} v${packageInfo.version}`);

      // Step 1: Build the application
      this.log('info', 'Step 1/3: Building application...');
      this.executeCommand('node', [this.config.buildScript]);

      // Step 2: Package with electron-builder
      this.log('info', 'Step 2/3: Creating distributable packages...');
      this.executeCommand('bunx', [this.config.electronBuilderCmd]);

      // Step 3: Show results
      this.log('info', 'Step 3/3: Verifying output...');

      // Try to list output files
      const fs = require('fs');
      const distDir = 'dist';

      if (fs.existsSync(distDir)) {
        const files = fs.readdirSync(distDir).filter((file) => {
          return /\.(exe|dmg|deb|AppImage|zip|tar\.gz)$/i.test(file);
        });

        if (files.length > 0) {
          this.log('success', '✨ Packaging completed successfully!');
          this.log('info', 'Generated packages:');
          files.forEach((file) => {
            const filePath = path.join(distDir, file);
            const stats = fs.statSync(filePath);
            const size = (stats.size / (1024 * 1024)).toFixed(2);
            this.log('info', `  📄 ${file} (${size} MB)`);
          });
        } else {
          this.log('warn', 'No distributable files found in dist directory');
        }
      }

      this.log('info', '📁 Output directory: dist/');
    } catch (error) {
      this.log('error', `❌ Packaging failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run packaging
if (require.main === module) {
  const packager = new Packager();
  packager.package().catch(console.error);
}

module.exports = Packager;
