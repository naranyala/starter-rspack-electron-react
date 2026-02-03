import { createWinBoxWindow } from '../../renderer/utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronPackagingWindow = async ({ title, content }: WindowOptions) => {
  const packagingContent = `
    <p>Electron applications can be packaged for distribution using tools like electron-builder, electron-forge, or electron-packager. These tools create installable executables for Windows, macOS, and Linux.</p>
    <p>Configuration includes app metadata, icons, installer options, and platform-specific settings. Proper packaging ensures a professional user experience across all platforms.</p>
    <h4>Packaging Tools:</h4>
    <ul>
      <li>electron-builder: Complete solution with many features</li>
      <li>electron-forge: Comprehensive tool with multiple plugins</li>
      <li>electron-packager: Simple packaging solution</li>
    </ul>
    <p>Choose the right packaging tool based on your application's needs and distribution requirements.</p>
  `;

  return await createWinBoxWindow({
    title,
    content: packagingContent,
    width: '500px',
    height: '400px'
  });
};
