import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronVersionsWindow = ({ title, content }: WindowOptions) => {
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
          <p>Managing Electron versions is important for stability and security. Regularly update to newer versions to get security patches and performance improvements. Consider the compatibility of Node.js and Chromium versions in each Electron release.</p>
          <p>Test your application thoroughly after version upgrades and maintain a consistent version across your team to avoid compatibility issues.</p>
          <h4>Version Management:</h4>
          <ul>
            <li>Regular updates for security</li>
            <li>Compatibility testing</li>
            <li>Team consistency</li>
            <li>Dependency management</li>
            <li>Changelog review</li>
          </ul>
          <p>Staying current with Electron versions helps maintain application security and performance.</p>
        `;
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Managing Electron versions is important for stability and security. Regularly update to newer versions to get security patches and performance improvements. Consider the compatibility of Node.js and Chromium versions in each Electron release.</p>
          <p>Test your application thoroughly after version upgrades and maintain a consistent version across your team to avoid compatibility issues.</p>
          <h4>Version Management:</h4>
          <ul>
            <li>Regular updates for security</li>
            <li>Compatibility testing</li>
            <li>Team consistency</li>
            <li>Dependency management</li>
            <li>Changelog review</li>
          </ul>
          <p>Staying current with Electron versions helps maintain application security and performance.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};