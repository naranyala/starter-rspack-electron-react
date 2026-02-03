import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Enhanced build script with better error handling and asset management
 */
class Builder {
  private config: {
    sourceDir: string;
    outputDir: string;
    assetsDir: string;
    mainFile: string;
  };

  constructor() {
    this.config = {
      sourceDir: 'src',
      outputDir: 'dist',
      assetsDir: 'src/assets',
      mainFile: 'main.cjs',
    };
  }

  log(level: 'info' | 'warn' | 'error' | 'success', message: string): void {
    const timestamp = new Date().toISOString().substring(11, 19);
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (level === 'error') {
      console.error(`${prefix} ${message}`);
    } else if (level === 'warn') {
      console.warn(`${prefix} ${message}`);
    } else if (level === 'success') {
      console.log(`${prefix} ${message}`);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  /**
   * Executes command with proper error handling
   */
  executeCommand(command: string, args: string[], options: any = {}): any {
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
   * Ensures directory exists
   */
  ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      this.log('info', `Created directory: ${dirPath}`);
    }
  }

  /**
   * Copies files from source to destination
   */
  copyFiles(srcDir: string, destDir: string, pattern: RegExp = /\.(png|ico|svg|jpg|jpeg)$/i): void {
    if (!fs.existsSync(srcDir)) {
      this.log('warn', `Source directory does not exist: ${srcDir}`);
      return;
    }

    this.ensureDirectory(destDir);
    const files = fs.readdirSync(srcDir);

    let copiedCount = 0;
    for (const file of files) {
      if (pattern.test(file)) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        fs.copyFileSync(srcPath, destPath);
        this.log('info', `Copied: ${file}`);
        copiedCount++;
      }
    }

    this.log('info', `Copied ${copiedCount} asset files`);
  }

  /**
   * Copies main process files to dist
   */
  copyMainFiles(): void {
    this.ensureDirectory(this.config.outputDir);

    // Copy main.cjs
    const mainSrc = path.join(this.config.mainFile);
    const mainDest = path.join(this.config.outputDir, path.basename(this.config.mainFile));

    if (fs.existsSync(mainSrc)) {
      fs.copyFileSync(mainSrc, mainDest);
      this.log('info', 'Copied main process file');
    } else {
      throw new Error(`Main file not found: ${mainSrc}`);
    }

    // Copy package.json for dependencies
    const packageSrc = 'package.json';
    const packageDest = path.join(this.config.outputDir, 'package.json');

    if (fs.existsSync(packageSrc)) {
      const packageJson = JSON.parse(fs.readFileSync(packageSrc, 'utf8'));

      // Include only production dependencies for the built app
      const builtPackageJson = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        main: path.basename(this.config.mainFile),
        dependencies: packageJson.dependencies,
      };

      fs.writeFileSync(packageDest, JSON.stringify(builtPackageJson, null, 2));
      this.log('info', 'Copied package.json (production only)');
    }
  }

  /**
   * Validates build output
   */
  validateBuild(): void {
    const requiredFiles = ['index.html', path.basename(this.config.mainFile)];

    const missingFiles: string[] = [];
    for (const file of requiredFiles) {
      const filePath = path.join(this.config.outputDir, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Build validation failed. Missing files: ${missingFiles.join(', ')}`);
    }

    this.log('info', '✅ Build validation passed');
  }

  /**
   * Main build process
   */
  async build(): Promise<void> {
    this.log('info', '🏗️  Starting build process...');

    try {
      // Clean previous build
      if (fs.existsSync(this.config.outputDir)) {
        fs.rmSync(this.config.outputDir, { recursive: true, force: true });
        this.log('info', 'Cleaned previous build');
      }

      // Run rspack build
      this.log('info', 'Building frontend assets...');
      this.executeCommand('npx', ['@rspack/cli', 'build']);

      // Copy assets
      this.log('info', 'Copying assets...');
      this.copyFiles(this.config.assetsDir, this.config.outputDir);

      // Copy main process files
      this.copyMainFiles();

      // Validate build
      this.validateBuild();

      // Show build summary
      const stats = fs.statSync(this.config.outputDir);
      this.log('success', '✨ Build completed successfully!');
      this.log('info', `Output directory: ${this.config.outputDir}`);
    } catch (error: any) {
      this.log('error', `❌ Build failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the build
if (require.main === module) {
  const builder = new Builder();
  builder.build().catch(console.error);
}

export default Builder;