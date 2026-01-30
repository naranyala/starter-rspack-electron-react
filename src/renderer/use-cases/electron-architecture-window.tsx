import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronArchitectureWindow = ({ title, content }: WindowOptions) => {
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
          <p>Electron applications have two main processes: the Main Process and the Renderer Process. The Main Process controls the life cycle of the app and creates browser windows. The Renderer Process renders the UI and runs in the browser window.</p>
          <p>Communication between processes happens via IPC (Inter-Process Communication). This architecture allows for secure separation of concerns while maintaining flexibility.</p>
          <h4>Process Types:</h4>
          <ul>
            <li>Main Process: Controls app lifecycle, creates windows</li>
            <li>Renderer Process: Runs in browser windows, handles UI</li>
            <li>Preload Scripts: Bridge between main and renderer</li>
          </ul>
          <p>Understanding this architecture is crucial for building secure and efficient Electron applications.</p>
        `;
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Electron applications have two main processes: the Main Process and the Renderer Process. The Main Process controls the life cycle of the app and creates browser windows. The Renderer Process renders the UI and runs in the browser window.</p>
          <p>Communication between processes happens via IPC (Inter-Process Communication). This architecture allows for secure separation of concerns while maintaining flexibility.</p>
          <h4>Process Types:</h4>
          <ul>
            <li>Main Process: Controls app lifecycle, creates windows</li>
            <li>Renderer Process: Runs in browser windows, handles UI</li>
            <li>Preload Scripts: Bridge between main and renderer</li>
          </ul>
          <p>Understanding this architecture is crucial for building secure and efficient Electron applications.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};