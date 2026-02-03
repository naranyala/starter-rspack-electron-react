import * as fs from 'fs';
import * as path from 'path';

// Copy icon files to dist directory (final build output)
function copyIcons(): void {
  const assetsDir = path.join(__dirname, '..', 'src', 'assets');
  const distDir = path.join(__dirname, '..', 'dist');

  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy icon files
  const iconFiles = ['icon.ico', 'favicon.ico'];

  iconFiles.forEach((file) => {
    const sourcePath = path.join(assetsDir, file);
    const distDestPath = path.join(distDir, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, distDestPath);
      console.log(`Copied ${sourcePath} to ${distDestPath}`);
    } else {
      console.warn(`Warning: ${sourcePath} does not exist`);
    }
  });
}

copyIcons();