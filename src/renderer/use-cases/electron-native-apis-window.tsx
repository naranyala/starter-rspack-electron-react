import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronNativeApisWindow = ({ title, content }: WindowOptions) => {
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
          <p>Electron provides access to native OS features through its APIs: file system operations, dialog boxes, notifications, tray icons, clipboard, and more. These APIs bridge the gap between web technologies and desktop functionality.</p>
          <p>Common native integrations include file dialogs, system notifications, context menus, and deep OS integration for a native-like experience.</p>
          <h4>Common Native APIs:</h4>
          <ul>
            <li>dialog: Show native dialogs</li>
            <li>notification: Display system notifications</li>
            <li>tray: Create system tray icons</li>
            <li>clipboard: Access system clipboard</li>
            <li>shell: Open URLs in default applications</li>
          </ul>
          <p>Using these APIs properly enhances the desktop experience of your Electron application.</p>
        `;
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Electron provides access to native OS features through its APIs: file system operations, dialog boxes, notifications, tray icons, clipboard, and more. These APIs bridge the gap between web technologies and desktop functionality.</p>
          <p>Common native integrations include file dialogs, system notifications, context menus, and deep OS integration for a native-like experience.</p>
          <h4>Common Native APIs:</h4>
          <ul>
            <li>dialog: Show native dialogs</li>
            <li>notification: Display system notifications</li>
            <li>tray: Create system tray icons</li>
            <li>clipboard: Access system clipboard</li>
            <li>shell: Open URLs in default applications</li>
          </ul>
          <p>Using these APIs properly enhances the desktop experience of your Electron application.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};