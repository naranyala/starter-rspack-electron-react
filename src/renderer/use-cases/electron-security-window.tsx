import WinBox from 'winbox/src/js/winbox';
import { generateTheme } from '../window-generator';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronSecurityWindow = ({ title, content }: WindowOptions) => {
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
          <p>Security is crucial in Electron applications. Important practices include: enabling context isolation, disabling nodeIntegration when possible, using CSP (Content Security Policy), validating all input, and sanitizing user-provided content.</p>
          <p>Always run Electron in a secure context and keep your dependencies updated. Follow the principle of least privilege for all operations.</p>
          <h4>Security Best Practices:</h4>
          <ul>
            <li>Enable context isolation</li>
            <li>Disable nodeIntegration when not needed</li>
            <li>Use Content Security Policy (CSP)</li>
            <li>Validate and sanitize all inputs</li>
            <li>Keep dependencies updated</li>
          </ul>
          <p>Implementing these security measures helps protect your application and users from potential threats.</p>
        `;
      } else {
        winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">
          <p>Security is crucial in Electron applications. Important practices include: enabling context isolation, disabling nodeIntegration when possible, using CSP (Content Security Policy), validating all input, and sanitizing user-provided content.</p>
          <p>Always run Electron in a secure context and keep your dependencies updated. Follow the principle of least privilege for all operations.</p>
          <h4>Security Best Practices:</h4>
          <ul>
            <li>Enable context isolation</li>
            <li>Disable nodeIntegration when not needed</li>
            <li>Use Content Security Policy (CSP)</li>
            <li>Validate and sanitize all inputs</li>
            <li>Keep dependencies updated</li>
          </ul>
          <p>Implementing these security measures helps protect your application and users from potential threats.</p>
        </div></div>`;
      }
    }
  }, 10);

  return winbox;
};