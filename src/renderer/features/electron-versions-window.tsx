import { createWinBoxWindow } from '../../renderer/utils/winbox-utils';

interface WindowOptions {
  title: string;
  content?: string;
}

export const createElectronVersionsWindow = async ({ title, content }: WindowOptions) => {
  const versionsContent = `
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

  return await createWinBoxWindow({
    title,
    content: versionsContent,
    width: '500px',
    height: '400px'
  });
};
