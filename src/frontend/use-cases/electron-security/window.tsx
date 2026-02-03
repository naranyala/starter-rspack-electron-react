import { createWinBoxWindow } from '../../utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronSecurityWindow = async ({ title, content }: WindowOptions) => {
  const securityContent = `
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

  return await createWinBoxWindow({
    title,
    content: securityContent,
    width: '500px',
    height: '400px'
  });
};
