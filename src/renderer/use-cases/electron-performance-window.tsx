import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronPerformanceWindow = ({ title, content }: WindowOptions) => {
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
          <p>Optimizing Electron apps involves reducing memory usage, improving startup time, and efficient resource management. Techniques include code splitting, lazy loading, proper cleanup of event listeners, and optimizing asset loading.</p>
          <p>Monitor performance with Chrome DevTools and consider using native modules for CPU-intensive tasks. Efficient IPC communication also improves responsiveness.</p>
          <h4>Performance Strategies:</h4>
          <ul>
            <li>Minimize main process work</li>
            <li>Optimize renderer process resources</li>
            <li>Efficient IPC communication</li>
            <li>Memory leak prevention</li>
            <li>Asset optimization</li>
          </ul>
          <p>Regular performance monitoring helps maintain a responsive Electron application.</p>
        `;
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Optimizing Electron apps involves reducing memory usage, improving startup time, and efficient resource management. Techniques include code splitting, lazy loading, proper cleanup of event listeners, and optimizing asset loading.</p>
          <p>Monitor performance with Chrome DevTools and consider using native modules for CPU-intensive tasks. Efficient IPC communication also improves responsiveness.</p>
          <h4>Performance Strategies:</h4>
          <ul>
            <li>Minimize main process work</li>
            <li>Optimize renderer process resources</li>
            <li>Efficient IPC communication</li>
            <li>Memory leak prevention</li>
            <li>Asset optimization</li>
          </ul>
          <p>Regular performance monitoring helps maintain a responsive Electron application.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};