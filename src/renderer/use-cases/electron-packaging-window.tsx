import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronPackagingWindow = ({ title, content }: WindowOptions) => {
  const windowTheme = generateTheme(title);

  const winbox = new WinBox({
    title: title,
    html: `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};" class="winbox-dynamic-content">Loading content...</div></div>`,
    width: '500px',
    height: '400px',
    x: 'center',
    y: 'center',
    class: 'modern',
    background: windowTheme.bg,
    border: 4,
  });

  // Set the content after the window is created
  setTimeout(() => {
    if (winbox && winbox.body) {
      const contentDiv = winbox.body.querySelector('.winbox-dynamic-content');
      if (contentDiv) {
        contentDiv.innerHTML = `
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
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Electron applications can be packaged for distribution using tools like electron-builder, electron-forge, or electron-packager. These tools create installable executables for Windows, macOS, and Linux.</p>
          <p>Configuration includes app metadata, icons, installer options, and platform-specific settings. Proper packaging ensures a professional user experience across all platforms.</p>
          <h4>Packaging Tools:</h4>
          <ul>
            <li>electron-builder: Complete solution with many features</li>
            <li>electron-forge: Comprehensive tool with multiple plugins</li>
            <li>electron-packager: Simple packaging solution</li>
          </ul>
          <p>Choose the right packaging tool based on your application's needs and distribution requirements.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};