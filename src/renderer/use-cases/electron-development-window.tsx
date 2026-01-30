import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronDevelopmentWindow = ({ title, content }: WindowOptions) => {
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
          <p>Effective Electron development involves using tools like Hot Module Replacement (HMR), development servers, and proper debugging setups. Use electron-reload for automatic restarts during development.</p>
          <p>Separate development and production configurations, implement proper error handling, and use build tools to automate repetitive tasks for a smooth development experience.</p>
          <h4>Development Tools:</h4>
          <ul>
            <li>Hot Module Replacement (HMR)</li>
            <li>Development servers</li>
            <li>Debugging tools</li>
            <li>Build automation</li>
            <li>Testing frameworks</li>
          </ul>
          <p>A well-configured development environment significantly improves productivity.</p>
        `;
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Effective Electron development involves using tools like Hot Module Replacement (HMR), development servers, and proper debugging setups. Use electron-reload for automatic restarts during development.</p>
          <p>Separate development and production configurations, implement proper error handling, and use build tools to automate repetitive tasks for a smooth development experience.</p>
          <h4>Development Tools:</h4>
          <ul>
            <li>Hot Module Replacement (HMR)</li>
            <li>Development servers</li>
            <li>Debugging tools</li>
            <li>Build automation</li>
            <li>Testing frameworks</li>
          </ul>
          <p>A well-configured development environment significantly improves productivity.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};